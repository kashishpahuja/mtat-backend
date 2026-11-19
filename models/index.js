import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ================================
// ADMIN
// ================================

const adminSchema = new Schema(
  {
    name: { type: String, default: "Administrator" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true },
);

// ================================
// MAIN PRODUCT CATEGORIES
// Metal Cutting, Metal Forming etc.
// ================================

const productCategorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    desc: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productCategorySchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

// ================================
// BRANDS
// Jyoti, EIFCO, Hexagon etc.
// Includes complete brand inner-page content.
// ================================

const brandSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },

    tagline: String,
    industry: String,
    eyebrow: { type: String, default: "OUR TECHNOLOGY PARTNERS" },

    shortDescription: String,
    description: String,

    website: String,
    websiteLabel: String,

    logo: String,
    heroImage: String,

    aboutTitle: String,
    about: String,

    collaborationTitle: String,
    collaboration: String,

    relationshipLabel: String,

    expertise: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

brandSchema.index({ slug: 1 }, { unique: true });
brandSchema.index({ category: 1, sortOrder: 1 });

// ================================
// BRAND CATEGORIES
// Turning Centres, VMC, Gear Hobber etc.
// These create brand inner category pages.
// ================================

const brandCategorySchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },

    description: String,
    image: String,
    countLabel: String,

    // Optional content for category landing page
    bannerImage: String,
    pageTitle: String,
    pageDescription: String,

    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// A brand cannot have duplicate category slugs.
brandCategorySchema.index({ brand: 1, slug: 1 }, { unique: true });

brandCategorySchema.index({ category: 1, brand: 1, sortOrder: 1 });

// ================================
// INDIVIDUAL PRODUCTS
// Actual machine/product listings.
// ================================

const productSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    brandCategory: {
      type: Schema.Types.ObjectId,
      ref: "BrandCategory",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },

    modelNumber: String,

    shortDescription: String,
    description: String,

    images: [{ type: String }],

    specifications: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    features: [{ type: String, trim: true }],

    brochure: String,

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 }, { unique: true });

productSchema.index({
  category: 1,
  brand: 1,
  brandCategory: 1,
  sortOrder: 1,
});

// AUTO GENERATE SLUGS

productCategorySchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

brandSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

brandCategorySchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

productSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

// ================================
// ENQUIRIES
// ================================

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    subject: String,
    message: { type: String, required: true },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "in-progress", "responded", "closed"],
      default: "new",
    },
    adminNote: String,
  },
  { timestamps: true },
);

// ================================
// TESTIMONIALS
// ================================

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    designation: String,
    company: String,
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photo: String,
    isPublished: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// ================================
// SITE CONTENT
// ================================

const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

// ================================
// EXPORT MODELS
// ================================

export const Admin = models.Admin || model("Admin", adminSchema);

export const ProductCategory =
  models.ProductCategory || model("ProductCategory", productCategorySchema);

export const Brand = models.Brand || model("Brand", brandSchema);

export const BrandCategory =
  models.BrandCategory || model("BrandCategory", brandCategorySchema);

export const Product = models.Product || model("Product", productSchema);

export const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);

export const Testimonial =
  models.Testimonial || model("Testimonial", testimonialSchema);

export const SiteContent =
  models.SiteContent || model("SiteContent", siteContentSchema);

export { HomePage } from "./homePage.js";
export { ContactPage } from "./contactPage.js";
export { AboutPage } from "./aboutPage.js";
export { OurPresencePage } from "./OurPresencePage.js"