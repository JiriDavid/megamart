import React, { createContext, useContext } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Derive authentication state from Clerk
  const isAuthenticated = isSignedIn && authLoaded;
  const currentUser = userLoaded ? user : null;
  const isAdmin = user?.publicMetadata?.role === "admin";

  const value = {
    isAuthenticated,
    currentUser,
    isAdmin,
    // Clerk handles login/logout/register through its components
    // These methods are kept for compatibility but may not be used
    register: () => ({
      success: false,
      message: "Use Clerk components for registration",
    }),
    login: () => ({
      success: false,
      message: "Use Clerk components for login",
    }),
    logout: () => ({
      success: false,
      message: "Use Clerk components for logout",
    }),
    updateProfile: () => ({
      success: false,
      message: "Use Clerk components for profile updates",
    }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
