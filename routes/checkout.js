import express from 'express';
import { checkoutRateLimiter } from '../middleware/rateLimit.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';
import { hmacSignature, generateSku, platformFee, getAssignmentSeed } from '../utils/seedUtils.js';

const router = express.Router();

router.post('/', checkoutRateLimiter, idempotencyMiddleware, async (req, res) => {
  try {
    const { items, paymentMethod, user } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items to checkout' });
    }
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
    const fee = platformFee(subtotal);
    const total = subtotal + fee;

    const order = {
      id: `ORD-${Date.now()}`,
      sku: generateSku(getAssignmentSeed(), Date.now()),
      items,
      subtotal,
      fee,
      total,
      createdAt: new Date().toISOString(),
      user: user || null,
      paymentMethod: paymentMethod || 'mock'
    };

    const signature = hmacSignature(order);
    res.setHeader('X-Signature', signature);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
