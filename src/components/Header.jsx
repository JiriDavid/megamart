import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const { cart, wishlist } = useCart();
  const { isAuthenticated, currentUser, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MegaMart
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Contact
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className="relative text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden sm:inline">
                    {currentUser?.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <LogIn className="h-6 w-6" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
