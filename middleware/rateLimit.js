const windows = new Map();
const LIMIT = 7;
const WINDOW_MS = 60 * 1000;
export function checkoutRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = windows.get(ip) || { ts: now, count: 0 };
  if (now - entry.ts > WINDOW_MS) {
    entry.ts = now;
    entry.count = 0;
  }
  entry.count += 1;
  windows.set(ip, entry);
  if (entry.count > LIMIT) {
    return res.status(429).json({ error: 'Too many checkout requests, try later.' });
  }
  next();
}
