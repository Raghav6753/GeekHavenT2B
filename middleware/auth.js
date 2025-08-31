import jwt from 'jsonwebtoken';
import { getAssignmentSeed } from '../utils/seedUtils.js';

const USER_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ADMIN_SECRET = process.env.ASSIGNMENT_SEED || 'GHW25-DEFAULT';

export function verifyToken(req, res, next) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, USER_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    try {
      const payload = jwt.verify(token, ADMIN_SECRET);
      req.user = payload;
      req.user.isAdmin = true;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ error: 'Admin required' });
}
