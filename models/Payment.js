import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    method: {
      type: String,
      enum: ["card", "paypal", "bank_transfer", "upi", "wallet", "cod"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    transactionId: {
      type: String,
      sparse: true,
      unique: true,
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
    },
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "payu", "cashfree"],
      trim: true,
    },
    paymentData: {
      // Store gateway-specific payment data
      cardLast4: String,
      cardBrand: String,
      upiId: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundedAt: Date,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    failureReason: {
      type: String,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    webhookData: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ method: 1 });

// Pre-save middleware to generate transaction ID if not provided
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  }
  next();
});

// Virtual for formatted amount
paymentSchema.virtual("formattedAmount").get(function () {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function (startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        successfulPayments: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        successfulAmount: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
        refundedAmount: { $sum: "$refundAmount" },
      },
    },
  ]);
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
