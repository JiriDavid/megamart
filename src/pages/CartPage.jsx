import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } =
    useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const shippingCost = 50.0;
  const total = cartTotal + shippingCost;

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
            Your Shopping Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your items and proceed to checkout.
          </p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cart Items ({cart.length})
                </h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 border-b pb-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      {item.size && item.color && (
                        <p className="text-sm text-gray-600">
                          Size: {item.size}, Color: {item.color}
                        </p>
                      )}
                      <p className="text-lg font-bold text-purple-600 mt-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity - 1,
                            item.size,
                            item.color
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity + 1,
                            item.size,
                            item.color
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        removeFromCart(item.id, item.size, item.color)
                      }
                    >
                      <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-600" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 h-fit"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    ₹{shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 py-3 text-lg"
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
