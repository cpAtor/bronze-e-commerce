'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export function FloatingCartButton() {
  const { itemCount, openCart } = useCart();

  if (itemCount === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 p-3.5 sm:p-4 rounded-full bg-amber-400 text-heritage-dark shadow-2xl hover:bg-amber-300 active:scale-95 transition-all duration-200 flex items-center justify-center min-w-[52px] min-h-[52px] border-2 border-heritage-dark"
      aria-label={`Open shopping cart with ${itemCount} items`}
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-heritage-dark text-heritage-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-amber-300">
          {itemCount}
        </span>
      </div>
    </button>
  );
}
