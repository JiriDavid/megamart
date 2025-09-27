import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
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
  res.json({
    status: "OK",
    message: "MegaMart API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    // Don't intercept API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    console.log(`Serving index.html for route: ${req.path}`);
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  // Development mode - let Vite handle routing
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.json({
      message: "MegaMart API Server - Frontend served by Vite",
      frontend: "http://localhost:3000 or http://localhost:3001",
      api: `http://localhost:${PORT}/api`,
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Initialize database connection
const initializeApp = async () => {
  await connectDB();
};

// Initialize for deployment
initializeApp();

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
export default app;
