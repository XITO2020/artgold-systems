"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadNft = uploadNft;
exports.buyNft = buyNft;
exports.sellNft = sellNft;
exports.getUserNfts = getUserNfts;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function uploadNft(req, res) {
    const { title, mediaUrl, mediaType, categoryId } = req.body;
    const userId = req.user.userId;
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
    }
    catch (err) {
        res.status(400).json({ error: 'Erreur upload', detail: err });
    }
}
async function buyNft(req, res) {
    const nftId = req.params.nftId;
    const buyerId = req.user.userId;
    try {
        const nft = await prisma.nft.findUnique({ where: { id: nftId } });
        if (!nft)
            return res.status(404).json({ error: 'NFT introuvable' });
        const updatedNft = await prisma.nft.update({
            where: { id: nftId },
            data: { ownerId: buyerId },
        });
        res.json(updatedNft);
    }
    catch (err) {
        res.status(400).json({ error: 'Achat échoué', detail: err });
    }
}
async function sellNft(req, res) {
    const nftId = req.params.nftId;
    try {
        const updated = await prisma.nft.update({
            where: { id: nftId },
            data: { forSale: true },
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Mise en vente échouée', detail: err });
    }
}
async function getUserNfts(req, res) {
    const userId = req.user.userId;
    try {
        const nfts = await prisma.nft.findMany({ where: { ownerId: userId } });
        res.json(nfts);
    }
    catch (err) {
        res.status(400).json({ error: 'Erreur de récupération', detail: err });
    }
}
