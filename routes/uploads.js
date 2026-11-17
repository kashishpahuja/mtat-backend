
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";

import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// const uploadDir = path.resolve(
//   process.cwd(),
//   process.env.UPLOAD_DIR || "uploads"
// );

// await fs.mkdir(uploadDir, { recursive: true });

import { UPLOAD_DIR } from "../config/upload.js";

const uploadDir = UPLOAD_DIR;

const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "video/webm",
];

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `temp-${crypto.randomUUID()}`);
  },
});

const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 150 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error("Unsupported file. Upload JPG, PNG, WEBP, SVG, PDF, MP4 or WebM.")
      );
    }

    cb(null, true);
  },
});

function getPublicBaseUrl(req) {
  return (
    process.env.API_PUBLIC_URL ||
    `${req.protocol}://${req.get("host")}`
  ).replace(/\/+$/, "");
}

router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    let finalPath;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a file",
        });
      }

      const tempPath = req.file.path;
      const mime = req.file.mimetype;
      const id = crypto.randomUUID();

      let filename;
      let format;
      let type;

      const isImage = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(mime);

      if (isImage) {
        filename = `${id}.webp`;
        format = "webp";
        type = "image";

        finalPath = path.join(uploadDir, filename);

        await sharp(tempPath)
          .rotate()
          .resize({
            width: 2000,
            height: 2000,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({
            quality: 82,
            effort: 5,
          })
          .toFile(finalPath);

        await fs.unlink(tempPath);
      } else {
        const extension =
          mime === "application/pdf"
            ? ".pdf"
            : mime === "image/svg+xml"
              ? ".svg"
              : mime === "video/mp4"
                ? ".mp4"
                : ".webm";

        filename = `${id}${extension}`;
        format = extension.slice(1);
        type = mime.startsWith("video/") ? "video" : "document";

        finalPath = path.join(uploadDir, filename);

        await fs.rename(tempPath, finalPath);
      }

      const baseUrl = getPublicBaseUrl(req);
      const stats = await fs.stat(finalPath);

      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        url: `${baseUrl}/uploads/${filename}`,
        filename,
        type,
        format,
        originalSize: req.file.size,
        optimizedSize: stats.size,
      });
    } catch (error) {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      if (finalPath) {
        await fs.unlink(finalPath).catch(() => {});
      }

      console.error("Upload error:", error);

      return res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }
  }
);

export default router;



// import { Router } from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { requireAdmin } from '../middleware/auth.js';
// const router = Router();
// const uploadDir = process.env.UPLOAD_DIR || 'uploads';
// fs.mkdirSync(uploadDir, { recursive: true });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
// });
// const allowed = ['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf'];
// const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (req,file,cb) => cb(null, allowed.includes(file.mimetype)) });
// router.post('/', requireAdmin, upload.single('file'), (req,res) => {
//   if (!req.file) return res.status(400).json({message:'Please upload a JPG, PNG, WEBP, SVG or PDF file'});
//   res.status(201).json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, filename: req.file.filename });
// });
// export default router;
