import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
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
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || true
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
          ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure JSON responses
app.use((req, res, next) => {
  // Override res.send to ensure JSON responses
  const originalSend = res.send;
  res.send = function (data) {
    if (typeof data === "object" && data !== null) {
      return res.json(data);
    }
    if (typeof data !== "string") {
      return res.json({ data: String(data) });
    }
    return originalSend.call(this, data);
  };
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const isLocalhost =
      process.env.MONGODB_URI?.includes("localhost") ||
      !process.env.MONGODB_URI?.includes("mongodb+srv");

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "URI:",
      process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 20) + "..."
        : "Not set"
    );

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/megamart",
      isLocalhost
        ? {}
        : {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
          }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log("\n🔄 Starting with localStorage fallback for development...");
    console.log(
      "ℹ️  The application will use local storage for data persistence."
    );
    console.log(
      "ℹ️  To use MongoDB, ensure your IP is whitelisted in MongoDB Atlas"
    );
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
app.get("/api/health", (req, res) => {
  try {
    res.status(200).json({
      status: "OK",
      message: "MegaMart API is running",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ error: "Health check failed" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Initialize database connection
const initializeApp = async () => {
  try {
    await connectDB();
    console.log("Database initialized for serverless function");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

// Initialize for deployment (both local and serverless)
initializeApp();

// Add catch-all for non-API routes in serverless (should not happen due to Vercel routing)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    // This shouldn't happen in serverless, but just in case
    res.status(404).json({
      error: "Route not found",
      message: "This endpoint should be handled by Vercel routing",
    });
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

// For local development only
if (!process.env.VERCEL) {
  const startServer = async () => {
    const dbConnected = await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(
        `📊 Database: ${
          dbConnected ? "MongoDB Atlas" : "LocalStorage fallback"
        }`
      );
      console.log("─".repeat(50));
    });
  };

  startServer();
}

// Export for serverless deployment
export default serverless(app);
