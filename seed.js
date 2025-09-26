import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import Review from "./models/Review.js";
import Address from "./models/Address.js";
import Category from "./models/Category.js";

dotenv.config();

const connectDB = async () => {
  try {
    const isLocalhost =
      process.env.MONGODB_URI?.includes("localhost") ||
      !process.env.MONGODB_URI?.includes("mongodb+srv");
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/megamart",
      isLocalhost
        ? {}
        : {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
          }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    await Address.deleteMany({});
    await Category.deleteMany({});

    // Create sample categories
    const categories = await Category.insertMany([
      {
        name: "Shoes",
        slug: "shoes",
        description: "Footwear for all occasions",
        icon: "👟",
        sortOrder: 1,
      },
      {
        name: "Apparel",
        slug: "apparel",
        description: "Clothing and fashion items",
        icon: "👕",
        sortOrder: 2,
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories and add-ons",
        icon: "👜",
        sortOrder: 3,
      },
    ]);

    console.log("Sample categories created");

    // Create sample products
    const sampleProducts = [
      {
        name: "Urban Runner Sneakers",
        description:
          "Lightweight and stylish sneakers for the modern urban explorer. Built for comfort and speed.",
        price: 149.99,
        originalPrice: 199.99,
        category: "shoes",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        inStock: true,
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "White", hex: "#FFFFFF" },
        ],
      },
      {
        name: "Premium Leather Boots",
        description:
          "Handcrafted from genuine leather, these boots offer timeless style and rugged durability.",
        price: 249.99,
        category: "shoes",
        image:
          "https://images.unsplash.com/photo-1595460039393-985072b35a44?w=400&h=400&fit=crop",
        inStock: true,
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        colors: [
          { name: "Brown", hex: "#8B4513" },
          { name: "Black", hex: "#000000" },
        ],
      },
      {
        name: "Tech Performance Hoodie",
        description:
          "A sleek, modern hoodie made with moisture-wicking fabric. Perfect for workouts or casual wear.",
        price: 89.99,
        category: "apparel",
        image:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
        inStock: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
          { name: "Gray", hex: "#808080" },
          { name: "Black", hex: "#000000" },
        ],
      },
      {
        name: "Classic Leather Belt",
        description:
          "A versatile and durable leather belt that complements any outfit, from casual to formal.",
        price: 59.99,
        category: "accessories",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        inStock: true,
        sizes: ["S", "M", "L"],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Brown", hex: "#8B4513" },
        ],
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log("Sample products created");

    // Create admin user
    const adminUser = new User({
      email: "admin@megamart.com",
      username: "David Promise",
      password: "Flashies@25",
      name: "Admin User",
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created");

    // Create regular user
    const regularUser = new User({
      email: "user@megamart.com",
      username: "Regular User",
      password: "password123",
      name: "Regular User",
      role: "user",
    });

    await regularUser.save();
    console.log("Regular user created");

    // Create sample addresses for the regular user
    const addresses = await Address.insertMany([
      {
        user: regularUser._id,
        type: "home",
        isDefault: true,
        firstName: "Regular",
        lastName: "User",
        street: "123 Main Street",
        city: "New Delhi",
        state: "Delhi",
        zipCode: "110001",
        country: "India",
        phone: "+91-9876543210",
      },
      {
        user: regularUser._id,
        type: "work",
        isDefault: false,
        firstName: "Regular",
        lastName: "User",
        street: "456 Office Complex",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        country: "India",
        phone: "+91-9876543211",
      },
    ]);

    console.log("Sample addresses created");

    // Create sample cart for the regular user
    const cart = new Cart({
      user: regularUser._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 2,
          size: "9",
          color: "Black",
          image: products[0].image,
        },
        {
          product: products[2]._id,
          name: products[2].name,
          price: products[2].price,
          quantity: 1,
          size: "L",
          color: "Gray",
          image: products[2].image,
        },
      ],
    });

    await cart.save();
    console.log("Sample cart created");

    // Create sample reviews
    const reviews = await Review.insertMany([
      {
        user: regularUser._id,
        product: products[0]._id,
        rating: 5,
        title: "Amazing sneakers!",
        comment:
          "These sneakers are incredibly comfortable and stylish. Perfect for daily wear and workouts.",
        isVerified: true,
        status: "approved",
      },
      {
        user: regularUser._id,
        product: products[2]._id,
        rating: 4,
        title: "Great hoodie",
        comment:
          "Love the material and fit. It's perfect for layering and stays comfortable all day.",
        isVerified: true,
        status: "approved",
      },
    ]);

    console.log("Sample reviews created");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
