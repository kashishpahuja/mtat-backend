import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;
const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const adminSchema = new Schema({
  name: { type: String, default: 'Administrator' },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true });

const brandSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  logo: String,
  description: String,
  website: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });
brandSchema.pre('validate', function(next) { if (!this.slug && this.name) this.slug = slugify(this.name); next(); });

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: String, required: true },
  subcategory: String,
  shortDescription: String,
  description: String,
  specifications: [{ label: String, value: String }],
  images: [String],
  brochure: String,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });
productSchema.pre('validate', function(next) { if (!this.slug && this.name) this.slug = slugify(this.name); next(); });

const enquirySchema = new Schema({
  name: { type: String, required: true }, email: { type: String, required: true },
  phone: String, company: String, subject: String, message: { type: String, required: true },
  source: { type: String, default: 'website' },
  status: { type: String, enum: ['new', 'in-progress', 'responded', 'closed'], default: 'new' },
  adminNote: String
}, { timestamps: true });

const testimonialSchema = new Schema({
  name: { type: String, required: true }, designation: String, company: String,
  message: { type: String, required: true }, rating: { type: Number, min: 1, max: 5, default: 5 },
  photo: String, isPublished: { type: Boolean, default: false }, sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const siteContentSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, default: {} },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

export const Admin = models.Admin || model('Admin', adminSchema);
export const Brand = models.Brand || model('Brand', brandSchema);
export const Product = models.Product || model('Product', productSchema);
export const Enquiry = models.Enquiry || model('Enquiry', enquirySchema);
export const Testimonial = models.Testimonial || model('Testimonial', testimonialSchema);
export const SiteContent = models.SiteContent || model('SiteContent', siteContentSchema);
