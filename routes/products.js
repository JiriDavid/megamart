import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ categories: categories.map((cat) => ({ id: cat, name: cat })) });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId || productId === "undefined") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = mongoose.Types.ObjectId.isValid(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ $or: [{ _id: productId }, { id: productId }] });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = mongoose.Types.ObjectId.isValid(productId)
      ? await Product.findByIdAndUpdate(productId, req.body, { new: true })
      : await Product.findOneAndUpdate(
          { $or: [{ _id: productId }, { id: productId }] },
          req.body,
          { new: true }
        );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = mongoose.Types.ObjectId.isValid(productId)
      ? await Product.findByIdAndDelete(productId)
      : await Product.findOneAndDelete({
          $or: [{ _id: productId }, { id: productId }],
        });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
