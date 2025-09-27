import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// Middleware to check database connection
const checkDBConnection = async (req, res, next) => {
  // If already connected, proceed
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  // In serverless/production, if not connected, use fallback immediately
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return res.status(503).json({
      error: "Database not available",
      message: "Using localStorage fallback on frontend",
      fallback: true,
    });
  }

  // In development, try to connect
  try {
    const isLocalhost =
      process.env.MONGODB_URI?.includes("localhost") ||
      !process.env.MONGODB_URI?.includes("mongodb+srv");

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/megamart",
      isLocalhost
        ? {}
        : {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
          }
    );

    // Check if connection is now ready
    if (mongoose.connection.readyState === 1) {
      return next();
    }
  } catch (error) {
    console.error("Database connection check failed:", error);
  }

  // If connection failed or still not ready, return fallback
  return res.status(503).json({
    error: "Database not available",
    message: "Using localStorage fallback on frontend",
    fallback: true,
  });
};

// GET /api/products/categories - Get all categories (MUST come before /:id route)
router.get("/categories", checkDBConnection, async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const categoryObjects = categories.map((category) => ({
      id: category,
      name: category,
    }));
    res.json({ categories: categoryObjects });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/products - Get all products with optional filtering
router.get("/", checkDBConnection, async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [],
    };

    const products = await Product.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", checkDBConnection, async (req, res) => {
  try {
    const productId = req.params.id;

    // Add validation for undefined or invalid IDs
    if (!productId || productId === "undefined" || productId === "null") {
      return res.status(400).json({
        error: "Invalid product ID",
        received: productId,
        message: "Product ID cannot be undefined or null",
      });
    }

    let product;

    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      // If not a valid ObjectId, try to find by any ID field
      product = await Product.findOne({
        $or: [{ _id: productId }, { id: productId }],
      });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products - Create new product
router.post("/", checkDBConnection, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id - Update product
router.put("/:id", checkDBConnection, async (req, res) => {
  try {
    const productId = req.params.id;
    let product;

    // Try to update by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      // If not a valid ObjectId, try to find and update by any ID field
      product = await Product.findOneAndUpdate(
        {
          $or: [{ _id: productId }, { id: productId }],
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", checkDBConnection, async (req, res) => {
  try {
    const productId = req.params.id;
    let product;

    // Try to delete by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findByIdAndDelete(productId);
    } else {
      // If not a valid ObjectId, try to find and delete by any ID field
      product = await Product.findOneAndDelete({
        $or: [{ _id: productId }, { id: productId }],
      });
    }

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
