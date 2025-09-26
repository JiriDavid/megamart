import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  QrCode,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { getOrderByIdEnhanced } from "@/lib/storage";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderByIdEnhanced(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <Link
            to="/"
            className="text-purple-600 hover:underline mt-4 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="text-center mb-8"
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Order Request Submitted!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Your order request has been created and is pending admin
              confirmation.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Order ID: <span className="font-mono font-bold">{order.id}</span>
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Order Status:</strong> Pending Confirmation
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Our team will review your order and confirm product
                    availability within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer & Shipping Info */}
          {(order.customerInfo || order.shippingAddress) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer & Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {order.customerInfo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Customer Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong> {order.customerInfo.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customerInfo.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.customerInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
                {order.shippingAddress && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-2">
                      <p>
                        {order.shippingAddress?.street ||
                          order.shippingAddress?.address}
                      </p>
                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </p>
                      <p>
                        {order.shippingAddress?.country} -{" "}
                        {order.shippingAddress?.zipCode ||
                          order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Details
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
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

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {order.subtotal?.toFixed(2) ||
                    order.totalAmount?.toFixed(2) ||
                    "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping:</span>
                <span>₹{order.shippingCost?.toFixed(2) || "50.00"}</span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between text-lg">
                  <span>Payment Method:</span>
                  <span className="capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-2">
                <span>Total:</span>
                <span>
                  ₹
                  {order.total?.toFixed(2) ||
                    order.totalAmount?.toFixed(2) ||
                    "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Notes
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Payment Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Payment Instructions
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Payment After Confirmation
                  </h3>
                </div>
              </div>
              <p className="text-blue-800 mb-4">
                You will receive a notification once your order is confirmed and
                product availability is verified. At that time, you can proceed
                with payment using one of the following methods:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <QrCode className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  UPI / QR Code Payment
                </h3>
                <p className="text-gray-600 mb-4">
                  Pay using UPI, Google Pay, PhonePe, or scan the QR code shown
                  at our store after order confirmation.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    QR Code will be available after order confirmation
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <MapPin className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Cash Payment at Store
                </h3>
                <p className="text-gray-600 mb-4">
                  Pay in cash at our store location after order confirmation.
                </p>
                <p className="font-semibold">KP26 Room 1A-77</p>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://wa.me/919556307048"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 border rounded-lg p-4 hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">WhatsApp: +91 9556307048</span>
              </a>
              <a
                href="tel:+919040989360"
                className="flex items-center justify-center space-x-2 border rounded-lg p-4 hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Call: +91 9040989360</span>
              </a>
              <a
                href="tel:+918093890570"
                className="flex items-center justify-center space-x-2 border rounded-lg p-4 hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Call: +91 8093890570</span>
              </a>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">
                Order Processing & Delivery
              </h3>
            </div>
            <div className="space-y-2 text-blue-800">
              <p>
                <strong>Step 1:</strong> Order confirmation within 24 hours
              </p>
              <p>
                <strong>Step 2:</strong> Product availability verification
              </p>
              <p>
                <strong>Step 3:</strong> Payment collection
              </p>
              <p>
                <strong>Step 4:</strong> Processing and shipping within 5
                working days after payment
              </p>
            </div>
            <p className="text-blue-800 mt-4">
              You will receive updates on your order status at each step.
            </p>
          </div>

          {/* Track Order */}
          <div className="text-center">
            <Link to={`/track-order/${order.id}`}>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 mr-4"
              >
                Track Your Order
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
