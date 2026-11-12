import { Router } from 'express';
import { Enquiry } from '../models/index.js';
const router = Router();
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) return res.status(400).json({ message: 'Name, email and message are required' });
    const enquiry = await Enquiry.create({ ...req.body, name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() });
    res.status(201).json({ message: 'Your enquiry has been submitted successfully', id: enquiry._id });
  } catch (error) { next(error); }
});
export default router;
