'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPaiseToInr } from '@/lib/utils';
import type { CreateOrderInput } from '@/domain/types';

export function CheckoutModal() {
  const router = useRouter();
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    openCart,
    subtotalPaise,
    shippingPaise,
    totalPaise,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-fill saved address from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('heritage_saved_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.addressLine1) setAddressLine1(parsed.addressLine1);
        if (parsed.addressLine2) setAddressLine2(parsed.addressLine2);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.postalCode) setPostalCode(parsed.postalCode);
        setHasSavedAddress(true);
      }
    } catch {}
  }, []);

  const handleClearSavedAddress = () => {
    try {
      localStorage.removeItem('heritage_saved_address');
    } catch {}
    setFullName('');
    setEmail('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('Tamil Nadu');
    setPostalCode('');
    setHasSavedAddress(false);
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen && !isSubmitting) {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, isSubmitting, closeCheckout]);

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!postalCode.trim()) {
      newErrors.postalCode = 'PIN / Postal code is required';
    } else if (!/^\d{6}$/.test(postalCode.trim())) {
      newErrors.postalCode = 'Enter a valid 6-digit Indian PIN code';
    }
    if (items.length === 0) {
      newErrors.items = 'Your cart is empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const orderInput: CreateOrderInput = {
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim() || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: 'India',
          phone: phone.trim() || undefined,
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderInput),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      // Auto-save address for future orders
      try {
        const addressToSave = {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        };
        localStorage.setItem('heritage_saved_address', JSON.stringify(addressToSave));
      } catch {}

      // Cache placed order in localStorage for instant retrieval
      try {
        localStorage.setItem(`heritage_order_${data.order.orderCode}`, JSON.stringify(data.order));
        const existing = JSON.parse(localStorage.getItem('heritage_user_orders') || '[]');
        const filtered = Array.isArray(existing)
          ? existing.filter((o: { orderCode?: string }) => o?.orderCode !== data.order.orderCode)
          : [];
        localStorage.setItem('heritage_user_orders', JSON.stringify([data.order, ...filtered]));
      } catch {}

      clearCart();
      closeCheckout();
      router.push(`/orders/${data.order.orderCode}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && closeCheckout()}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl bg-heritage-dark border border-heritage-border rounded-xl shadow-2xl z-10 max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-heritage-border flex items-center justify-between bg-heritage-darker shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
              Heirloom Dispatch
            </span>
            <h2 id="checkout-modal-title" className="font-heading text-xl sm:text-2xl font-medium text-heritage-cream">
              Secure Checkout
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            disabled={isSubmitting}
            className="tap-target p-2 text-heritage-cream/70 hover:text-heritage-cream transition-colors rounded-full hover:bg-heritage-surface"
            aria-label="Close checkout"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {submitError && (
            <div className="p-4 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heritage-cream tracking-wide uppercase text-amber-100/90 border-b border-heritage-border pb-1">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-fullName" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Recipient Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Gurukkal"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
                {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="checkout-email" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Email Address (for order tracking) <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="checkout-phone" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Phone Number (for courier delivery & WhatsApp dispatch updates)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Shipping Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-border pb-1">
              <h3 className="text-sm font-semibold text-heritage-cream tracking-wide uppercase text-amber-100/90">
                2. Shipping Address (India)
              </h3>
              {hasSavedAddress && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-medium">✓ Saved address applied</span>
                  <button
                    type="button"
                    onClick={handleClearSavedAddress}
                    className="text-heritage-muted hover:text-red-400 underline text-[11px]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-addressLine1" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Street Address / House / Flat <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-addressLine1"
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Door No. 12, Sannadhi Street"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
                {errors.addressLine1 && <p className="text-[11px] text-red-400 mt-1">{errors.addressLine1}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="checkout-addressLine2" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Apartment, Suite, Landmark (Optional)
                </label>
                <input
                  id="checkout-addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Near East Gopuram"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label htmlFor="checkout-city" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  City / Town <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Thanjavur"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
                {errors.city && <p className="text-[11px] text-red-400 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="checkout-state" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  State <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-state"
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
                />
                {errors.state && <p className="text-[11px] text-red-400 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="checkout-postalCode" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  PIN Code (6 digits) <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-postalCode"
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="613001"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-surface border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400 font-mono"
                />
                {errors.postalCode && <p className="text-[11px] text-red-400 mt-1">{errors.postalCode}</p>}
              </div>

              <div>
                <label htmlFor="checkout-country" className="block text-xs font-medium text-heritage-cream/90 mb-1">
                  Country
                </label>
                <input
                  id="checkout-country"
                  type="text"
                  disabled
                  value="India"
                  className="w-full min-h-tap px-3 py-2 bg-heritage-darker border border-heritage-border rounded-lg text-sm text-heritage-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section: Payment Method Simulation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-heritage-cream tracking-wide uppercase text-amber-100/90 border-b border-heritage-border pb-1">
              3. Payment Method (Simulated / Foundational)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors min-h-tap ${
                  paymentMethod === 'upi'
                    ? 'border-amber-400/80 bg-heritage-surface'
                    : 'border-heritage-border bg-heritage-darker hover:border-heritage-cream/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5 accent-amber-400"
                />
                <div>
                  <div className="text-xs font-medium text-heritage-cream flex items-center gap-1.5">
                    <span>UPI / QR upon Dispatch</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-heritage-muted mt-0.5">
                    Pay securely via GPay/PhonePe when tracking reference is generated.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors min-h-tap ${
                  paymentMethod === 'cod'
                    ? 'border-amber-400/80 bg-heritage-surface'
                    : 'border-heritage-border bg-heritage-darker hover:border-heritage-cream/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 accent-amber-400"
                />
                <div>
                  <div className="text-xs font-medium text-heritage-cream">Cash on Delivery (COD)</div>
                  <p className="text-[11px] text-heritage-muted mt-0.5">
                    Inspect sacred craft package upon courier delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Order Summary Review */}
          <div className="p-4 bg-heritage-darker rounded-lg border border-heritage-border space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-heritage-cream">
              <span>Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <button
                type="button"
                onClick={() => {
                  closeCheckout();
                  openCart();
                }}
                className="text-amber-300 hover:underline text-[11px]"
              >
                Edit Cart
              </button>
            </div>

            <ul className="text-xs space-y-1.5 max-h-32 overflow-y-auto divide-y divide-heritage-border-light">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="pt-1.5 first:pt-0 flex justify-between text-heritage-muted">
                  <span className="line-clamp-1 pr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="text-heritage-cream shrink-0 font-medium">
                    {formatPaiseToInr(product.pricePaise * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-heritage-border-light space-y-1 text-xs">
              <div className="flex justify-between text-heritage-muted">
                <span>Subtotal</span>
                <span className="text-heritage-cream font-medium">{formatPaiseToInr(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-heritage-muted">
                <span>Courier Shipping</span>
                {shippingPaise === 0 ? (
                  <span className="text-emerald-400 font-semibold">FREE</span>
                ) : (
                  <span className="text-heritage-cream font-medium">{formatPaiseToInr(shippingPaise)}</span>
                )}
              </div>
              <div className="pt-2 border-t border-heritage-border flex justify-between text-sm font-semibold text-heritage-cream">
                <span>Grand Total</span>
                <span>{formatPaiseToInr(totalPaise)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="button-primary w-full text-sm font-semibold py-3.5 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Placing Order & Generating ORD Code...</span>
                </>
              ) : (
                <span>Confirm Order • {formatPaiseToInr(totalPaise)}</span>
              )}
            </button>

            <button
              type="button"
              onClick={closeCheckout}
              disabled={isSubmitting}
              className="button-secondary w-full text-xs"
            >
              Return to Catalog
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-heritage-muted text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Generates an official ORD-XXXX reference code with instant status tracking</span>
          </div>
        </form>
      </div>
    </div>
  );
}
