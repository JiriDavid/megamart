// API-based storage utilities for product management
const API_BASE_URL = import.meta.env.PROD
  ? "/api" // Use relative URL in production
  : `http://localhost:${import.meta.env.VITE_API_PORT || 5001}/api`;

// Fallback to localStorage when API is unavailable
let useLocalStorage = false;

// Helper function for API calls with fallback
const apiCall = async (endpoint, options = {}) => {
  if (useLocalStorage) {
    throw new Error("Using localStorage fallback");
  }

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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Reset localStorage flag if API call succeeds
    useLocalStorage = false;
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error.message);
    if (
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("HTTP error! status: 5")
    ) {
      console.log("🔄 Switching to localStorage fallback mode");
      useLocalStorage = true;
    }
    throw error;
  }
};

// Get all products from API
export const getProducts = async () => {
  try {
    const data = await apiCall("/products");
    return data.products || [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};

// Save a product via API
export const saveProduct = async (productData) => {
  try {
    if (productData.id) {
      // Update existing product
      const data = await apiCall(`/products/${productData.id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
      return data;
    } else {
      // Add new product
      const data = await apiCall("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      return data;
    }
  } catch (error) {
    console.error("Error saving product:", error);
    throw new Error("Failed to save product");
  }
};

// Delete a product via API
export const deleteProduct = async (productId) => {
  try {
    await apiCall(`/products/${productId}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Get a single product by ID via API
export const getProductById = async (productId) => {
  try {
    const data = await apiCall(`/products/${productId}`);
    return data;
  } catch (error) {
    console.error("Error loading product:", error);
    return null;
  }
};

// Initialize with sample data (this would typically be done via database seeding)
export const initializeSampleData = async () => {
  try {
    // Force localStorage mode for development if no products exist
    const products = getProductsFallback();
    if (products.length === 0) {
      console.log("🔄 Initializing sample data in localStorage");
      const sampleProducts = [
        {
          name: "Urban Runner Sneakers",
          description:
            "Lightweight and stylish sneakers for the modern urban explorer. Built for comfort and speed.",
          price: 149.99,
          originalPrice: 199.99,
          category: "shoes",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          inStock: true,
          sizes: ["6", "7", "8", "9", "10", "11", "12"],
          colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" },
          ],
        },
        {
          name: "Premium Leather Boots",
          description:
            "Handcrafted from genuine leather, these boots offer timeless style and rugged durability.",
          price: 249.99,
          category: "shoes",
          image:
            "https://images.unsplash.com/photo-1595460039393-985072b35a44?w=400&h=400&fit=crop",
          inStock: true,
          sizes: ["6", "7", "8", "9", "10", "11", "12"],
          colors: [
            { name: "Brown", hex: "#8B4513" },
            { name: "Black", hex: "#000000" },
          ],
        },
        {
          name: "Tech Performance Hoodie",
          description:
            "A sleek, modern hoodie made with moisture-wicking fabric. Perfect for workouts or casual wear.",
          price: 89.99,
          category: "apparel",
          image:
            "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
          inStock: true,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Gray", hex: "#808080" },
            { name: "Black", hex: "#000000" },
          ],
        },
        {
          name: "Classic Leather Belt",
          description:
            "A versatile and durable leather belt that complements any outfit, from casual to formal.",
          price: 59.99,
          category: "accessories",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
          inStock: true,
          sizes: ["S", "M", "L"],
          colors: [
            { name: "Black", hex: "#000000" },
            { name: "Brown", hex: "#8B4513" },
          ],
        },
      ];

      for (const product of sampleProducts) {
        saveProductFallback(product);
      }
      console.log("✅ Sample data initialized in localStorage");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};

// Order management functions
export const getOrders = async (userId = null) => {
  try {
    const endpoint = userId ? `/orders?userId=${userId}` : "/orders";
    const data = await apiCall(endpoint);
    return data.orders || [];
  } catch (error) {
    console.error("Error loading orders:", error);
    throw error; // Re-throw the error so fallback can be triggered
  }
};

export const saveOrder = async (orderData) => {
  try {
    const data = await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return data;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
};

export const updateOrder = async (orderId, updateData) => {
  try {
    const data = await apiCall(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    return data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};

export const getOrderById = async (orderId) => {
  try {
    const data = await apiCall(`/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error("Error loading order:", error);
    throw error; // Re-throw the error so fallback can be triggered
  }
};

// User management functions
export const getUsers = async () => {
  try {
    const data = await apiCall("/users");
    return data.users || [];
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

export const saveUser = async (userData) => {
  try {
    const data = await apiCall("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return data;
  } catch (error) {
    console.error("Error saving user:", error);
    throw new Error("Failed to save user");
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const data = await apiCall(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const getUserById = async (userId) => {
  try {
    const data = await apiCall(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error("Error loading user:", error);
    return null;
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const data = await apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    return { success: true, user: data.user, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Wishlist management functions
export const getWishlist = async (userId) => {
  try {
    const data = await apiCall(`/wishlist/${userId}`);
    return data.items || [];
  } catch (error) {
    console.error("Error loading wishlist:", error);
    return [];
  }
};

export const addToWishlist = async (userId, productId) => {
  try {
    const data = await apiCall("/wishlist", {
      method: "POST",
      body: JSON.stringify({ userId, productId }),
    });
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const data = await apiCall(`/wishlist/${userId}/${productId}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
};

// ==========================================
// LOCALSTORAGE FALLBACK FUNCTIONS
// ==========================================

// Helper functions for localStorage operations
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const generateId = () => {
  // Generate a valid MongoDB ObjectId (24-character hex string)
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Math.random().toString(16).substr(2, 5);
  const counter = Math.floor(Math.random() * 16777216).toString(16);
  return (timestamp + random + counter).padEnd(24, "0").substr(0, 24);
};

// Fallback functions for products
const getProductsFallback = () => {
  return getFromStorage("products");
};

const saveProductFallback = (productData) => {
  const products = getFromStorage("products");
  if (productData.id) {
    // Update existing product
    const index = products.findIndex((p) => p.id === productData.id);
    if (index !== -1) {
      products[index] = { ...productData };
    }
  } else {
    // Add new product
    const newProduct = { ...productData, id: generateId() };
    products.push(newProduct);
  }
  saveToStorage("products", products);
  return productData.id ? productData : { ...productData, id: generateId() };
};

const deleteProductFallback = (productId) => {
  const products = getFromStorage("products");
  const filteredProducts = products.filter((p) => p.id !== productId);
  saveToStorage("products", filteredProducts);
  return true;
};

const getProductByIdFallback = (productId) => {
  const products = getFromStorage("products");
  // Search by both id and _id fields to handle different ID formats
  return (
    products.find((p) => p.id === productId || p._id === productId) || null
  );
};

// Fallback functions for orders
const getOrdersFallback = (userId = null) => {
  const orders = getFromStorage("orders");
  return userId ? orders.filter((o) => o.userId === userId) : orders;
};

const saveOrderFallback = (orderData) => {
  const orders = getFromStorage("orders");
  const newOrder = {
    ...orderData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: orderData.status || "pending",
    paymentMethod: orderData.paymentMethod || "cod",
    paymentStatus: orderData.paymentMethod === "cod" ? "pending" : "paid",
    // Ensure proper structure for cart items
    items: orderData.items.map((item) => ({
      ...item,
      product: item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.image,
    })),
    // Preserve customer info structure
    customerInfo: orderData.customerInfo
      ? {
          name: orderData.customerInfo.name,
          email: orderData.customerInfo.email,
          phone: orderData.customerInfo.phone,
        }
      : null,
    // Preserve shipping address structure
    shippingAddress: orderData.shippingAddress
      ? {
          address: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pincode: orderData.shippingAddress.pincode,
          country: orderData.shippingAddress.country,
        }
      : null,
    // Preserve order notes
    notes: orderData.notes || null,
  };
  orders.push(newOrder);
  saveToStorage("orders", orders);
  return newOrder;
};

const updateOrderFallback = (orderId, updateData) => {
  const orders = getFromStorage("orders");
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updateData };
    saveToStorage("orders", orders);
    return orders[index];
  }
  throw new Error("Order not found");
};

const getOrderByIdFallback = (orderId) => {
  const orders = getFromStorage("orders");
  return orders.find((o) => o.id === orderId) || null;
};

// Fallback functions for users
const getUsersFallback = () => {
  return getFromStorage("users");
};

const saveUserFallback = (userData) => {
  const users = getFromStorage("users");
  const newUser = {
    ...userData,
    id: generateId(),
    _id: generateId(), // Add _id for compatibility
    role: userData.role || "user", // Set default role
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveToStorage("users", users);
  return newUser;
};

const updateUserFallback = (userId, updateData) => {
  const users = getFromStorage("users");
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updateData };
    saveToStorage("users", users);
    return users[index];
  }
  throw new Error("User not found");
};

const getUserByIdFallback = (userId) => {
  const users = getFromStorage("users");
  return users.find((u) => u.id === userId) || null;
};

const loginUserFallback = (identifier, password) => {
  const users = getFromStorage("users");
  const user = users.find(
    (u) =>
      (u.email === identifier || u.username === identifier) &&
      u.password === password
  );
  if (user) {
    return { success: true, user, message: "Login successful" };
  }
  return { success: false, message: "Invalid credentials" };
};

// Fallback functions for wishlist
const getWishlistFallback = (userId) => {
  const wishlist = getFromStorage("wishlist");
  return wishlist.filter((item) => item.userId === userId);
};

const addToWishlistFallback = (userId, productId) => {
  const wishlist = getFromStorage("wishlist");
  const existingItem = wishlist.find(
    (item) => item.userId === userId && item.productId === productId
  );
  if (!existingItem) {
    wishlist.push({
      userId,
      productId,
      id: generateId(),
      addedAt: new Date().toISOString(),
    });
    saveToStorage("wishlist", wishlist);
  }
  return { success: true };
};

const removeFromWishlistFallback = (userId, productId) => {
  const wishlist = getFromStorage("wishlist");
  const filteredWishlist = wishlist.filter(
    (item) => !(item.userId === userId && item.productId === productId)
  );
  saveToStorage("wishlist", filteredWishlist);
  return { success: true };
};

// ==========================================
// WRAPPER FUNCTIONS WITH FALLBACK
// ==========================================

// Enhanced getProducts with fallback
export const getProductsEnhanced = async () => {
  try {
    const products = await getProducts();
    // Normalize IDs for consistency - ensure all products have an 'id' field
    return products.map((product) => ({
      ...product,
      id: product._id || product.id, // Use _id if available (MongoDB), otherwise use id
    }));
  } catch (error) {
    console.log("🔄 Using localStorage fallback for products");
    return getProductsFallback();
  }
};

// Enhanced saveProduct with fallback
export const saveProductEnhanced = async (productData) => {
  try {
    const result = await saveProduct(productData);
    // Normalize the returned product to ensure it has an id field
    return {
      ...result,
      id: result._id || result.id,
    };
  } catch (error) {
    console.log("🔄 Using localStorage fallback for saving product");
    return saveProductFallback(productData);
  }
};

// Enhanced deleteProduct with fallback
export const deleteProductEnhanced = async (productId) => {
  try {
    return await deleteProduct(productId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for deleting product");
    return deleteProductFallback(productId);
  }
};

// Enhanced getProductById with fallback
export const getProductByIdEnhanced = async (productId) => {
  try {
    const product = await getProductById(productId);
    // Normalize ID for consistency
    return product
      ? {
          ...product,
          id: product._id || product.id,
        }
      : null;
  } catch (error) {
    console.log("🔄 Using localStorage fallback for getting product");
    return getProductByIdFallback(productId);
  }
};

// Enhanced order functions with fallback
export const getOrdersEnhanced = async (userId = null) => {
  try {
    return await getOrders(userId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for orders");
    return getOrdersFallback(userId);
  }
};

export const saveOrderEnhanced = async (orderData) => {
  try {
    return await saveOrder(orderData);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for saving order");
    return saveOrderFallback(orderData);
  }
};

export const updateOrderEnhanced = async (orderId, updateData) => {
  try {
    return await updateOrder(orderId, updateData);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for updating order");
    return updateOrderFallback(orderId, updateData);
  }
};

export const getOrderByIdEnhanced = async (orderId) => {
  try {
    return await getOrderById(orderId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for getting order");
    return getOrderByIdFallback(orderId);
  }
};

// Enhanced user functions with fallback
export const getUsersEnhanced = async () => {
  try {
    return await getUsers();
  } catch (error) {
    console.log("🔄 Using localStorage fallback for users");
    return getUsersFallback();
  }
};

export const saveUserEnhanced = async (userData) => {
  try {
    return await saveUser(userData);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for saving user");
    return saveUserFallback(userData);
  }
};

export const updateUserEnhanced = async (userId, updateData) => {
  try {
    return await updateUser(userId, updateData);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for updating user");
    return updateUserFallback(userId, updateData);
  }
};

export const getUserByIdEnhanced = async (userId) => {
  try {
    return await getUserById(userId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for getting user");
    return getUserByIdFallback(userId);
  }
};

export const loginUserEnhanced = async (identifier, password) => {
  try {
    return await loginUser(identifier, password);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for login");
    return loginUserFallback(identifier, password);
  }
};

// Enhanced wishlist functions with fallback
export const getWishlistEnhanced = async (userId) => {
  try {
    return await getWishlist(userId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for wishlist");
    return getWishlistFallback(userId);
  }
};

export const addToWishlistEnhanced = async (userId, productId) => {
  try {
    return await addToWishlist(userId, productId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for adding to wishlist");
    return addToWishlistFallback(userId, productId);
  }
};

export const removeFromWishlistEnhanced = async (userId, productId) => {
  try {
    return await removeFromWishlist(userId, productId);
  } catch (error) {
    console.log("🔄 Using localStorage fallback for removing from wishlist");
    return removeFromWishlistFallback(userId, productId);
  }
};
