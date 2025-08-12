import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function uploadNft(req: Request, res: Response) {
  const { title, mediaUrl, mediaType, categoryId } = req.body;
  const userId = (req.user as any).userId;

  try {
    const nft = await prisma.nft.create({
      data: {
        title,
        mediaUrl,
        mediaType,
        categoryId,
        creatorId: userId,
        ownerId: userId,
      },
    });
    res.json(nft);
  } catch (err) {
    res.status(400).json({ error: 'Erreur upload', detail: err });
  }
}

export async function buyNft(req: Request, res: Response) {
  const nftId = req.params.nftId;
  const buyerId = (req.user as any).userId;

  try {
    const nft = await prisma.nft.findUnique({ where: { id: nftId } });
    if (!nft) return res.status(404).json({ error: 'NFT introuvable' });

    const updatedNft = await prisma.nft.update({
      where: { id: nftId },
      data: { ownerId: buyerId },
    });

    res.json(updatedNft);
  } catch (err) {
    res.status(400).json({ error: 'Achat échoué', detail: err });
  }
}

export async function sellNft(req: Request, res: Response) {
  const nftId = req.params.nftId;
  try {
    const updated = await prisma.nft.update({
      where: { id: nftId },
      data: { forSale: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Mise en vente échouée', detail: err });
  }
}

export async function getUserNfts(req: Request, res: Response) {
  const userId = (req.user as any).userId;

  try {
    const nfts = await prisma.nft.findMany({ where: { ownerId: userId } });
    res.json(nfts);
  } catch (err) {
    res.status(400).json({ error: 'Erreur de récupération', detail: err });
  }
}
