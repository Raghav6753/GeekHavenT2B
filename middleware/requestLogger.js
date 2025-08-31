import { getRedis } from '../utils/redisClient.js';

const FALLBACK = [];

export async function requestLogger(req, res, next) {
  const entry = {
    ts: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    user: req.user ? req.user.email : null,
    body: '[redacted]'
  };
  const redis = getRedis();
  if (redis) {
    try {
      await redis.lPush('recent_logs', JSON.stringify(entry));
      await redis.lTrim('recent_logs', 0, 199);
      return next();
    } catch (e) {}
  }
  FALLBACK.unshift(entry);
  if (FALLBACK.length > 200) FALLBACK.pop();
  next();
}

export async function getRecentLogs(limit = 50) {
  const redis = getRedis();
  if (redis) {
    try {
      const items = await redis.lRange('recent_logs', 0, limit - 1);
      return items.map((s) => JSON.parse(s));
    } catch (e) {}
  }
  return FALLBACK.slice(0, limit);
}
