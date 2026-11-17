import { Router } from "express";
import {
  Brand,
  Product,
  ProductCategory,
  BrandCategory,
  Enquiry,
  Testimonial,
  SiteContent,
} from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
const resources = {
  brands: Brand,
  products: Product,
  enquiries: Enquiry,
  testimonials: Testimonial,
  content: SiteContent,
};

// Public read-only endpoints used by the website. Admin endpoints require a valid JWT.
router.get("/public/brands", async (req, res, next) => {
  try {
    res.json(await Brand.find({ isActive: true }).sort("sortOrder"));
  } catch (e) {
    next(e);
  }
});
router.get("/public/products", async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    res.json(
      await Product.find(filter)
        .populate("brand", "name slug logo")
        .sort("sortOrder"),
    );
  } catch (e) {
    next(e);
  }
});
router.get("/public/products/:slug", async (req, res, next) => {
  try {
    const item = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("brand", "name slug logo");
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});
router.get("/public/testimonials", async (req, res, next) => {
  try {
    res.json(await Testimonial.find({ isPublished: true }).sort("sortOrder"));
  } catch (e) {
    next(e);
  }
});
router.get("/public/content/:key", async (req, res, next) => {
  try {
    const item = await SiteContent.findOne({ key: req.params.key });
    res.json(item?.value ?? {});
  } catch (e) {
    next(e);
  }
});

router.use("/admin", requireAdmin);

router.get("/admin/dashboard", async (req, res, next) => {
  try {
    const [
      categories,
      brands,
      brandCategories,
      products,
      enquiries,
      newEnquiries,
      testimonials,
    ] = await Promise.all([
      ProductCategory.countDocuments(),
      Brand.countDocuments(),
      BrandCategory.countDocuments(),
      Product.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "new" }),
      Testimonial.countDocuments(),
    ]);

    res.json({
      categories,
      brands,
      brandCategories,
      products,
      enquiries,
      newEnquiries,
      testimonials,
    });
  } catch (e) {
    next(e);
  }
});


for (const [path, Model] of Object.entries(resources)) {
  router.get(`/admin/${path}`, async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1),
        limit = Math.min(100, Number(req.query.limit) || 50);
      const filter = {};
      if (req.query.search && ["brands", "products"].includes(path))
        filter.name = { $regex: req.query.search, $options: "i" };
      if (req.query.status && path === "enquiries")
        filter.status = req.query.status;
      const query = Model.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      if (path === "products") query.populate("brand", "name slug logo");
      const [items, total] = await Promise.all([
        query,
        Model.countDocuments(filter),
      ]);
      res.json({ items, total, page, pages: Math.ceil(total / limit) });
    } catch (e) {
      next(e);
    }
  });
  router.post(`/admin/${path}`, async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  });
  router.put(`/admin/${path}/:id`, async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ message: "Record not found" });
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
  router.delete(`/admin/${path}/:id`, async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Record not found" });
      res.json({ message: "Deleted" });
    } catch (e) {
      next(e);
    }
  });
}
export default router;
