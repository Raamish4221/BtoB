"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getProductById, products } from "@/app/data/products";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShopContextValue {
  cartItems: CartItem[];
  favoriteIds: string[];
  cartCount: number;
  favoriteCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  buyNow: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

const SHOP_STORAGE_KEY = "b2b-shop-state-v1";

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const cached = window.localStorage.getItem(SHOP_STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as { cartItems?: CartItem[]; favoriteIds?: string[] };
      if (Array.isArray(parsed.cartItems)) setCartItems(parsed.cartItems);
      if (Array.isArray(parsed.favoriteIds)) setFavoriteIds(parsed.favoriteIds);
    } catch {
      // Ignore invalid local data.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify({ cartItems, favoriteIds }));
  }, [cartItems, favoriteIds]);

  const addToCart = (productId: string, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  const buyNow = (productId: string) => {
    setCartItems((prev) => {
      const rest = prev.filter((item) => item.productId !== productId);
      return [...rest, { productId, quantity: 1 }];
    });
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const favoriteCount = favoriteIds.length;

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = getProductById(item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cartItems,
      favoriteIds,
      cartCount,
      favoriteCount,
      cartTotal,
      addToCart,
      buyNow,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      isFavorite,
      toggleFavorite,
    }),
    [cartCount, cartItems, cartTotal, favoriteCount, favoriteIds]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}

export function getFavoriteProducts(favoriteIds: string[]) {
  return products.filter((product) => favoriteIds.includes(product.id));
}
