import { createContext, useContext } from "react";
import type { ShoppingCartContextType } from ".";

export const ShoppingCartContext = createContext<ShoppingCartContextType | null>(null);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider",
    );
  }
  return context;
};
