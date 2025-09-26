import express from "express";
import Wishlist from "../models/Wishlist.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/wishlist/:userId - Get user's wishlist
router.get("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const wishlist = await Wishlist.findOne({
      user: req.params.userId,
    }).populate("items.product", "name image price category");

    if (!wishlist) {
      return res.json({ items: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist - Add item to wishlist
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    await wishlist.populate("items.product", "name image price category");

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/:userId/:productId - Remove item from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("items.product", "name image price category");

    res.json(wishlist);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

// DELETE /api/wishlist/:userId - Clear entire wishlist
router.delete("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.params.userId,
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ error: "Failed to clear wishlist" });
  }
});

export default router;
