import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireAuth } from "../auth/middleware";
import { normalizeEvmAddress, normalizeSolAddress } from "./normalize";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { verifyMessage } from "viem";
import prisma from "../lib/prisma";
export const walletRouter = Router();

const WalletChainSchema = z.enum(["EVM", "SOLANA"]);
type WalletChain = z.infer<typeof WalletChainSchema>;

const ChallengeSchema = z.object({
  chain: WalletChainSchema,
  network: z.string().min(1),
  address: z.string().min(1),
});

walletRouter.post("/challenge", authenticate, requireAuth, async (req, res) => {
  const parsed = ChallengeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { chain, network, address } = parsed.data;

  let norm:
    | { address: string; addressNormalized: string; publicKey: string | null; alg: "secp256k1" | "ed25519" }
    | undefined;

  try {
    norm = chain === "EVM" ? normalizeEvmAddress(address) : normalizeSolAddress(address);
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "invalid_address" });
  }

  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const message = `Sign this message to link your wallet.\nNonce: ${nonce}\nDomain: ${req.hostname}`;

  const wallet = await prisma.wallet.upsert({
    where: {
      chain_network_addressNormalized: { chain, network, addressNormalized: norm.addressNormalized },
    },
    create: {
      userId: req.user!.sub,
      chain,
      network,
      address: norm.address,
      addressNormalized: norm.addressNormalized,
      publicKey: norm.publicKey,
      signatureAlg: norm.alg,
      nonce,
    },
    update: { userId: req.user!.sub, nonce },
  });

  res.json({ walletId: wallet.id, nonce, message });
});

const VerifySchema = z.object({
  chain: WalletChainSchema,
  network: z.string().min(1),
  address: z.string().min(1),
  signature: z.string().min(1), // base64 pour Solana / 0x… pour EVM
  message: z.string().min(1).optional(),
});

walletRouter.post("/verify", authenticate, requireAuth, async (req, res) => {
  const parsed = VerifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { chain, network, address, signature } = parsed.data;

  const norm = chain === "EVM" ? normalizeEvmAddress(address) : normalizeSolAddress(address);

  const wallet = await prisma.wallet.findUnique({
    where: {
      chain_network_addressNormalized: {
        chain,
        network,
        addressNormalized: norm.addressNormalized,
      },
    },
  });

  if (!wallet || wallet.userId !== req.user!.sub) {
    return res.status(404).json({ error: "wallet_not_found" });
  }
  if (!wallet.nonce) {
    return res.status(400).json({ error: "no_challenge" });
  }

  const msg: string =
    parsed.data.message ??
    `Sign this message to link your wallet.\nNonce: ${wallet.nonce}\nDomain: ${req.hostname}`;

  if (!msg.includes(wallet.nonce)) {
    return res.status(400).json({ error: "nonce_mismatch" });
  }

  let ok = false;

  try {
    if (chain === "EVM") {
      // ✅ viem v2 : un seul argument (objet)
      ok = await verifyMessage({
        address: norm.address as `0x${string}`,
        message: msg,
        signature: signature as `0x${string}`,
      });
    } else {
      const pk = new PublicKey(norm.addressNormalized);
      const msgBytes = Buffer.from(msg, "utf8");
      const sigBytes = Buffer.from(signature, "base64");
      ok = nacl.sign.detached.verify(msgBytes, sigBytes, pk.toBytes());
    }
  } catch {
    ok = false;
  }

  if (!ok) return res.status(401).json({ error: "invalid_signature" });

  await prisma.wallet.update({
    where: {
      chain_network_addressNormalized: {
        chain,
        network,
        addressNormalized: norm.addressNormalized,
      },
    },
    data: { verifiedAt: new Date(), nonce: null },
  });

  res.json({ ok: true });
});
