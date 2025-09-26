import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProductById } from "@/api/EcommerceApi";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, toast]);

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    // Only require size selection if sizes are available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    // Only require color selection if colors are available
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color Required",
        description: "Please select a color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name}${
        selectedSize ? ` (${selectedSize}` : ""
      }${
        selectedColor ? `${selectedSize ? ", " : " ("}${selectedColor})` : ""
      } added to your cart.`,
    });
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link
            to="/"
            className="text-purple-600 hover:underline mt-4 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const nextImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex + 1) % 1);
  };

  const prevImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex - 1 + 1) % 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.image || "https://via.placeholder.com/600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-600">(32 reviews)</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              ₹{parseFloat(product.price).toFixed(2)}
            </p>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-gray-300 hover:border-purple-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        selectedColor === color.name
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-gray-300 hover:border-purple-600"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-6 text-lg"
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Authentication Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <LogIn className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Login Required
                </h2>
                <p className="text-gray-600">
                  Please login to add items to your cart and complete your
                  purchase.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleLoginRedirect}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Your Account
                </Button>

                <Button
                  onClick={handleRegisterRedirect}
                  variant="outline"
                  className="w-full py-3 text-lg border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create New Account
                </Button>

                <Button
                  onClick={() => setShowAuthPrompt(false)}
                  variant="ghost"
                  className="w-full py-2 text-gray-500 hover:text-gray-700"
                >
                  Continue Browsing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
