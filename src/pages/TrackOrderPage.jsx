import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { getOrderByIdEnhanced } from "@/lib/storage";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(orderId || "");

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (id) => {
    setLoading(true);
    try {
      const orderData = await getOrderByIdEnhanced(id);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchId.trim()) {
      fetchOrder(searchId.trim());
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock },
      { key: "confirmed", label: "Order Confirmed", icon: CheckCircle },
      { key: "paid", label: "Payment Received", icon: CheckCircle },
      { key: "shipped", label: "Order Shipped", icon: Truck },
      { key: "delivered", label: "Delivered", icon: Package },
    ];

    const statusIndex = steps.findIndex((step) => step.key === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      current: index === statusIndex,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600">
            Enter your order ID to track your order status.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter your Order ID"
              className="flex-1 px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 px-6"
            >
              <Search className="h-5 w-5 mr-2" />
              Track
            </Button>
          </div>
        </div>

        {order ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Status
              </h2>
              <div className="mb-6">
                <p className="text-lg text-gray-600">
                  Order ID:{" "}
                  <span className="font-mono font-bold">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="flex justify-between items-center">
                  {getStatusSteps(order.status).map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : step.current
                              ? "bg-purple-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <p
                          className={`text-sm font-medium text-center ${
                            step.completed || step.current
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {index < getStatusSteps(order.status).length - 1 && (
                          <div
                            className={`absolute top-6 left-1/2 w-full h-0.5 ${
                              step.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                            style={{ transform: "translateX(50%)", zIndex: -1 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Details
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} | Size: {item.size} | Color:{" "}
                        {item.color}
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Shipping:</span>
                  <span>₹{order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2">
                  <span>Total:</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            {order.status === "paid" ||
            order.status === "shipped" ||
            order.status === "delivered" ? (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Delivery Information
                </h3>
                <p className="text-blue-800">
                  Your order is expected to be delivered within 5 working days
                  from the date of payment confirmation.
                </p>
              </div>
            ) : null}
          </motion.div>
        ) : searchId && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find an order with ID: {searchId}
            </p>
            <p className="text-sm text-gray-500">
              Please check your order ID and try again.
            </p>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
};

export default TrackOrderPage;
