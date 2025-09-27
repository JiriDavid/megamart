import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { createOrder } from "@/api/EcommerceApi";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Customer Info & Additional Info, 2: Confirmation

  const shippingCost = 0.0;
  const total = cartTotal;

  const validatePhoneNumber = (phone) => {
    // Indian phone number validation (10 digits, optionally starting with +91)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(customerInfo.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number (10 digits).",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Validate user ID format
    const userId = currentUser?.id || currentUser?._id;
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      // Clear invalid user session
      localStorage.removeItem("megamart_current_user");
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data with proper backend structure
      const orderData = {
        user: currentUser?.id || currentUser?._id, // Use 'user' instead of 'userId'
        items: cart.map((item) => ({
          product: item._id || item.id, // Use ObjectId reference
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        totalAmount: total, // Use 'totalAmount' instead of 'total'
        shippingCost,
        customerInfo,
        shippingAddress: {
          firstName: customerInfo.name.split(" ")[0] || customerInfo.name,
          lastName: customerInfo.name.split(" ").slice(1).join(" ") || "",
          email: customerInfo.email,
          phone: customerInfo.phone,
          street: shippingAddress.address,
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          zipCode: shippingAddress.pincode || "",
          country: shippingAddress.country || "India",
        },
        paymentMethod: "cod",
        notes: orderNotes,
        status: "pending",
      };

      // Save order
      const order = await createOrder(orderData);

      // Clear cart
      clearCart();

      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been created.`,
      });

      // Redirect to order success page
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= stepNum
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNum}
          </div>
          {stepNum < 2 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step > stepNum ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderCustomerInfo = () => (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleCustomerInfoSubmit}
      className="space-y-6"
    >
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Information & Delivery Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, email: e.target.value })
            }
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={customerInfo.phone}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your phone number (10 digits)"
          required
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Delivery Address
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <textarea
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your complete address"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City (Optional)
            </label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State (Optional)
            </label>
            <input
              type="text"
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN Code (Optional)
            </label>
            <input
              type="text"
              value={shippingAddress.pincode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  pincode: e.target.value,
                })
              }
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="PIN Code"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Any special instructions or notes for your order..."
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
        >
          Review Order
        </Button>
      </div>
    </motion.form>
  );

  const renderOrderReview = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Customer Information
          </h3>
          <p className="text-gray-600">{customerInfo.name}</p>
          {customerInfo.email && (
            <p className="text-gray-600">{customerInfo.email}</p>
          )}
          <p className="text-gray-600">{customerInfo.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
          <p className="text-gray-600">{shippingAddress.address}</p>
          {(shippingAddress.city ||
            shippingAddress.state ||
            shippingAddress.pincode) && (
            <p className="text-gray-600">
              {[
                shippingAddress.city,
                shippingAddress.state,
                shippingAddress.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>

        {orderNotes && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
            <p className="text-gray-600">{orderNotes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="px-8 py-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handlePaymentSubmit}
          disabled={isProcessing}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </motion.div>
  );

  const renderOrderSummary = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity}
                {item.size && ` | Size: ${item.size}`}
                {item.color && ` | Color: ${item.color}`}
              </p>
              <p className="text-lg font-bold text-purple-600">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link
            to="/"
            className="text-purple-600 hover:underline mt-4 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-xl text-gray-600">
            Complete your order by filling in the details below.
          </p>
        </motion.div>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && renderCustomerInfo()}
            {step === 2 && renderOrderReview()}
          </div>

          {/* Order Summary - Always visible */}
          <div className="lg:col-span-1">{renderOrderSummary()}</div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
