import React, { createContext, useState, useContext, useEffect } from "react";
import {
  loginUserEnhanced,
  saveUserEnhanced,
  updateUserEnhanced,
} from "../lib/storage";

const AuthContext = createContext(null);

const CURRENT_USER_KEY = "megamart_current_user";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Validate user ID format
        const userId = user?.id || user?._id;
        if (userId && /^[0-9a-fA-F]{24}$/.test(userId)) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setIsAdmin(user.role === "admin");
        } else {
          // Invalid user ID, clear the session
          console.warn("Invalid user ID in localStorage, clearing session");
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const register = async (userData) => {
    try {
      const newUser = await saveUserEnhanced(userData);

      // Auto login after registration
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(newUser.role === "admin");

      return { success: true, message: "Registration successful" };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  const login = async (identifier, password) => {
    try {
      const result = await loginUserEnhanced(identifier, password);

      if (result.success) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setIsAdmin(result.user.role === "admin");
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (userData) => {
    try {
      if (!currentUser) return { success: false, message: "No user logged in" };

      const userId = currentUser._id || currentUser.id;
      const updatedUser = await updateUserEnhanced(userId, userData);

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Profile update failed",
      };
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
