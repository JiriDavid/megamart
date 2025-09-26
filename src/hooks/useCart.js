import React, { createContext, useContext } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      loading: false,

      addItem: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },

      removeItem: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

      updateItemQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      setLoading: (isLoading) => set({ loading: isLoading }),

      cartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "megamart-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const store = useCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const store = useContext(CartContext);
  if (!store) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // We need to use a selector to ensure components re-render on state changes.
  // This approach connects React's context with Zustand's store.
  const state = useCartStore();

  return state;
};

export default useCart;
