import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export async function createNft(opts: {
  userId: string;
  title: string;
  description?: string;
  chain: "EVM" | "SOLANA";
  artworkId?: string;
  network: string;
  // soit CID IPFS, soit URL (on supporte les deux)
  cid?: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
}) {
  const {
    userId,
    title,
    description,
    chain,
    network,
    artworkId,
    cid,
    url,
    filename = "nft-media",
    mimeType = "application/octet-stream",
    size = 0,
  } = opts;

  let mediaId: string;

  // 1) crée/repère le media IPFS (si CID fourni), sinon stocke une URL fallback
  if (artworkId) {
    // 🔎 on réutilise l'image de l'œuvre (IPFSMedia)
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      select: { imageId: true },
    });
    if (!artwork || !artwork.imageId) {
      throw new Error("artwork_not_found_or_no_media");
    }
    mediaId = artwork.imageId;
  } else {
    const media = await prisma.iPFSMedia.create({
      data: {
        cid: cid ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        filename,
        mimeType,
        size,
        status: cid ? "UPLOADED" : "PENDING",
        url: url ?? null,
      },
    });
    mediaId = media.id;
  }

  // 2) crée l’NFT : creator = user, owner = user (au départ)
  const nft = await prisma.nft.create({
    data: {
      title,
      description,
      chain,
      network,
      mediaId,
      creatorId: userId,
      ownerId: userId,
      status: "DRAFT",
      artworkId: artworkId ?? null,
    },
    include: { media: true },
  });

  return nft;
}

export async function getNft(id: string) {
  return prisma.nft.findUnique({
    where: { id },
    include: { media: true, owner: true, creator: true },
  });
}

export async function listMyNfts(userId: string) {
  return prisma.nft.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { media: true },
  });
}

export async function transferNft(opts: { nftId: string; fromUserId: string; toUserId: string }) {
  const { nftId, fromUserId, toUserId } = opts;
  const nft = await prisma.nft.findUnique({ where: { id: nftId } });
  if (!nft) throw new Error("nft_not_found");
  if (nft.ownerId !== fromUserId) throw new Error("not_owner");

  return prisma.nft.update({
    where: { id: nftId },
    data: { ownerId: toUserId, status: "SOLD" },
  });
}
