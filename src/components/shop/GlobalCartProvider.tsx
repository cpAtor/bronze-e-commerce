'use client';

import React from 'react';
import { CartProvider } from './CartContext';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';

export function GlobalCartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  );
}
