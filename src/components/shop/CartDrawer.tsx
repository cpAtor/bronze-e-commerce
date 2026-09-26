'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
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
    itemCount,
    totalPaise,
  } = useCart();

  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Trap focus inside drawer when open
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

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Cart"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md bg-heritage-dark text-heritage-cream border-l border-heritage-border h-full z-10 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header matching Shopify Heritage: Cart (1) [X] */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-heritage-border-light bg-heritage-dark">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-normal text-heritage-cream">
              Cart
            </h2>
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-heritage-surface text-heritage-cream text-xs flex items-center justify-center font-medium border border-heritage-border">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1 text-heritage-muted hover:text-heritage-cream transition-colors rounded-full hover:bg-heritage-surface"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-heritage-surface flex items-center justify-center mx-auto text-heritage-muted border border-heritage-border">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-base font-normal text-heritage-cream">Your cart is empty</p>
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
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-heritage-surface shrink-0 border border-heritage-border">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-heritage-subtle">
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
                          className="text-sm font-medium text-heritage-cream hover:underline line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-heritage-subtle mt-0.5">
                          {product.weight}
                        </p>
                        <p className="text-xs text-heritage-muted mt-1">
                          {formatPaiseToInr(product.pricePaise)}
                        </p>
                      </div>

                      <div className="text-sm font-normal text-heritage-cream shrink-0 text-right">
                        {formatPaiseToInr(product.pricePaise * quantity)}
                      </div>
                    </div>

                    {/* Stepper + Trash icon */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-heritage-surface border border-heritage-border rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-heritage-muted hover:text-heritage-cream"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-heritage-cream">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-heritage-muted hover:text-heritage-cream"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-heritage-subtle hover:text-heritage-cream transition-colors"
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
          <div className="px-6 py-5 border-t border-heritage-border-light space-y-4 bg-heritage-dark">
            {/* Discount Accordion */}
            <div className="border-b border-heritage-border-light pb-3">
              <button
                type="button"
                onClick={() => setDiscountOpen(!discountOpen)}
                className="w-full flex items-center justify-between text-xs text-heritage-muted hover:text-heritage-cream"
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
                    className="flex-1 bg-heritage-surface border border-heritage-border rounded-md px-3 py-1.5 text-xs text-heritage-cream uppercase placeholder:normal-case placeholder:text-heritage-subtle focus:outline-none focus:border-heritage-cream"
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
                <span className="text-sm text-heritage-muted">Estimated total</span>
                <span className="text-lg font-medium text-heritage-cream">
                  {formatPaiseToInr(totalPaise)}
                </span>
              </div>
              <p className="text-xs text-heritage-subtle">
                Taxes and shipping calculated at checkout.
              </p>
            </div>

            {/* Check out Full Width Pill Button */}
            <button
              type="button"
              onClick={openCheckout}
              className="button-primary w-full text-base font-medium py-3.5"
            >
              Check out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
