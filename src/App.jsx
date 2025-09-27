import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { initializeSampleData } from "@/lib/storage";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import UserProfilePage from "@/pages/UserProfilePage";
import CartPage from "@/pages/CartPage";
import WishListPage from "@/pages/WishListPage";
import ContactPage from "@/pages/ContactPage";
import AdminPanel from "@/pages/AdminPanel";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ShoppingCart from "@/components/ShoppingCart";

function App() {
  useEffect(() => {
    // Initialize sample data on app startup
    initializeSampleData();
  }, []);

  return (
    <>
      <Helmet>
        <title>MegaMart - Premium Shoes & Clothing</title>
        <meta
          name="description"
          content="Discover premium shoes and clothing collections at MegaMart. Shop the latest fashion trends with quality and style."
        />
        <meta
          property="og:title"
          content="MegaMart - Premium Shoes & Clothing"
        />
        <meta
          property="og:description"
          content="Discover premium shoes and clothing collections at MegaMart. Shop the latest fashion trends with quality and style."
        />
      </Helmet>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <ShoppingCart />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishListPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route
                  path="/order-success/:orderId"
                  element={<OrderSuccessPage />}
                />
                <Route
                  path="/track-order/:orderId"
                  element={<TrackOrderPage />}
                />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
