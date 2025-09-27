// E-commerce API for frontend-backend communication
import {
  getProductsEnhanced,
  getProductByIdEnhanced,
  saveProductEnhanced,
  deleteProductEnhanced,
  initializeSampleData,
  saveOrderEnhanced,
  getOrdersEnhanced,
  updateOrderEnhanced,
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

// Helper function to normalize product data
const normalizeProduct = (product) => {
  if (!product) return product;

  // Ensure the product has an id field for frontend compatibility
  if (product._id && !product.id) {
    product.id = product._id.toString();
  }

  return product;
};

// Helper function to normalize order data
const normalizeOrder = (order) => {
  if (!order) return order;

  // Ensure the order has an id field for frontend compatibility
  if (order._id && !order.id) {
    order.id = order._id.toString();
  }

  return order;
};

// Helper function to normalize array of products
const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return products;
  return products.map(normalizeProduct);
};

// Get all products
export const getProducts = async () => {
  try {
    // Try API first
    const data = await apiCall("/products");
    const products = data.products || data || [];
    return normalizeProducts(products);
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const products = await getProductsEnhanced();
    return normalizeProducts(products);
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    // Try API first
    const data = await apiCall(`/products/${id}`);
    const product = data.product || data;
    return normalizeProduct(product);
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const product = await getProductByIdEnhanced(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return normalizeProduct(product);
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
      const product = data.product || data;
      return normalizeProduct(product);
    } else {
      const data = await apiCall("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      const product = data.product || data;
      return normalizeProduct(product);
    }
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const result = await saveProductEnhanced(productData);
    return normalizeProduct(result);
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

// Create order (improved version)
export const createOrder = async (orderData) => {
  try {
    // Try API first
    const data = await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const order = data.order || data;

    // Apply normalization to ensure ID is available
    const normalizedOrder = normalizeOrder(order);

    return normalizedOrder;
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const order = await saveOrderEnhanced(orderData);

    return normalizeOrder(order);
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    // Try API first
    const data = await apiCall(`/orders/${orderId}`);
    const order = data.order || data;

    return normalizeOrder(order);
  } catch (error) {
    console.error("API call failed for order:", error);
    throw new Error("Order not found");
  }
};

// Update order
export const updateOrder = async (orderId, updateData) => {
  try {
    // Try API first
    const data = await apiCall(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    const order = data.order || data;
    return normalizeOrder(order);
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const order = await updateOrderEnhanced(orderId, updateData);
    return normalizeOrder(order);
  }
};

// Get all orders (for admin)
export const getOrders = async () => {
  try {
    // Try API first
    const data = await apiCall("/orders");
    const orders = data.orders || data || [];
    return orders.map(normalizeOrder);
  } catch (error) {
    console.error("API call failed, using storage fallback:", error);
    // Fallback to enhanced storage function
    const orders = await getOrdersEnhanced();
    return orders.map(normalizeOrder);
  }
};

// Initialize checkout (create order) - DEPRECATED, use createOrder instead
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

      // Apply normalization to ensure ID is available
      const normalizedOrder = normalizeOrder(order);
      const orderId = normalizedOrder.id || normalizedOrder._id;

      if (!orderId) {
        throw new Error("Order was created but no ID was returned");
      }

      // Redirect to order success page with order ID
      window.location.href = `/order-success/${orderId}`;

      return { success: true, orderId: orderId };
    } catch (error) {
      console.error("API call failed, using storage fallback:", error);
      // Fallback to enhanced storage function
      const order = await saveOrderEnhanced(orderData);

      const orderId = order.id || order._id;

      // Redirect to order success page with order ID
      window.location.href = `/order-success/${orderId}`;

      return { success: true, orderId: orderId };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
