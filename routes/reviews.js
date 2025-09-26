import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/reviews - Get all reviews with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      product,
      user,
      status = "approved",
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    let query = { status };

    if (product) query.product = product;
    if (user) query.user = user;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        { path: "user", select: "name" },
        { path: "product", select: "name image" },
      ],
    };

    const reviews = await Review.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET /api/reviews/product/:productId - Get reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({
      product: req.params.productId,
      status: "approved",
    })
      .sort("-createdAt")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("user", "name");

    const total = await Review.countDocuments({
      product: req.params.productId,
      status: "approved",
    });

    // Get average rating
    const stats = await Review.aggregate([
      { $match: { product: req.params.productId, status: "approved" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    const averageRating = stats[0]?.averageRating || 0;
    const totalReviews = stats[0]?.totalReviews || 0;

    res.json({
      reviews,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Failed to fetch product reviews" });
  }
});

// POST /api/reviews - Create a new review (requires authentication)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { product, rating, title, comment, images } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product,
    });

    if (existingReview) {
      return res.status(400).json({
        error: "You have already reviewed this product",
      });
    }

    // Check if user has purchased the product (optional validation)
    // You can add order validation here if needed

    const review = new Review({
      user: req.user.id,
      product,
      rating,
      title,
      comment,
      images: images || [],
    });

    await review.save();
    await review.populate("user", "name");

    // Update product rating and review count
    await updateProductRating(product);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create review" });
  }
});

// PUT /api/reviews/:id - Update review (only by review author)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this review" });
    }

    const { rating, title, comment, images } = req.body;

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;

    await review.save();
    await review.populate("user", "name");

    // Update product rating
    await updateProductRating(review.product);

    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// DELETE /api/reviews/:id - Delete review (by author or admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    // Update product rating
    await updateProductRating(review.product);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// PUT /api/reviews/:id/helpful - Mark review as helpful
router.put("/:id/helpful", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    res.status(500).json({ error: "Failed to mark review as helpful" });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const stats = await Review.aggregate([
      { $match: { product: productId, status: "approved" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating = stats[0]?.averageRating || 0;
    const reviewCount = stats[0]?.reviewCount || 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}

export default router;
