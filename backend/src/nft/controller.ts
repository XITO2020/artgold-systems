import { Router } from 'express';
import { authenticateToken } from '../auth/middleware';
import { uploadNft, buyNft, sellNft, getUserNfts } from './service';
import { validateUploadNft } from './validators';
import { validationResult } from 'express-validator';





const router = Router();

router.post('/upload', authenticateToken, validateUploadNft, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    return uploadNft(req, res);
  });
router.post('/buy/:nftId', authenticateToken, buyNft);
router.post('/sell/:nftId', authenticateToken, sellNft);
router.get('/library', authenticateToken, getUserNfts);



export default router;
