import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlist.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);

export default router;
