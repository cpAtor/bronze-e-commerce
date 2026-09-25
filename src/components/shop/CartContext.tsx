'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PredefinedProduct } from '@/domain/types';
import { calculateShippingPaise } from '@/lib/utils';

export interface CartItem {
  product: PredefinedProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (product: PredefinedProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  freeShippingThresholdPaise: number;
  freeShippingRemainingPaise: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bronze_cart_v1';
const FREE_SHIPPING_THRESHOLD_PAISE = 250000; // ₹2,500

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  }, [items, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const openCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (product: PredefinedProduct, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = items.reduce(
    (sum, item) => sum + item.product.pricePaise * item.quantity,
    0
  );
  const shippingPaise = calculateShippingPaise(subtotalPaise);
  const totalPaise = subtotalPaise + shippingPaise;
  const freeShippingRemainingPaise = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isCheckoutOpen,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotalPaise,
        shippingPaise,
        totalPaise,
        freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
        freeShippingRemainingPaise,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
