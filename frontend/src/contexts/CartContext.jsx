import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get("/cart/");
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/add/", {
      product_id: productId,
      quantity,
    });
    await fetchCart();
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${itemId}/`, { quantity });
    await fetchCart();
    return data;
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}/`);
    await fetchCart();
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, addItem, updateItem, removeItem, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
