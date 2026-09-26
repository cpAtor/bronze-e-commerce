'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPaiseToInr } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    subtotalPaise,
    totalPaise,
  } = useCart();

  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md bg-[#1f2019] text-[#f4efe6] border-l border-white/10 h-full z-10 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header matching Shopify Heritage: Cart (1) [X] */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 bg-[#1f2019]">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-normal text-[#f4efe6]">
              Cart
            </h2>
            {totalItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-[#f4efe6] text-xs flex items-center justify-center font-medium">
                {totalItemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1 text-[#f4efe6]/80 hover:text-[#f4efe6] transition-colors rounded-full hover:bg-white/10"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-heritage-muted">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-base font-normal text-[#f4efe6]">Your cart is empty</p>
              <button
                type="button"
                onClick={closeCart}
                className="button-primary text-xs mt-2"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 items-start">
                  {/* Square thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                        Bronze
                      </div>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[#f4efe6] hover:underline line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[#f4efe6]/60 mt-0.5">
                          {product.weight}
                        </p>
                        <p className="text-xs text-[#f4efe6]/80 mt-1">
                          {formatPaiseToInr(product.pricePaise)}
                        </p>
                      </div>

                      <div className="text-sm font-normal text-[#f4efe6] shrink-0 text-right">
                        {formatPaiseToInr(product.pricePaise * quantity)}
                      </div>
                    </div>

                    {/* Stepper + Trash icon */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-[#2c2d25] border border-white/10 rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#f4efe6]/80 hover:text-[#f4efe6]"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-[#f4efe6]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#f4efe6]/80 hover:text-[#f4efe6]"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-white/50 hover:text-white transition-colors"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary matching screenshot */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-4 bg-[#1f2019]">
            {/* Discount Accordion */}
            <div className="border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setDiscountOpen(!discountOpen)}
                className="w-full flex items-center justify-between text-xs text-[#f4efe6]/80 hover:text-[#f4efe6]"
              >
                <span>Discount</span>
                <span className="text-base font-light">{discountOpen ? '−' : '+'}</span>
              </button>
              {discountOpen && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 bg-white/5 border border-white/20 rounded-md px-3 py-1.5 text-xs text-[#f4efe6] uppercase placeholder:normal-case placeholder:text-white/40 focus:outline-none focus:border-white/60"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (discountCode.trim()) setDiscountApplied(true);
                    }}
                    className="button-secondary text-xs px-3 py-1.5"
                  >
                    Apply
                  </button>
                </div>
              )}
              {discountApplied && (
                <p className="text-[11px] text-emerald-400 mt-1">Code applied successfully</p>
              )}
            </div>

            {/* Estimated Total */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[#f4efe6]/90">Estimated total</span>
                <span className="text-lg font-medium text-[#f4efe6]">
                  {formatPaiseToInr(totalPaise)}
                </span>
              </div>
              <p className="text-xs text-[#f4efe6]/60">
                Taxes and shipping calculated at checkout.
              </p>
            </div>

            {/* Check out Full Width Pill Button */}
            <button
              type="button"
              onClick={openCheckout}
              className="w-full min-h-[48px] rounded-full bg-[#EDE4D0] hover:bg-[#F2EBD9] text-[#1a1b14] font-medium text-base flex items-center justify-center transition-all shadow-md active:scale-[0.98]"
            >
              Check out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
