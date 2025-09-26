// E-commerce API for frontend-backend communication
import {
  getProductsEnhanced,
  getProductByIdEnhanced,
  saveProductEnhanced,
  deleteProductEnhanced,
  initializeSampleData,
  saveOrderEnhanced,
} from "@/lib/storage";

// API Base URL - Dynamic based on environment
const API_BASE_URL = import.meta.env.PROD
  ? "/api" // Use relative URL in production
  : `http://localhost:${import.meta.env.VITE_API_PORT || 5001}/api`;

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error.message);
    throw error;
  }
};

// Initialize sample data if no products exist (fallback only)
initializeSampleData();

// Get all products
export const getProducts = async () => {
  try {
    // Try API first
    const data = await apiCall("/products");
    return data.products || data || [];
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const products = await getProductsEnhanced();
    return products;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    // Try API first
    const data = await apiCall(`/products/${id}`);
    return data.product || data;
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const product = await getProductByIdEnhanced(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    // Try API first
    const data = await apiCall("/products/categories");
    return data.categories || [];
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const products = await getProductsEnhanced();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.map((category) => ({ name: category, id: category }));
  }
};

// Save a product
export const saveProduct = async (productData) => {
  try {
    // Try API first
    if (productData.id) {
      const data = await apiCall(`/products/${productData.id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
      return data.product || data;
    } else {
      const data = await apiCall("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      return data.product || data;
    }
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const result = await saveProductEnhanced(productData);
    return result;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    // Try API first
    await apiCall(`/products/${productId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const result = await deleteProductEnhanced(productId);
    return result;
  }
};

// Initialize checkout (create order)
export const initializeCheckout = async (cartItems) => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate totals
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingCost = 50; // Fixed shipping cost
    const total = subtotal + shippingCost;

    // Create order data
    const orderData = {
      items: cartItems,
      subtotal,
      shippingCost,
      total,
      customerInfo: {
        name: "Guest User", // In a real app, this would come from user auth
        email: "",
        phone: "",
      },
    };

    // Try API first for saving order
    try {
      const data = await apiCall("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      const order = data.order || data;

      // Redirect to order success page with order ID
      window.location.href = `/order-success/${order.id || order._id}`;

      return { success: true, orderId: order.id || order._id };
    } catch (error) {
      console.error("API call failed, using storage fallback:", error);
      // Fallback to enhanced storage function
      const order = await saveOrderEnhanced(orderData);

      // Redirect to order success page with order ID
      window.location.href = `/order-success/${order.id}`;

      return { success: true, orderId: order.id };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
