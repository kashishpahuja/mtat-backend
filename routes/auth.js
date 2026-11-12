import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) { next(error); }
});
router.get('/me', requireAdmin, (req, res) => res.json({ admin: req.admin }));
export default router;
