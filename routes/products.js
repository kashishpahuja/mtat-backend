
import { Router } from "express";
import mongoose from "mongoose";

import {
  ProductCategory,
  Brand,
  BrandCategory,
  Product,
} from "../models/index.js";

import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const populateBrandCategory = (query) =>
  query
    .populate("category", "title slug")
    .populate("brand", "name slug logo");

const populateProduct = (query) =>
  query
    .populate("category", "title slug")
    .populate("brand", "name slug logo")
    .populate("brandCategory", "title slug image");

// ==========================================
// VALIDATE RELATIONSHIPS
// ==========================================

async function validateBrandCategory(brandId, categoryId) {
  if (!isValidId(brandId) || !isValidId(categoryId)) {
    return false;
  }

  const [brand, category] = await Promise.all([
    Brand.findById(brandId),
    ProductCategory.findById(categoryId),
  ]);

  return (
    brand &&
    category &&
    brand.isActive !== false &&
    brand.category.toString() === category._id.toString()
  );
}

async function validateProductRelations(data) {
  const { brand, category, brandCategory } = data;

  if (!brand || !category || !brandCategory) {
    return "Brand, category and brand category are required";
  }

  if (!isValidId(brand) || !isValidId(category) || !isValidId(brandCategory)) {
    return "Invalid relationship ID";
  }

  const [brandExists, categoryExists, brandCategoryExists] =
    await Promise.all([
      Brand.findById(brand),
      ProductCategory.findById(category),
      BrandCategory.findById(brandCategory),
    ]);

  if (!brandExists || !categoryExists || !brandCategoryExists) {
    return "Invalid brand, category or brand category";
  }

  if (
    brandExists.category.toString() !== categoryExists._id.toString() ||
    brandCategoryExists.category.toString() !== categoryExists._id.toString() ||
    brandCategoryExists.brand.toString() !== brandExists._id.toString()
  ) {
    return "Product category does not match the selected brand hierarchy";
  }

  return null;
}

// ==========================================
// PUBLIC APIs
// ==========================================

// Complete navbar hierarchy
router.get(
  "/navigation",
  asyncHandler(async (req, res) => {
    const categories = await ProductCategory.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    const brands = await Brand.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    const brandCategories = await BrandCategory.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    const result = categories.map((category) => ({
      ...category,
      brands: brands
        .filter(
          (brand) => brand.category.toString() === category._id.toString()
        )
        .map((brand) => ({
          ...brand,
          categories: brandCategories
            .filter(
              (item) => item.brand.toString() === brand._id.toString()
            )
            .map((item) => ({
              _id: item._id,
              title: item.title,
              slug: item.slug,
              description: item.description,
              image: item.image,
              countLabel: item.countLabel,
            })),
        })),
    }));

    res.json({ categories: result });
  })
);

// Public category listing
router.get(
  "/public/categories",
  asyncHandler(async (req, res) => {
    const items = await ProductCategory.find({ isActive: true })
      .sort({ sortOrder: 1 });

    res.json(items);
  })
);

// Public brand listing
router.get(
  "/public/brands",
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };

    if (req.query.category && isValidId(req.query.category)) {
      filter.category = req.query.category;
    }

    const items = await Brand.find(filter)
      .populate("category", "title slug")
      .sort({ sortOrder: 1 });

    res.json(items);
  })
);

// Public brand details

// PUBLIC: Brand details with categories and featured products

router.get(
  "/public/brands/:slug",
  asyncHandler(async (req, res) => {
const brand = await Brand.findOne({
  slug: req.params.slug.toLowerCase(),
});

console.log("Requested slug:", req.params.slug);
console.log("Found brand:", brand);

    console.log(
      "Matching brand:",
      brand
        ? {
            name: brand.name,
            slug: brand.slug,
            isActive: brand.isActive,
            id: brand._id,
          }
        : "NOT FOUND"
    );

    if (!brand) {
      const availableBrands = await Brand.find({})
        .select("name slug isActive")
        .lean();

      console.log("Available brands:", availableBrands);

      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (!brand.isActive) {
      return res.status(404).json({
        success: false,
        message: "Brand is inactive",
      });
    }

    const categories = await BrandCategory.find({
      brand: brand._id,
      isActive: true,
    })
      .sort({ sortOrder: 1 })
      .lean();

    const featuredProducts = await Product.find({
      brand: brand._id,
      isActive: true,
      isFeatured: true,
    })
      .populate("brandCategory", "title slug image")
      .sort({ sortOrder: 1 })
      .lean();

    return res.json({
      success: true,
      data: {
        ...brand.toObject(),
        categories,
        featuredProducts,
      },
    });
  })
);


// router.get(
//   "/public/brands/:slug",
//   asyncHandler(async (req, res) => {
//     const brand = await Brand.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     }).populate("category", "title slug");

//     if (!brand) {
//       return res.status(404).json({ message: "Brand not found" });
//     }

//     const categories = await BrandCategory.find({
//       brand: brand._id,
//       isActive: true,
//     }).sort({ sortOrder: 1 });

//     res.json({ ...brand.toObject(), categories });
//   })
// );

// Public brand categories


router.get(
  "/public/brand-categories",
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const items = await populateBrandCategory(
      BrandCategory.find(filter).sort({ sortOrder: 1 })
    );

    res.json(items);
  })
);

