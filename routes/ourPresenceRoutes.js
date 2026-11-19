import express from "express";
import { OurPresencePage } from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  collectMediaUrls,
  deleteUploadedMedia,
} from "../utils/media.js";

const router = express.Router();

const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "MTAT TECHNOLOGIES PRIVATE LIMITED",
    title: "Our Presence",
    description:
      "Three decades of experience, established technology partnerships and customer-focused solutions driving manufacturing progress.",
    buttonText: "Explore Our Story",
    buttonLink: "#our-story",
    bottomText: "Engineering Precision · Powering Progress",
    image: "",
  },
  gallery: [],
  teamSection: {
    eyebrow: "Our People",
    heading: "Approximately 60 Professionals.",
    highlightedText: "One Shared Vision.",
    description:
      "From an initial team of two professionals to an organisation of approximately 60, our journey reflects the dedication, experience and collaborative efforts of our people.",
    note: "",
  },
  team: [],
  industriesSection: {
    eyebrow: "Industrial Reach",
    heading: "Supporting Diverse Manufacturing",
    description:
      "Our solutions are engineered for a broad range of industrial sectors, delivering precision, reliability, and productivity where it matters most.",
    note: "Explore our application domains on the right",
    backgroundImage: "",
    columnOne: [],
    columnTwo: [],
  },
  approachSection: {
    eyebrow: "Why Choose MTAT",
    heading: "Experience That",
    highlightedText: "Moves Industry Forward.",
    description:
      "Bringing together three decades of industry experience, established technology partnerships and dependable customer support.",
    secondaryDescription:
      "From machine selection and technical coordination to installation assistance, maintenance and spares.",
  },
  highlights: [],
  approachCards: [],
  supportSection: {
    eyebrow: "SALES, SERVICE & SUPPORT",
    heading: "Support Beyond",
    highlightedText: "The Machine.",
    description:
      "The value of a machine extends beyond its installation.",
    buttonText: "Discuss Your Requirements",
    buttonLink: "/contact",
  },
  supportCards: [],
};

async function getOrCreateOurPresence() {
  let page = await OurPresencePage.findOne({ key: "our-presence" });

  if (!page) {
    page = await OurPresencePage.create({
      key: "our-presence",
      content: DEFAULT_CONTENT,
      published: true,
    });
  }

  return page;
}

// PUBLIC: Get Our Presence content
router.get("/", async (req, res) => {
  try {
    const page = await getOrCreateOurPresence();

    if (!page.published) {
      return res.status(404).json({
        success: false,
        message: "Our Presence page is currently unavailable.",
      });
    }

    return res.json({
      success: true,
      data: {
        ...DEFAULT_CONTENT,
        ...(page.content?.toObject?.() || page.content || {}),
      },
    });
  } catch (error) {
    console.error("Get Our Presence error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch Our Presence content.",
    });
  }
});

// ADMIN: Get Our Presence content
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const page = await getOrCreateOurPresence();

    return res.json({
      success: true,
      data: {
        content: {
          ...DEFAULT_CONTENT,
          ...(page.content?.toObject?.() || page.content || {}),
        },
        published: page.published,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin Our Presence fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch Our Presence content.",
    });
  }
});

// ADMIN: Update Our Presence content
router.put("/admin", requireAdmin, async (req, res) => {
  try {
    const incoming = req.body?.content || req.body?.data;

    if (
      !incoming ||
      typeof incoming !== "object" ||
      Array.isArray(incoming)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Presence content.",
      });
    }

    const existing = await getOrCreateOurPresence();
    const previousMedia = collectMediaUrls(existing.toObject());

    // Replace the content object with the submitted page content.
    existing.content = {
      ...DEFAULT_CONTENT,
      ...incoming,
    };

    if (typeof req.body?.published === "boolean") {
      existing.published = req.body.published;
    }

    await existing.save();

    const updatedMedia = collectMediaUrls(existing.toObject());
    const obsoleteMedia = [...previousMedia].filter(
      (url) => !updatedMedia.has(url)
    );

    // Delete old uploaded files only after the database update succeeds.
    await deleteUploadedMedia(obsoleteMedia);

    return res.json({
      success: true,
      message: "Our Presence page updated successfully.",
      data: {
        content: existing.content,
        published: existing.published,
        updatedAt: existing.updatedAt,
      },
      deletedMediaCount: obsoleteMedia.length,
    });
  } catch (error) {
    console.error("Our Presence update error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Our Presence content.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

export default router;
