import express from "express";
import Order from "../models/Order.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/orders - Get all orders (admin) or user's orders
router.get("/", async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: "-createdAt",
      populate: [
        { path: "user", select: "firstName lastName email" },
        { path: "items.product", select: "name image" },
      ],
    };

    const orders = await Order.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - Get single order
router.get("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Add validation for undefined or invalid IDs
    if (!orderId || orderId === "undefined" || orderId === "null") {
      return res.status(400).json({
        error: "Invalid order ID",
        received: orderId,
        message: "Order ID cannot be undefined or null",
      });
    }

    let order;

    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId)
        .populate("user", "firstName lastName email")
        .populate("items.product", "name image price");
    } else {
      // If not a valid ObjectId, try to find by any ID field
      order = await Order.findOne({
        $or: [{ _id: orderId }, { id: orderId }],
      })
        .populate("user", "firstName lastName email")
        .populate("items.product", "name image price");
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /api/orders - Create new order
router.post("/", async (req, res) => {
  try {
    const { user, ...orderData } = req.body;

    // Validate user ObjectId if provided
    if (user && !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Validate product ObjectIds in items
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (item.product && !mongoose.Types.ObjectId.isValid(item.product)) {
          return res.status(400).json({ error: "Invalid product ID in items" });
        }
      }
    }

    const order = new Order({ ...orderData, user });
    await order.save();

    // Populate the order for response
    await order.populate("user", "firstName lastName email");
    await order.populate("items.product", "name image price");

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT /api/orders/:id - Update order
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update order" });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
