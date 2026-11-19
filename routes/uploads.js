import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";

import { requireAdmin } from "../middleware/auth.js";
import { UPLOAD_DIR } from "../config/upload.js";

const router = Router();

const MAX_FILE_SIZE = 150 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
]);

const ALLOWED_TYPES = new Set([
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
  "application/pdf",
]);

await fs.mkdir(UPLOAD_DIR, { recursive: true });

function slugify(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function getPublicBaseUrl(req) {
  const configuredUrl = process.env.API_PUBLIC_URL;

  // Use only the origin. Remove paths such as /api.
  if (configuredUrl) {
    return new URL(configuredUrl).origin;
  }

  return `${req.protocol}://${req.get("host")}`;
}

// All incoming files are temporarily placed directly in uploads/.
// They are renamed or converted and then the temporary file is removed.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (_req, _file, cb) => {
    cb(null, `temp-${crypto.randomUUID()}`);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(
        new Error(
          "Unsupported file. Upload JPG, PNG, WEBP, SVG, MP4 or WebM."
        )
      );
    }

    cb(null, true);
  },
});

// Generate meaningful numbered names:
// hero-banner-image-001.webp
// hero-banner-image-002.webp
// services-items-item-1-image-001.webp
async function getUniqueFilename(baseName, extension) {
  const safeBase = slugify(baseName) || "homepage-media";

  for (let number = 1; number < 10000; number++) {
    const filename =
      `${safeBase}-${String(number).padStart(3, "0")}${extension}`;

    const fullPath = path.join(UPLOAD_DIR, filename);

    try {
      await fs.access(fullPath);
    } catch {
      return { filename, fullPath };
    }
  }

  const filename = `${safeBase}-${crypto.randomUUID()}${extension}`;

  return {
    filename,
    fullPath: path.join(UPLOAD_DIR, filename),
  };
}

function receiveUpload(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();

    const tooLarge =
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE";

    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? "File is too large. Maximum upload size is 150 MB."
        : error.message || "Unable to receive the uploaded file.",
    });
  });
}

router.post("/", requireAdmin, receiveUpload, async (req, res) => {
  const tempPath = req.file?.path;
  let finalPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file.",
      });
    }

    const { mimetype, size } = req.file;

    const meaningfulName =
      req.body?.fieldName ||
      req.file.originalname?.replace(/\.[^.]+$/, "") ||
      "homepage-media";

    let filename;
    let format;
    let type;

    // IMAGES: always convert to WebP.
    if (IMAGE_TYPES.has(mimetype)) {
      const target = await getUniqueFilename(
        meaningfulName,
        ".webp"
      );

      filename = target.filename;
      finalPath = target.fullPath;

      format = "webp";
      type = "image";

      await sharp(tempPath)
        .rotate()
        .resize({
          width: 2000,
          height: 2000,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 84,
          effort: 5,
        })
        .toFile(finalPath);
    }

    // VIDEOS: retain MP4 or WebM format.
    else if (VIDEO_TYPES.has(mimetype)) {
      const extension =
        mimetype === "video/mp4" ? ".mp4" : ".webm";

      const target = await getUniqueFilename(
        meaningfulName,
        extension
      );

      filename = target.filename;
      finalPath = target.fullPath;

      format = extension.slice(1);
      type = "video";

      await fs.rename(tempPath, finalPath);
    }

    // PDF documents.
    else if (mimetype === "application/pdf") {
      const target = await getUniqueFilename(
        meaningfulName,
        ".pdf"
      );

      filename = target.filename;
      finalPath = target.fullPath;

      format = "pdf";
      type = "document";

      await fs.rename(tempPath, finalPath);
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type.",
      });
    }

    const stats = await fs.stat(finalPath);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",

      url: `${getPublicBaseUrl(req)}/uploads/${encodeURIComponent(filename)}`,

      filename,
      type,
      format,

      originalSize: size,
      optimizedSize: stats.size,
    });

  } catch (error) {
    console.error("Upload error:", error);

    if (finalPath) {
      await fs.unlink(finalPath).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: "File upload failed.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

  } finally {
    if (tempPath) {
      await fs.unlink(tempPath).catch(() => {});
    }
  }
});

export default router;




// import { Router } from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs/promises";
// import crypto from "crypto";
// import sharp from "sharp";

// import { requireAdmin } from "../middleware/auth.js";

// const router = Router();

// // const uploadDir = path.resolve(
// //   process.cwd(),
// //   process.env.UPLOAD_DIR || "uploads"
// // );

// // await fs.mkdir(uploadDir, { recursive: true });

// import { UPLOAD_DIR } from "../config/upload.js";

// const uploadDir = UPLOAD_DIR;

// const allowed = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/svg+xml",
//   "application/pdf",
//   "video/mp4",
//   "video/webm",
// ];

// const tempStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `temp-${crypto.randomUUID()}`);
//   },
// });

// const upload = multer({
//   storage: tempStorage,
//   limits: {
//     fileSize: 150 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (!allowed.includes(file.mimetype)) {
//       return cb(
//         new Error("Unsupported file. Upload JPG, PNG, WEBP, SVG, PDF, MP4 or WebM.")
//       );
//     }

//     cb(null, true);
//   },
// });

// function getPublicBaseUrl(req) {
//   return (
//     process.env.API_PUBLIC_URL ||
//     `${req.protocol}://${req.get("host")}`
//   ).replace(/\/+$/, "");
// }

// router.post(
//   "/",
//   requireAdmin,
//   upload.single("file"),
//   async (req, res) => {
//     let finalPath;

//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "Please select a file",
//         });
//       }

//       const tempPath = req.file.path;
//       const mime = req.file.mimetype;
//       const id = crypto.randomUUID();

//       let filename;
//       let format;
//       let type;

//       const isImage = [
//         "image/jpeg",
//         "image/png",
//         "image/webp",
//       ].includes(mime);

//       if (isImage) {
//         filename = `${id}.webp`;
//         format = "webp";
//         type = "image";

//         finalPath = path.join(uploadDir, filename);

//         await sharp(tempPath)
//           .rotate()
//           .resize({
//             width: 2000,
//             height: 2000,
//             fit: "inside",
//             withoutEnlargement: true,
//           })
//           .webp({
//             quality: 82,
//             effort: 5,
//           })
//           .toFile(finalPath);

//         await fs.unlink(tempPath);
//       } else {
//         const extension =
//           mime === "application/pdf"
//             ? ".pdf"
//             : mime === "image/svg+xml"
//               ? ".svg"
//               : mime === "video/mp4"
//                 ? ".mp4"
//                 : ".webm";

//         filename = `${id}${extension}`;
//         format = extension.slice(1);
//         type = mime.startsWith("video/") ? "video" : "document";

//         finalPath = path.join(uploadDir, filename);

//         await fs.rename(tempPath, finalPath);
//       }

//       const baseUrl = getPublicBaseUrl(req);
//       const stats = await fs.stat(finalPath);

//       return res.status(201).json({
//         success: true,
//         message: "File uploaded successfully",
//         url: `${baseUrl}/uploads/${filename}`,
//         filename,
//         type,
//         format,
//         originalSize: req.file.size,
//         optimizedSize: stats.size,
//       });
//     } catch (error) {
//       if (req.file?.path) {
//         await fs.unlink(req.file.path).catch(() => {});
//       }

//       if (finalPath) {
//         await fs.unlink(finalPath).catch(() => {});
//       }

//       console.error("Upload error:", error);

//       return res.status(500).json({
//         success: false,
//         message: "File upload failed",
//       });
//     }
//   }
// );

// export default router;


