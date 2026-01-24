import { useState, useEffect, type ReactNode } from "react";
import { ShoppingCartContext } from "./hook";

export interface CartItem {
  _id: string;
  image: string;
  title: string;
  instructorName: string;
  instructorId: string;
  level: string;
  pricing: string;
}

export interface ShoppingCartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load from LocalStorage on initial render
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pathos-cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sync to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("pathos-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Prevent duplicates
      if (prev.find((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + Number(item.pricing),
    0,
  );

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
