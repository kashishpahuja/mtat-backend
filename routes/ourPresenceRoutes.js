import { Router } from "express";
import { OurPresencePage } from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "MTAT TECHNOLOGIES PRIVATE LIMITED",
    title: "Our Presence",
    description:
      "Three decades of experience, established technology partnerships and customer-focused solutions driving manufacturing progress.",
    buttonText: "Explore Our Story",
    buttonLink: "#our-story",
    bottomText: "Engineering Precision · Powering Progress",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2200&q=90",
  },

  gallery: [
    {
      image:
        "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=85",
      alt: "Industrial machine tools",
    },
    {
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
      alt: "Team collaboration",
    },
    {
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=85",
      alt: "Precision engineering equipment",
    },
    {
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
      alt: "Industrial workplace",
    },
  ],

  teamSection: {
    eyebrow: "Our People",
    heading: "Approximately 60 Professionals.",
    highlightedText: "One Shared Vision.",
    description:
      "From an initial team of two professionals to an organisation of approximately 60, our journey reflects the dedication, experience and collaborative efforts of our people.",
    note: "",
  },

  team: [
    {
      role: "Consultation & Sales",
      description:
        "Understanding customer requirements and helping identify suitable machine tools and manufacturing technologies.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
    },
    {
      role: "Technical Coordination",
      description:
        "Facilitating technical discussions around machining processes, applications and equipment capabilities.",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85",
    },
    {
      role: "Service & Support",
      description:
        "Coordinating installation assistance, maintenance requirements and after-sales service support.",
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=85",
    },
    {
      role: "Customer Partnerships",
      description:
        "Building lasting relationships with customers, principals and technology partners through dependable support.",
      image:
        "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=900&q=85",
    },
  ],

  industriesSection: {
    eyebrow: "Industrial Reach",
    heading: "Supporting Diverse Manufacturing",
    description:
      "Our solutions are engineered for a broad range of industrial sectors, delivering precision, reliability, and productivity where it matters most.",
    note: "Explore our application domains on the right",
    backgroundImage: "/Images/banner.webp",
    columnOne: [
      {
        title: "Automotive & Auto Components",
        desc: "Precision machining and production equipment.",
      },
      {
        title: "Agriculture & Implements",
        desc: "Machinery solutions for equipment manufacturers.",
      },
      {
        title: "Railways & Transportation",
        desc: "Machining and measurement technologies.",
      },
      {
        title: "Aerospace & Precision",
        desc: "Advanced machining and inspection solutions.",
      },
      {
        title: "Defence & Heavy Engineering",
        desc: "Manufacturing technologies for specialised requirements.",
      },
      {
        title: "Medical Equipment & Devices",
        desc: "Precision machining and dimensional measurement.",
      },
    ],
    columnTwo: [
      {
        title: "Oil, Gas & Energy",
        desc: "Machining and fabrication solutions for industry.",
      },
      {
        title: "Textiles & Industrial Equipment",
        desc: "Component manufacturing and equipment production.",
      },
      {
        title: "Jewellery & Fine Engineering",
        desc: "Precision machining and specialised applications.",
      },
      {
        title: "Telecommunications & Electronics",
        desc: "Technologies supporting precision components.",
      },
      {
        title: "Scaffolding & Infrastructure",
        desc: "Fabrication and metal processing machinery.",
      },
    ],
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

  highlights: [
    {
      number: "01",
      title: "Since 1995",
      text: "Three decades of presence in the machine tool and manufacturing solutions sector.",
    },
    {
      number: "02",
      title: "Technology Portfolio",
      text: "Solutions across metal cutting, metal forming, metrology and tool room machinery.",
    },
    {
      number: "03",
      title: "Established Partnerships",
      text: "Connecting manufacturers with reputed Indian and international technology brands.",
    },
    {
      number: "04",
      title: "Beyond Sales",
      text: "Installation coordination, after-sales service, maintenance and spare parts support.",
    },
  ],

  approachCards: [
    {
      number: "01",
      title: "Industry Knowledge",
      text: "Understanding manufacturing needs and industrial applications.",
    },
    {
      number: "02",
      title: "Technology Partners",
      text: "Connecting customers with established machine-tool brands.",
    },
    {
      number: "03",
      title: "Customer Support",
      text: "Helping coordinate service and spare-parts requirements.",
    },
    {
      number: "04",
      title: "Long-Term Relationships",
      text: "Building partnerships through communication and reliability.",
    },
  ],

  supportSection: {
    eyebrow: "SALES, SERVICE & SUPPORT",
    heading: "Support Beyond",
    highlightedText: "The Machine.",
    description:
      "The value of a machine extends beyond its installation. We focus on customer support, technical coordination and dependable assistance throughout the equipment lifecycle.",
    buttonText: "Discuss Your Requirements",
    buttonLink: "/contact",
  },

  supportCards: [
    {
      name: "Machine Selection",
      role: "Understanding Production Requirements",
      content:
        "Every manufacturing requirement is different. We focus on understanding production objectives, component specifications and application needs before exploring suitable machine tool solutions.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
      machine: "Consultation & Selection",
    },
    {
      name: "Technology Solutions",
      role: "Connecting with the Right Technologies",
      content:
        "Our diverse technology portfolio connects manufacturers with established Indian and international machine tool brands across multiple industrial applications.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85",
      machine: "Technology Partnerships",
    },
    {
      name: "Technical Coordination",
      role: "Supporting Manufacturing Applications",
      content:
        "From machining processes to equipment capabilities, technical coordination helps customers evaluate solutions aligned with their manufacturing requirements.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=85",
      machine: "Application Support",
    },
    {
      name: "After-Sales Support",
      role: "Support Beyond Machinery Supply",
      content:
        "Our commitment extends beyond machine supply through installation coordination, service assistance, maintenance and spare parts support.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=900&q=85",
      machine: "Service & Maintenance",
    },
  ],
};

