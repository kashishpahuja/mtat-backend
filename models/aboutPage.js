
import mongoose from "mongoose";

const aboutPageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "about",
      unique: true,
      immutable: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: () => ({
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
      }),
    },

    published: {
      type: Boolean,
      default: false,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const AboutPage =
  mongoose.models.AboutPage ||
  mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;
