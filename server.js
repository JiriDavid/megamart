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

// Simple database connection for serverless
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) return true;

    // Check if MONGODB_URI is available
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable not set");
      return false;
    }

    console.log("🔄 Attempting database connection...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Reduced timeout for serverless
      socketTimeoutMS: 10000,
      maxPoolSize: 5, // Limit connection pool
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
    });

    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Middleware to ensure database connection for API routes
const ensureDBConnection = async (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    try {
      const connected = await connectDB();
      if (!connected) {
        console.log("🔄 Database unavailable, returning fallback response");
        return res.status(503).json({
          error: "Database unavailable",
          fallback: true,
        });
      }
    } catch (error) {
      console.error("Database connection middleware error:", error);
      return res.status(503).json({
        error: "Database connection error",
        fallback: true,
      });
    }
  }
  next();
};

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(ensureDBConnection);

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
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    const hasMongoURI = !!process.env.MONGODB_URI;
    const hasJWTSecret = !!process.env.JWT_SECRET;

    res.json({
      status: "OK",
      database: dbConnected ? "connected" : "disconnected",
      environment: {
        MONGODB_URI: hasMongoURI,
        JWT_SECRET: hasJWTSecret,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: !!process.env.VERCEL,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
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
