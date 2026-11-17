
import express from "express";
import { HomePage } from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  collectMediaUrls,
  deleteUploadedMedia,
} from "../utils/media.js";

const router = express.Router();

const ALLOWED_SECTIONS = [
  "hero",
  "services",
  "companyStory",
  "whyUs",
  "testimonialsSection",
  "enquiry",
];

async function getOrCreateHomePage() {
  let page = await HomePage.findOne({ key: "home" });

  if (!page) {
    page = await HomePage.create({ key: "home" });
  }

  return page;
}

// PUBLIC: Get homepage content
router.get("/public/homepage", async (req, res) => {
  try {
    const page = await getOrCreateHomePage();

    return res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Get homepage error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch homepage content",
    });
  }
});

// ADMIN: Get homepage content
router.get("/admin/homepage", requireAdmin, async (req, res) => {
  try {
    const page = await getOrCreateHomePage();

    return res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Admin homepage fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch homepage content",
    });
  }
});

// ADMIN: Update homepage content
router.put("/admin/homepage", requireAdmin, async (req, res) => {
  try {
    const incoming = req.body?.data || req.body;

    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homepage content",
      });
    }

    const updates = {};

    for (const section of ALLOWED_SECTIONS) {
      if (Object.prototype.hasOwnProperty.call(incoming, section)) {
        updates[section] = incoming[section];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid homepage sections were provided",
      });
    }

    const existing = await getOrCreateHomePage();
    const previousMedia = collectMediaUrls(existing.toObject());

    // Save the new content first.
    // Old files are deleted only after this succeeds.
    for (const [section, value] of Object.entries(updates)) {
      existing.set(section, value);
    }

    await existing.save();

    const updatedMedia = collectMediaUrls(existing.toObject());

    const obsoleteMedia = [...previousMedia].filter(
      (url) => !updatedMedia.has(url)
    );

    await deleteUploadedMedia(obsoleteMedia);

    return res.json({
      success: true,
      message: "Homepage updated successfully",
      data: existing,
      deletedMediaCount: obsoleteMedia.length,
    });
  } catch (error) {
    console.error("Homepage update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update homepage content",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

export default router;
