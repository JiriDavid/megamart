import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { initializeCheckout } from "@/api/EcommerceApi";
import { useToast } from "@/components/ui/use-toast";

const ShoppingCart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } =
    useCart();
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await initializeCheckout(cart);
    } catch (error) {
      toast({
        title: "Checkout Error",
        description:
          "There was a problem initializing checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = cart.length > 0 ? 5.0 : 0;
  const total = cartTotal + shippingCost;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <ShoppingBag className="h-24 w-24 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add items to see them here.
                </p>
                <Button onClick={toggleCart}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        ${shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full mt-2"
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
