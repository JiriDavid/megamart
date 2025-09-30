import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// All cart routes require authentication
router.use(ClerkExpressRequireAuth());

// GET /api/cart - Get user's cart
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.auth.userId }).populate(
      "items.product",
      "name image price category inStock"
    );

    if (!cart) {
      // Create empty cart if none exists
      cart = new Cart({ user: req.auth.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart/items - Add item to cart
router.post("/items", async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      cart = new Cart({ user: req.auth.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name image price category inStock");

    res.json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT /api/cart/items/:itemId - Update cart item
router.put("/items/:itemId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Valid quantity is required" });
    }

    const cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name image price category inStock");

    res.json(cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/items/:itemId - Remove item from cart
router.delete("/items/:itemId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate("items.product", "name image price category inStock");

    res.json(cart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete("/", async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.auth.userId },
      { items: [] },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
