import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X, Upload } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "shoes",
    image: "",
    inStock: true,
    sizes: [],
    colors: [],
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "shoes",
        image: product.image || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        sizes: product.sizes || [],
        colors: product.colors || [],
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorAdd = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "#000000" }],
    }));
  };

  const handleColorChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      ),
    }));
  };

  const handleColorRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.description || !formData.price) {
      return;
    }

    if (uploading) {
      toast({
        title: "Image still uploading",
        description: "Please wait for the image upload to finish.",
      });
      return;
    }

    // Convert price to number
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      // Only include sizes and colors for shoes and apparel
      sizes:
        formData.category === "shoes" || formData.category === "apparel"
          ? formData.sizes
          : [],
      colors:
        formData.category === "shoes" || formData.category === "apparel"
          ? formData.colors.filter((color) => color.name.trim() !== "")
          : [],
    };

    onSave(productData);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: result.url }));
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully.",
      });
    } catch (err) {
      console.error("Image upload failed", err);
      toast({
        title: "Upload failed",
        description: "Please verify your Cloudinary settings and try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    { value: "shoes", label: "Shoes" },
    { value: "apparel", label: "Apparel" },
    { value: "accessories", label: "Accessories" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {product ? "Edit Product" : "Add New Product"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="originalPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Original Price (₹){" "}
              <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                or paste an image URL
              </span>
            </div>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleInputChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
            In Stock
          </label>
        </div>

        {/* Size Selection - Only for shoes and apparel */}
        {(formData.category === "shoes" || formData.category === "apparel") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Sizes
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {(formData.category === "shoes"
                ? ["6", "7", "8", "9", "10", "11", "12"]
                : ["XS", "S", "M", "L", "XL", "XXL"]
              ).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    formData.sizes.includes(size)
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 hover:border-purple-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {formData.sizes.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected sizes: {formData.sizes.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Color Selection - Only for shoes and apparel */}
        {(formData.category === "shoes" || formData.category === "apparel") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Colors
            </label>
            <div className="space-y-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) =>
                      handleColorChange(index, "hex", e.target.value)
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Color name"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleColorRemove(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleColorAdd}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                + Add Color
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-4 pt-6">
          <Button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={uploading}
          >
            <Save className="h-4 w-4 mr-2" />
            {uploading
              ? "Uploading..."
              : product
              ? "Update Product"
              : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
