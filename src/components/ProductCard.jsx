import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const ProductCard = ({ product, layout = "grid" }) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useCart();
  const { toast } = useToast();

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden product-card group h-full flex ${
        layout === "list" ? "flex-row" : "flex-col"
      }`}
    >
      <Link
        to={`/product/${product.id}`}
        className={`block overflow-hidden ${
          layout === "list" ? "w-48 flex-shrink-0" : ""
        }`}
      >
        <div className="relative">
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            className={`${
              layout === "list"
                ? "w-full h-48 object-cover"
                : "w-full h-64 object-cover"
            } group-hover:scale-105 transition-transform duration-300`}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
              {product.category}
            </span>
          </div>
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist
                  ? "text-red-500 fill-current"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </Link>

      <div
        className={`p-6 flex flex-col ${
          layout === "list" ? "flex-1" : "flex-grow"
        }`}
      >
        <div
          className={`flex items-center justify-between mb-2 ${
            layout === "list" ? "flex-col items-start space-y-2" : ""
          }`}
        >
          <h3
            className={`font-semibold text-gray-900 ${
              layout === "list" ? "text-xl" : "text-lg truncate"
            }`}
          >
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <p
          className={`text-gray-600 text-sm mb-4 ${
            layout === "list" ? "line-clamp-3" : "line-clamp-2 flex-grow"
          }`}
        >
          {product.description}
        </p>

        <div
          className={`flex items-center justify-between mb-4 ${
            layout === "list" ? "mt-4" : "mt-auto"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">
              ₹{parseFloat(product.price).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₹{parseFloat(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className={`${layout === "list" ? "" : "mt-auto"}`}>
          <Link to={`/product/${product.id}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
