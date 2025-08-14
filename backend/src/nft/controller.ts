import { Router, Request, Response } from "express";
import { authenticate } from "../auth/middleware";
import { createNft, getNft, listMyNfts, transferNft } from "./service";

const router = Router();

// POST /api/nft/upload
router.post("/upload", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const { title, description, chain, network, artworkId, cid, url, filename, mimeType, size } = req.body || {};

    if (!title || !chain || !network) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const nft = await createNft({
      userId,
      title,
      description,
      chain,
      network,
      artworkId,
      cid,
      url,
      filename,
      mimeType,
      size,
    });

    res.json(nft);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "server_error" });
  }
});

// GET /api/nft/mine
router.get("/mine", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const nfts = await listMyNfts(userId);
    res.json(nfts);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "server_error" });
  }
});

// GET /api/nft/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  const nft = await getNft(req.params.id);
  if (!nft) return res.status(404).json({ error: "not_found" });
  res.json(nft);
});

// POST /api/nft/:id/transfer  { toUserId }
router.post("/:id/transfer", authenticate, async (req: Request, res: Response) => {
  try {
    const fromUserId = req.user!.sub;
    const toUserId = req.body?.toUserId;
    if (!toUserId) return res.status(400).json({ error: "missing_toUserId" });

    const updated = await transferNft({ nftId: req.params.id, fromUserId, toUserId });
    res.json(updated);
  } catch (e: any) {
    if (e?.message === "not_owner") return res.status(403).json({ error: "not_owner" });
    if (e?.message === "nft_not_found") return res.status(404).json({ error: "not_found" });
    res.status(500).json({ error: e?.message ?? "server_error" });
  }
});

export default router;
