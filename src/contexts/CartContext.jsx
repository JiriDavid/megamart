import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getWishlistEnhanced,
  addToWishlistEnhanced as apiAddToWishlist,
  removeFromWishlistEnhanced as apiRemoveFromWishlist,
} from "@/lib/storage";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadUserData();
    } else {
      // Clear data for non-authenticated users
      setCart([]);
      setWishlist([]);
    }
  }, [isAuthenticated, currentUser]);

  const getUserStorageKey = (type) => {
    return currentUser
      ? `megamart_${type}_${currentUser._id || currentUser.id}`
      : `megamart_${type}_guest`;
  };

  const loadUserData = async () => {
    try {
      const cartKey = getUserStorageKey("cart");
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }

      // Load wishlist from API
      if (currentUser && (currentUser._id || currentUser.id)) {
        setWishlistLoading(true);
        const userId = currentUser._id || currentUser.id;
        const wishlistData = await getWishlistEnhanced(userId);
        setWishlist(wishlistData);
        setWishlistLoading(false);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
      setCart([]);
      setWishlist([]);
      setWishlistLoading(false);
    }
  };

  const saveUserData = (type, data) => {
    if (isAuthenticated && currentUser) {
      try {
        const key = getUserStorageKey(type);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to save ${type} to localStorage`, error);
      }
    }
  };

  useEffect(() => {
    saveUserData("cart", cart);
  }, [cart, currentUser]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item._id === product._id && item.size === size && item.color === color
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, size, color }];
    });
  };

  const removeFromCart = (productId, size = null, color = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item._id === productId &&
            (size === null || item.size === size) &&
            (color === null || item.color === color)
          )
      )
    );
  };

  const updateCartQuantity = (
    productId,
    quantity,
    size = null,
    color = null
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId &&
        (size === null || item.size === size) &&
        (color === null || item.color === color)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated || !currentUser) {
      return { success: false, message: "Please login to add to wishlist" };
    }

    try {
      setWishlistLoading(true);
      const userId = currentUser._id || currentUser.id;
      await apiAddToWishlist(userId, product._id);
      setWishlist((prevWishlist) => {
        if (prevWishlist.find((item) => item.product._id === product._id)) {
          return prevWishlist; // Already in wishlist
        }
        return [...prevWishlist, { product, addedAt: new Date() }];
      });
      setWishlistLoading(false);
      return { success: true, message: "Added to wishlist" };
    } catch (error) {
      setWishlistLoading(false);
      return { success: false, message: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated || !currentUser) {
      return { success: false, message: "Please login to manage wishlist" };
    }

    try {
      setWishlistLoading(true);
      const userId = currentUser._id || currentUser.id;
      await apiRemoveFromWishlist(userId, productId);
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.product._id !== productId)
      );
      setWishlistLoading(false);
      return { success: true, message: "Removed from wishlist" };
    } catch (error) {
      setWishlistLoading(false);
      return { success: false, message: error.message };
    }
  };

  const moveFromWishlistToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  const value = {
    cart,
    wishlist,
    wishlistLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveFromWishlistToCart,
    cartCount: cart.reduce((count, item) => count + item.quantity, 0),
    wishlistCount: wishlist.length,
    cartTotal: cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
