import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import serverless from "serverless-http";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/carts.js";
import reviewRoutes from "./routes/reviews.js";
import addressRoutes from "./routes/addresses.js";
import paymentRoutes from "./routes/payments.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Simple database connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return true;

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/megamart"
    );
    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "OK",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// For local development
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for serverless
export default serverless(app);
