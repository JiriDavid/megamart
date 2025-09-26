import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["shoes", "apparel", "accessories"],
    },
    image: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sizes: [
      {
        type: String,
        enum: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ],
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    tags: [String],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
productSchema.index({ name: "text", description: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
