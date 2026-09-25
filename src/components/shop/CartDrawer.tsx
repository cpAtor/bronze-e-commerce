'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
    shippingPaise,
    totalPaise,
    freeShippingThresholdPaise,
    freeShippingRemainingPaise,
  } = useCart();

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

  const progressPercent = Math.min(
    100,
    Math.round((subtotalPaise / freeShippingThresholdPaise) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md bg-heritage-dark border-l border-heritage-border h-full z-10 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-heritage-border flex items-center justify-between bg-heritage-darker">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-heritage-cream" />
            <h2 className="font-heading text-lg font-medium tracking-wide text-heritage-cream">
              Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="tap-target p-2 text-heritage-cream/70 hover:text-heritage-cream transition-colors rounded-full hover:bg-heritage-surface"
            aria-label="Close cart drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 sm:px-6 py-3 bg-heritage-surface/60 border-b border-heritage-border text-xs">
          {freeShippingRemainingPaise > 0 ? (
            <div>
              <p className="text-heritage-cream/90 flex items-center gap-1.5 mb-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                Add <span className="font-semibold text-heritage-cream">{formatPaiseToInr(freeShippingRemainingPaise)}</span> more for <span className="text-amber-200">FREE delivery</span> across India
              </p>
              <div className="w-full bg-heritage-dark h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              You unlocked <span className="font-bold underline underline-offset-2">FREE insured courier shipping</span>!
            </p>
          )}
        </div>

        {/* Item List / Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-heritage-surface flex items-center justify-center mx-auto text-heritage-muted">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-heritage-cream font-medium text-base">Your cart is empty</p>
              <p className="text-sm text-heritage-muted max-w-xs mx-auto">
                Explore our curated collection of authentic temple bronzes and heirloom wares.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="button-primary text-xs mt-2"
              >
                Browse Wares
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-heritage-border-light space-y-3">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="pt-3 first:pt-0 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-heritage-surface rounded-md overflow-hidden shrink-0 border border-heritage-border-light">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
                        Bronze
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${product.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-heritage-cream hover:text-amber-200 line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-heritage-muted mt-0.5">
                      {product.weight} • {product.dimensions}
                    </p>
                    <p className="text-xs font-semibold text-heritage-cream mt-1">
                      {formatPaiseToInr(product.pricePaise)}
                    </p>

                    {/* Quantity Controls (min 44px tap target) */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-heritage-border rounded-pill bg-heritage-darker overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream/80 hover:text-heritage-cream hover:bg-heritage-surface transition-colors"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-heritage-cream" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream/80 hover:text-heritage-cream hover:bg-heritage-surface transition-colors"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="min-h-tap min-w-tap flex items-center justify-center text-heritage-muted hover:text-red-400 transition-colors p-2"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-heritage-border bg-heritage-darker space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-heritage-muted">
                <span>Subtotal</span>
                <span className="text-heritage-cream font-medium">{formatPaiseToInr(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-heritage-muted">
                <span>Shipping (Insured India Delivery)</span>
                {shippingPaise === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider">FREE</span>
                ) : (
                  <span className="text-heritage-cream font-medium">{formatPaiseToInr(shippingPaise)}</span>
                )}
              </div>
              <div className="pt-2 border-t border-heritage-border-light flex justify-between text-sm font-semibold text-heritage-cream">
                <span>Total</span>
                <span>{formatPaiseToInr(totalPaise)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={openCheckout}
                className="button-primary w-full text-sm font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="button-secondary w-full text-xs"
              >
                Continue Shopping
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-heritage-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct foundry dispatch • Panchaloha purity certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
