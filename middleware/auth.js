
import jwt from "jsonwebtoken";
import { Admin } from "../models/index.js";

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        code: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id) {
      return res.status(401).json({
        code: "INVALID_SESSION",
        message: "Invalid session",
      });
    }

    const admin = await Admin.findById(decoded.id)
      .select("_id name email role");

    if (!admin) {
      return res.status(401).json({
        code: "INVALID_SESSION",
        message: "Admin account not found",
      });
    }

    req.admin = admin;

    return next();

  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        code: "SESSION_EXPIRED",
        message: "Session expired or invalid. Please log in again.",
      });
    }

    return next(error);
  }
}
