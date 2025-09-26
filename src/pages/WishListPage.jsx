import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveFromWishlistToCart } = useCart();
  const { toast } = useToast();

  const handleMoveToCart = (product) => {
    moveFromWishlistToCart(product);
    toast({
      title: "Moved to Cart!",
      description: `${product.name} has been moved to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-xl text-gray-600">
            Your favorite items, all in one place.
          </p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add your favorite items to your wishlist to see them here.
            </p>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Discover Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-purple-600 mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
