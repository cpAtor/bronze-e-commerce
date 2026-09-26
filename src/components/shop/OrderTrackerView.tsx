'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Order } from '@/domain/types';
import { ADMIN_CONFIG } from '@/lib/config';
import { formatPaiseToInr } from '@/lib/utils';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';

interface OrderTrackerViewProps {
  initialOrder: Order | null;
  code: string;
}

export function OrderTrackerView({ initialOrder, code }: OrderTrackerViewProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [isCheckingLocal, setIsCheckingLocal] = useState(!initialOrder);

  const normalizedCode = code.trim().toUpperCase();

  // If initialOrder is null (e.g. serverless cold start on different lambda), recover from client localStorage
  useEffect(() => {
    if (!initialOrder) {
      try {
        const cached = localStorage.getItem(`heritage_order_${normalizedCode}`);
        if (cached) {
          const parsed = JSON.parse(cached) as Order;
          setOrder(parsed);
          // Sync back to server in background
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ syncOrder: parsed }),
          }).catch(() => {});
        } else {
          // Check in user orders array
          const list = localStorage.getItem('heritage_user_orders');
          if (list) {
            const orders = JSON.parse(list) as Order[];
            const found = orders.find(
              (o) => o.orderCode?.toUpperCase() === normalizedCode
            );
            if (found) {
              setOrder(found);
              fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ syncOrder: found }),
              }).catch(() => {});
            }
          }
        }
      } catch {
        // Storage read failed
      } finally {
        setIsCheckingLocal(false);
      }
    }
  }, [initialOrder, normalizedCode]);

  if (isCheckingLocal) {
    return (
      <main className="min-h-screen bg-heritage-dark text-heritage-cream py-16 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-heritage-muted">Retrieving order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-heritage-dark text-heritage-cream py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-heritage-surface/80 border border-heritage-border rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-medium text-heritage-cream">
              Order Not Found
            </h1>
            <p className="text-xs sm:text-sm text-heritage-muted leading-relaxed">
              We couldn't locate an order with reference code{' '}
              <code className="text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded bg-heritage-dark">
                {normalizedCode}
              </code>
              . Please check the code or contact our artisans.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/orders" className="button-primary text-xs w-full py-3">
              Look Up Another Order
            </Link>
            <Link href="/shop" className="button-secondary text-xs w-full py-3">
              Return to Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Pre-filled off-platform communication URLs
  const encodedWhatsappMessage = encodeURIComponent(
    `Namaste Sthapati, I am contacting you regarding my Heritage order ${order.orderCode} (${order.status}). Could you please update me on dispatch?`
  );
  const whatsappUrl = `https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodedWhatsappMessage}`;

  const emailSubject = encodeURIComponent(`Order Inquiry: ${order.orderCode}`);
  const emailBody = encodeURIComponent(
    `Hello Sthapati,\n\nI have a question regarding my order ${order.orderCode} placed with delivery address in ${order.shippingAddress.city}, ${order.shippingAddress.state}.\n\nThank you,\n${order.shippingAddress.fullName}`
  );
  const emailUrl = `mailto:${ADMIN_CONFIG.email}?subject=${emailSubject}&body=${emailBody}`;

  const phoneUrl = `tel:${ADMIN_CONFIG.phone}`;

  const isShipped = order.status === 'Shipped';
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-heritage-dark text-heritage-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Confirmation Header Banner */}
        <div className="bg-gradient-to-r from-heritage-surface via-heritage-darker to-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold">
              Sacred Bronze Foundational Order
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-medium text-heritage-cream">
              Order Confirmed & Logged
            </h1>
            <p className="text-xs sm:text-sm text-heritage-muted max-w-lg mx-auto">
              Your heirloom piece is being prepped at the artisanal foundry. Please save your reference code for all communications.
            </p>
          </div>

          {/* Reference Code Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-heritage-dark border border-amber-400/50 shadow-lg">
            <span className="text-xs uppercase text-heritage-muted tracking-wider">Reference Code:</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-amber-300 tracking-wider">
              {order.orderCode}
            </span>
          </div>
        </div>

        {/* Status Tracker Card */}
        <div className="bg-heritage-surface/60 border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-heritage-border-light pb-4">
            <div>
              <span className="text-xs text-heritage-muted block">Current Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-wider mt-1 ${
                  isShipped
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{order.status}</span>
              </span>
            </div>

            <div className="text-left sm:text-right text-xs text-heritage-muted">
              <span>Placed On</span>
              <span className="block text-heritage-cream font-medium mt-0.5">{orderDate}</span>
            </div>
          </div>

          {/* Stepper Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-heritage-dark border border-amber-400/40 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Order Received</span>
              </div>
              <p className="text-[11px] text-heritage-muted">
                Order details logged and queued for casting inspection.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl bg-heritage-dark border space-y-1 ${
                isShipped ? 'border-amber-400/40 text-amber-300' : 'border-heritage-border text-heritage-muted'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Foundry Inspection</span>
              </div>
              <p className="text-[11px] text-heritage-muted">
                Vessel polish, sacred alloy inspection, and secure packaging.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl bg-heritage-dark border space-y-1 ${
                isShipped
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                  : 'border-heritage-border text-heritage-muted'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Truck className="w-4 h-4" />
                <span>3. Insured Dispatch</span>
              </div>
              <p className="text-[11px] text-heritage-muted">
                {isShipped ? (
                  order.courierTrackingUrl ? (
                    <a
                      href={order.courierTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 underline font-medium flex items-center gap-1 mt-1"
                    >
                      <span>Track Shipment</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    'Dispatched via express registered courier.'
                  )
                ) : (
                  'Courier tracking link will appear here once dispatched.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Contact Admin Actions */}
        <div className="bg-heritage-surface/60 border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-medium text-heritage-cream">
              Questions Regarding This Order?
            </h2>
            <p className="text-xs text-heritage-muted">
              Connect directly with our master artisans in Kumbakonam through pre-filled 1-click links:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-tap flex items-center justify-center gap-2 px-4 py-3 rounded-pill bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg active:scale-95"
              aria-label="WhatsApp our foundry about this order"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Foundry</span>
            </a>

            <a
              href={emailUrl}
              className="min-h-tap flex items-center justify-center gap-2 px-4 py-3 rounded-pill bg-heritage-surface hover:bg-heritage-moss border border-heritage-border text-heritage-cream text-xs font-semibold transition-colors shadow-lg active:scale-95"
              aria-label="Email our foundry about this order"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>

            <a
              href={phoneUrl}
              className="min-h-tap flex items-center justify-center gap-2 px-4 py-3 rounded-pill bg-heritage-surface hover:bg-heritage-moss border border-heritage-border text-heritage-cream text-xs font-semibold transition-colors shadow-lg active:scale-95"
              aria-label="Call our foundry about this order"
            >
              <Phone className="w-4 h-4" />
              <span>Call Sthapati</span>
            </a>
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items Purchased */}
          <div className="bg-heritage-surface/60 border border-heritage-border rounded-2xl p-6 space-y-4">
            <h3 className="font-heading text-base font-medium text-heritage-cream flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Items in Order</span>
            </h3>

            <ul className="divide-y divide-heritage-border-light text-xs space-y-3">
              {order.items.map((item, idx) => (
                <li key={idx} className="pt-3 first:pt-0 flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="font-medium text-heritage-cream text-sm block">
                      {item.productName}
                    </span>
                    <span className="text-heritage-muted">
                      Quantity: {item.quantity} × {formatPaiseToInr(item.unitPricePaise)}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-heritage-cream shrink-0 text-sm">
                    {formatPaiseToInr(item.quantity * item.unitPricePaise)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-heritage-border space-y-2 text-xs">
              <div className="flex justify-between text-heritage-muted">
                <span>Subtotal</span>
                <span className="text-heritage-cream font-medium">
                  {formatPaiseToInr(order.totalPaise - order.shippingCostPaise)}
                </span>
              </div>
              <div className="flex justify-between text-heritage-muted">
                <span>Courier Delivery</span>
                {order.shippingCostPaise === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase">FREE</span>
                ) : (
                  <span className="text-heritage-cream font-medium">
                    {formatPaiseToInr(order.shippingCostPaise)}
                  </span>
                )}
              </div>
              <div className="pt-2 border-t border-heritage-border flex justify-between text-base font-semibold text-heritage-cream font-mono">
                <span>Grand Total</span>
                <span>{formatPaiseToInr(order.totalPaise)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Address */}
          <div className="bg-heritage-surface/60 border border-heritage-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-heading text-base font-medium text-heritage-cream flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300" />
                <span>Shipping Destination</span>
              </h3>

              <div className="bg-heritage-dark p-4 rounded-xl border border-heritage-border-light text-xs text-heritage-cream/90 space-y-1 leading-relaxed">
                <p className="font-semibold text-sm text-heritage-cream">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  <span className="font-mono font-medium">{order.shippingAddress.postalCode}</span>
                </p>
                <p className="text-heritage-muted pt-1">
                  Country: {order.shippingAddress.country || 'India'}
                </p>
                {order.shippingAddress.phone && (
                  <p className="text-heritage-muted">Contact: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-heritage-border-light flex flex-col gap-2">
              <Link
                href="/shop"
                className="button-primary text-xs w-full flex items-center justify-center gap-2"
              >
                <span>Continue Browsing Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
