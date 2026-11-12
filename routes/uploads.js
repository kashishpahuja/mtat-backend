import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = ['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf'];
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (req,file,cb) => cb(null, allowed.includes(file.mimetype)) });
router.post('/', requireAdmin, upload.single('file'), (req,res) => {
  if (!req.file) return res.status(400).json({message:'Please upload a JPG, PNG, WEBP, SVG or PDF file'});
  res.status(201).json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, filename: req.file.filename });
});
export default router;
