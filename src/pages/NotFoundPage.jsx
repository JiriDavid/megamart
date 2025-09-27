import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold text-purple-600 mb-4">404</h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-block"
            >
              <Package className="h-24 w-24 text-purple-400 mx-auto" />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The page you're looking for seems to have wandered off. Don't
              worry, even our best products sometimes get misplaced!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors w-full sm:w-auto">
                  <Home className="h-5 w-5 mr-2" />
                  Go Home
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center justify-center text-purple-600 hover:text-purple-700 transition-colors mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-500 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/products"
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/track-order"
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Track Order
              </Link>
              <Link
                to="/cart"
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Shopping Cart
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 opacity-10"
        >
          <Package className="h-32 w-32 text-purple-600" />
        </motion.div>

        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 120, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 opacity-10"
        >
          <ShoppingBag className="h-24 w-24 text-indigo-600" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
