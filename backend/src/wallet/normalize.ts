import { getAddress, isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";

export function normalizeEvmAddress(addr: string) {
  if (!isAddress(addr)) throw new Error("invalid_evm_address");
  const checksum = getAddress(addr);
  return { address: checksum, addressNormalized: checksum.toLowerCase(), publicKey: null, alg: "secp256k1" as const };
}

export function normalizeSolAddress(addr: string) {
  const pk = new PublicKey(addr); // throws if invalid
  const base58 = pk.toBase58();
  return { address: base58, addressNormalized: base58, publicKey: base58, alg: "ed25519" as const };
}