// Merge saved content with defaults, preserving defaults for missing fields.
// Arrays are replaced by the saved array rather than merged by index.
function mergeContent(defaults, saved) {
  if (
    !saved ||
    typeof saved !== "object" ||
    Array.isArray(saved)
  ) {
    return defaults;
  }

  const result = { ...defaults };

  for (const [key, value] of Object.entries(saved)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      defaults[key] &&
      typeof defaults[key] === "object" &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = mergeContent(defaults[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// GET PUBLIC OUR PRESENCE PAGE
router.get("/", async (req, res) => {
  try {
    const page = await OurPresencePage.findOne({
      key: "our-presence",
      published: true,
    }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Our Presence page is not available.",
      });
    }

    return res.json({
      success: true,
      data: mergeContent(DEFAULT_CONTENT, page.content),
    });
  } catch (error) {
    console.error("OUR PRESENCE PUBLIC GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Our Presence page.",
    });
  }
});

// GET ADMIN OUR PRESENCE PAGE
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    let page = await OurPresencePage.findOne({
      key: "our-presence",
    });

    if (!page) {
      page = await OurPresencePage.create({
        key: "our-presence",
        content: DEFAULT_CONTENT,
        published: true,
      });
    }

    return res.json({
      success: true,
      data: {
        content: mergeContent(DEFAULT_CONTENT, page.content),
        published: page.published,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error("OUR PRESENCE ADMIN GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Our Presence admin data.",
    });
  }
});

// UPDATE ADMIN OUR PRESENCE PAGE
router.put("/admin", requireAdmin, async (req, res) => {
  try {
    const { content, published } = req.body || {};

    if (
      !content ||
      typeof content !== "object" ||
      Array.isArray(content)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Presence content.",
      });
    }

    if (
      published !== undefined &&
      typeof published !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid publication status.",
      });
    }

    const safeContent = mergeContent(DEFAULT_CONTENT, content);

    const page = await OurPresencePage.findOneAndUpdate(
      { key: "our-presence" },
      {
        $set: {
          content: safeContent,
          ...(published !== undefined ? { published } : {}),
        },
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
      message: "Our Presence page updated successfully.",
      data: {
        content: mergeContent(DEFAULT_CONTENT, page.content),
        published: page.published,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error("OUR PRESENCE ADMIN UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save Our Presence page.",
    });
  }
});

export default router;