// Public individual products
router.get(
  "/public/items",
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };

    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brandCategory) {
      filter.brandCategory = req.query.brandCategory;
    }

    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    const items = await populateProduct(
      Product.find(filter).sort({ sortOrder: 1, createdAt: -1 })
    );

    res.json(items);
  })
);

// Public single product
router.get(
  "/public/items/:slug",
  asyncHandler(async (req, res) => {
    const item = await populateProduct(
      Product.findOne({
        slug: req.params.slug,
        isActive: true,
      })
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(item);
  })
);

// ==========================================
// ADMIN APIs - ALL ROUTES BELOW REQUIRE JWT
// ==========================================

router.use("/admin", requireAdmin);

// ==========================================
// CATEGORY CRUD
// ==========================================

router.get(
  "/admin/categories",
  asyncHandler(async (req, res) => {
    const items = await ProductCategory.find()
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json(items);
  })
);

router.post(
  "/admin/categories",
  asyncHandler(async (req, res) => {
    const item = await ProductCategory.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  "/admin/categories/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const item = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(item);
  })
);

router.delete(
  "/admin/categories/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const [brands, brandCategories, products] = await Promise.all([
      Brand.exists({ category: id }),
      BrandCategory.exists({ category: id }),
      Product.exists({ category: id }),
    ]);

    if (brands || brandCategories || products) {
      return res.status(409).json({
        message: "Cannot delete category containing brands or products. Deactivate it instead.",
      });
    }

    const item = await ProductCategory.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  })
);

// ==========================================
// BRAND CRUD
// ==========================================

router.get(
  "/admin/brands",
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const items = await Brand.find(filter)
      .populate("category", "title slug")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json(items);
  })
);


router.post(
  "/admin/brands",
  asyncHandler(async (req, res) => {
    const category = await ProductCategory.findById(req.body.category);

    if (!category) {
      return res.status(400).json({
        message: "Please select a valid product category",
      });
    }

    const item = await Brand.create(req.body);

    res.status(201).json(item);
  })
);


router.put(
  "/admin/brands/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const item = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(item);
  })
);

router.delete(
  "/admin/brands/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const [categories, products] = await Promise.all([
      BrandCategory.exists({ brand: id }),
      Product.exists({ brand: id }),
    ]);

    if (categories || products) {
      return res.status(409).json({
        message: "This brand has categories or products. Deactivate it instead.",
      });
    }

    const item = await Brand.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ message: "Brand deleted successfully" });
  })
);

// ==========================================
// BRAND CATEGORY CRUD
// ==========================================

router.get(
  "/admin/brand-categories",
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.category) filter.category = req.query.category;

    const items = await populateBrandCategory(
      BrandCategory.find(filter).sort({ sortOrder: 1, createdAt: -1 })
    );

    res.json(items);
  })
);

router.post(
  "/admin/brand-categories",
  asyncHandler(async (req, res) => {
    const valid = await validateBrandCategory(
      req.body.brand,
      req.body.category
    );

    if (!valid) {
      return res.status(400).json({
        message: "Selected brand does not belong to the selected category",
      });
    }

    const item = await BrandCategory.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  "/admin/brand-categories/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid brand category ID" });
    }

    const current = await BrandCategory.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Brand category not found" });
    }

    const data = { ...current.toObject(), ...req.body };

    const valid = await validateBrandCategory(data.brand, data.category);

    if (!valid) {
      return res.status(400).json({
        message: "Selected brand does not belong to the selected category",
      });
    }

    const item = await BrandCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(item);
  })
);

router.delete(
  "/admin/brand-categories/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid brand category ID" });
    }

    if (await Product.exists({ brandCategory: id })) {
      return res.status(409).json({
        message: "This category contains products. Deactivate it instead.",
      });
    }

    const item = await BrandCategory.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Brand category not found" });
    }

    res.json({ message: "Brand category deleted successfully" });
  })
);

// ==========================================
// INDIVIDUAL PRODUCT CRUD
// ==========================================

router.get(
  "/admin/items",
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.brandCategory) {
      filter.brandCategory = req.query.brandCategory;
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.status === "active") filter.isActive = true;
    if (req.query.status === "inactive") filter.isActive = false;

    const items = await populateProduct(
      Product.find(filter).sort({ sortOrder: 1, createdAt: -1 })
    );

    res.json(items);
  })
);

router.post(
  "/admin/items",
  asyncHandler(async (req, res) => {
    const error = await validateProductRelations(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const item = await Product.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  "/admin/items/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const current = await Product.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Product not found" });
    }

    const data = { ...current.toObject(), ...req.body };

    const error = await validateProductRelations(data);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const item = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(item);
  })
);

router.delete(
  "/admin/items/:id",
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const item = await Product.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  })
);

export default router;
