
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import enquiryRoutes from "./routes/enquiries.js";
import uploadRoutes from "./routes/uploads.js";
import productRoutes from "./routes/products.js";
import homePageRoutes from "./routes/homepage.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use the same absolute upload directory in uploads.js.
// export const UPLOAD_DIR = path.resolve(
//   __dirname,
//   process.env.UPLOAD_DIR || "uploads"
// );

// fs.mkdirSync(UPLOAD_DIR, { recursive: true });
import { UPLOAD_DIR } from "./config/upload.js";
// Security
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// CORS
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Login rate limit
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Static uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MTAT API",
  });
});

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api", homePageRoutes);

app.use("/api", resourceRoutes);

app.use("/api/enquiries", enquiryRoutes);

app.use("/api/uploads", uploadRoutes);

// Not found
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "File size exceeds the allowed limit",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "A record with this value already exists",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Server error"
        : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 8002;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MTAT API running on port ${PORT}`);
      console.log(`Uploads directory: ${UPLOAD_DIR}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

export default app;



// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import path from "path";
// import { fileURLToPath } from "url";
// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import resourceRoutes from "./routes/resources.js";
// import enquiryRoutes from "./routes/enquiries.js";
// import uploadRoutes from "./routes/uploads.js";
// import productRoutes from "./routes/products.js";
// import homePageRoutes from "./routes/homepage.js";

// const app = express();
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// app.use(
//   cors({
//     origin: (process.env.FRONTEND_URL || "http://localhost:3000")
//       .split(",")
//       .map((v) => v.trim()),
//     credentials: true,
//   }),
// );
// app.use(express.json({ limit: "2mb" }));
// app.use(express.urlencoded({ extended: true }));
// if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
// app.use(
//   "/api/auth/login",
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 10,
//     standardHeaders: true,
//     legacyHeaders: false,
//   }),
// );
// app.use(
//   "/uploads",
//   express.static(path.resolve(__dirname, process.env.UPLOAD_DIR || "uploads")),
// );
// app.get("/api/health", (req, res) =>
//   res.json({ status: "ok", service: "MTAT API" }),
// );

// app.use("/api/auth", authRoutes);

// app.use("/api/products", productRoutes);
// app.use("/api", homePageRoutes);

// app.use("/api", resourceRoutes);

// app.use("/api/enquiries", enquiryRoutes);
// app.use("/api/uploads", uploadRoutes);
// app.use((req, res) => res.status(404).json({ message: "API route not found" }));
// app.use((err, req, res, next) => {
//   console.error(err);
//   if (err.code === 11000)
//     return res
//       .status(409)
//       .json({ message: "A record with this value already exists" });
//   if (err.name === "ValidationError")
//     return res.status(400).json({ message: err.message });
//   res.status(500).json({
//     message:
//       process.env.NODE_ENV === "production" ? "Server error" : err.message,
//   });
// });
// const PORT = process.env.PORT || 8002;
// connectDB()
//   .then(() =>
//     app.listen(PORT, () => console.log(`MTAT API running on port ${PORT}`)),
//   )
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   });
