
import { Router } from "express";
import AboutPage from "../models/aboutPage.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const DEFAULT_CONTENT = {
  seo: {
    title: "",
    description: "",
    ogTitle: "",
    ogDescription: "",
  },

  hero: {
    company: "",
    title: "",
    tagline: "",
    image: { url: "", alt: "" },
    scrollHint: "SCROLL TO EXPLORE",
  },

  intro: {
    label: "",
    heading: "",
    paragraphs: [],
    image: { url: "", alt: "" },
    caption: "",
  },

  timeline: {
    label: "",
    heading: "",
    description: "",
    milestones: [],
  },

  expertise: {
    label: "",
    heading: "",
    intro: "",
    items: [],
  },

  partners: {
    label: "Our Technology Partners",
    description: "",
    logos: [],
  },

  industries: {
    label: "",
    heading: "",
    intro: "",
    items: [],
  },

  cta: {
    eyebrow: "",
    title: "",
    description: "",
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    backgroundImage: { url: "", alt: "" },
  },
};

const ALLOWED_SECTIONS = Object.keys(DEFAULT_CONTENT);

function validateContent(content) {
  if (
    !content ||
    typeof content !== "object" ||
    Array.isArray(content)
  ) {
    return "Content must be a valid object.";
  }

  const unknownSections = Object.keys(content).filter(
    (key) => !ALLOWED_SECTIONS.includes(key)
  );

  if (unknownSections.length) {
    return `Invalid sections: ${unknownSections.join(", ")}`;
  }

  for (const [section, value] of Object.entries(content)) {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return `Invalid data in ${section} section.`;
    }
  }

  // Validate repeatable sections.
  const arrayFields = [
    ["intro", "paragraphs"],
    ["timeline", "milestones"],
    ["expertise", "items"],
    ["partners", "logos"],
    ["industries", "items"],
  ];

  for (const [section, field] of arrayFields) {
    if (
      content[section]?.[field] !== undefined &&
      !Array.isArray(content[section][field])
    ) {
      return `${section}.${field} must be an array.`;
    }
  }

  return null;
}

// PUBLIC: Get published About page.
router.get("/", async (req, res, next) => {
  try {
    const page = await AboutPage.findOne({
      key: "about",
      published: true,
    }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "About page is not available.",
      });
    }

    return res.json({
      success: true,
      data: page.content,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get About page, including unpublished content.
// Create an initial document if it does not exist.
router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    const page = await AboutPage.findOneAndUpdate(
      { key: "about" },
      {
        $setOnInsert: {
          key: "about",
          content: DEFAULT_CONTENT,
          published: false,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.json({
      success: true,
      data: page.content,
      published: page.published,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Save About page.
router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const { content, published } = req.body;

    const validationError = validateContent(content);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (
      published !== undefined &&
      typeof published !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Published must be a boolean value.",
      });
    }

    const update = {
      content,
      updatedBy: req.admin._id,
    };

    if (published !== undefined) {
      update.published = published;
    }

    const page = await AboutPage.findOneAndUpdate(
      { key: "about" },
      {
        $set: update,
        $setOnInsert: { key: "about" },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: "About page saved successfully.",
      data: page.content,
      published: page.published,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
