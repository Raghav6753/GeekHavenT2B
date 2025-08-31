import { getRedis } from '../utils/redisClient.js';

export async function idempotencyMiddleware(req, res, next) {
  const key = req.header('Idempotency-Key');
  if (!key) return next();
  const redis = getRedis();
  if (redis) {
    try {
      const existing = await redis.get(`idem:${key}`);
      if (existing) return res.status(200).json(JSON.parse(existing));
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          await redis.setEx(`idem:${key}`, 300, JSON.stringify(body));
        } catch (e) {}
        return originalJson(body);
      };
      return next();
    } catch (e) {
      return next();
    }
  }
  const inMem = global.__IDEMPOTENCY__ = global.__IDEMPOTENCY__ || new Map();
  const existing = inMem.get(key);
  if (existing) return res.status(200).json(existing);
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    try {
      inMem.set(key, body);
      setTimeout(() => inMem.delete(key), 5 * 60 * 1000);
    } catch (e) {}
    return originalJson(body);
  };
  next();
}
