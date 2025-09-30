import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

const router = express.Router();

// All payment routes require authentication
router.use(ClerkExpressRequireAuth());

// GET /api/payments - Get user's payment history
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      method,
      sort = "-createdAt",
    } = req.query;

    let query = { user: req.auth.userId };

    if (status) query.status = status;
    if (method) query.method = method;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [{ path: "order", select: "items totalAmount status" }],
    };

    const payments = await Payment.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// GET /api/payments/:id - Get specific payment
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.auth.userId,
    }).populate("order", "items totalAmount status");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

// POST /api/payments - Create payment record (usually called by payment gateway webhook)
router.post("/", async (req, res) => {
  try {
    const { orderId, amount, method, transactionId, gateway, paymentData } =
      req.body;

    // Verify the order belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      user: req.auth.userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const payment = new Payment({
      order: orderId,
      user: req.auth.userId,
      amount,
      method,
      transactionId,
      gateway,
      paymentData,
      status: method === "cod" ? "pending" : "processing",
    });

    await payment.save();
    await payment.populate("order", "items totalAmount status");

    res.status(201).json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// PUT /api/payments/:id/status - Update payment status (admin only)
router.put("/:id/status", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    // Check if user is admin (using Clerk's publicMetadata)
    const userRole = req.auth.publicMetadata?.role || "user";
    if (userRole !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status, failureReason, refundAmount, refundReason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.status = status;

    if (status === "failed" && failureReason) {
      payment.failureReason = failureReason;
    }

    if (status === "refunded") {
      payment.refundAmount = refundAmount || payment.amount;
      payment.refundReason = refundReason;
      payment.refundedAt = new Date();
      payment.refundedBy = req.auth.userId;
    }

    await payment.save();

    // Update order status based on payment status
    if (status === "completed") {
      await Order.findByIdAndUpdate(payment.order, {
        status: "paid",
        paymentStatus: "paid",
      });
    } else if (status === "failed") {
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: "failed",
      });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// GET /api/payments/stats - Get payment statistics (admin only)
router.get("/admin/stats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userRole = req.auth.publicMetadata?.role || "user";
    if (userRole !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { startDate, endDate } = req.query;

    const stats = await Payment.getPaymentStats(
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );

    res.json(
      stats[0] || {
        totalPayments: 0,
        totalAmount: 0,
        successfulPayments: 0,
        successfulAmount: 0,
        failedPayments: 0,
        refundedAmount: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    res.status(500).json({ error: "Failed to fetch payment statistics" });
  }
});

// POST /api/payments/webhook/:gateway - Handle payment gateway webhooks
router.post("/webhook/:gateway", async (req, res) => {
  try {
    const { gateway } = req.params;
    const webhookData = req.body;

    // Store webhook data for processing
    console.log(`Received webhook from ${gateway}:`, webhookData);

    // Here you would process the webhook based on the gateway
    // For example, update payment status, verify transaction, etc.

    // For now, just acknowledge receipt
    res.json({ received: true, gateway });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
