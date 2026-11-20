
import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Phone" },
    number: { type: String, trim: true, required: true },
    href: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const emailSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Email" },
    email: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["facebook", "instagram", "linkedin", "youtube"],
      required: true,
    },
    url: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const contactPageSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      default: "contact",
      unique: true,
      immutable: true,
    },

    hero: {
      title: {
        type: String,
        default: "One Stop Solution Providers.",
      },
      description: {
        type: String,
        default:
          "Connect with our team for precision machinery, sales, service, and spare parts assistance.",
      },
      buttonText: {
        type: String,
        default: "Get In Touch",
      },
      image: {
    type: String,
    default: "/Images/contact.webp",
  },
      backgroundImage: {
        type: String,
        default: "/Images/contact.webp",
      },
      imageAlt: {
        type: String,
        default:
          "Industrial machinery and manufacturing environment",
      },
      bottomText: {
        type: String,
        default: "Engineering Precision · Powering Progress",
      },
      overlayOpacity: {
        type: Number,
        min: 0,
        max: 100,
        default: 65,
      },
    },

    contactInfo: {
      heading: {
        type: String,
        default: "Get In Touch",
      },
      label: {
        type: String,
        default: "CONTACT US",
      },
      description: {
        type: String,
        default:
          "Reach out directly via phone or email, or connect with our team to discuss your machinery and technical requirements.",
      },

      phones: {
        type: [phoneSchema],
        default: [
          { number: "0160-4624748", href: "tel:01604624748" },
          { number: "0160-4635748", href: "tel:01604635748" },
          { number: "0160-4634748", href: "tel:01604634748" },
        ],
      },

      emails: {
        type: [emailSchema],
        default: [
          { email: "info@mtaindia.in" },
        ],
      },

      location: {
        label: {
          type: String,
          default: "Location",
        },
        address: {
          type: String,
          default: "Ludhiana, Punjab, India",
        },
      },
    },

    quickLinks: {
      heading: {
        type: String,
        default: "Quick Links",
      },
      items: {
        type: [linkSchema],
        default: [
          { label: "About", url: "/about" },
          { label: "Strength", url: "/about#our-journey" },
          { label: "Our Presence", url: "/our-presence" },
          { label: "Contact", url: "/contact" },
        ],
      },
    },

    socials: {
      heading: {
        type: String,
        default: "Connect With Us",
      },
      items: {
        type: [socialSchema],
        default: [
          {
            platform: "facebook",
            url: "https://www.facebook.com/people/MTAT-Technologies-Private-Limited/61562506565764/",
          },
          {
            platform: "instagram",
            url: "https://www.instagram.com/mtattpl/",
          },
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/",
          },
          {
            platform: "youtube",
            url: "https://www.youtube.com/@mtatpl",
          },
        ],
      },
    },

    enquiry: {
      label: {
        type: String,
        default: "SEND AN ENQUIRY",
      },
      heading: {
        type: String,
        default: "Let's Discuss Your Requirements",
      },
      nameLabel: {
        type: String,
        default: "Your Name",
      },
      namePlaceholder: {
        type: String,
        default: "Enter your name",
      },
      emailLabel: {
        type: String,
        default: "Email Address",
      },
      emailPlaceholder: {
        type: String,
        default: "Enter your email",
      },
      phoneLabel: {
        type: String,
        default: "Phone Number",
      },
      phonePlaceholder: {
        type: String,
        default: "Enter your phone number",
      },
      messageLabel: {
        type: String,
        default: "Message / Requirements",
      },
      messagePlaceholder: {
        type: String,
        default:
          "Tell us about the machinery or services you need...",
      },
      submitText: {
        type: String,
        default: "Submit Enquiry",
      },
      successTitle: {
        type: String,
        default: "Thank You!",
      },
      successMessage: {
        type: String,
        default:
          "Your message has been received. Our team will get back to you shortly.",
      },
    },

    map: {
      embedUrl: {
        type: String,
        default:
          "https://www.google.com/maps?q=MTAT+Technologies+Ludhiana&output=embed",
      },
      title: {
        type: String,
        default: "MTAT Technologies Location Map",
      },
      isVisible: {
        type: Boolean,
        default: true,
      },
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const ContactPage =
  mongoose.models.ContactPage ||
  mongoose.model("ContactPage", contactPageSchema);
