import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

export async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('_id name email role');
    if (!admin) return res.status(401).json({ message: 'Invalid session' });
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
}
