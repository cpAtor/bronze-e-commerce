'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ADMIN_CONFIG } from '@/lib/config';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderCode.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter your order reference code');
      return;
    }
    if (!trimmed.startsWith('ORD-')) {
      setError('Order codes must start with ORD- (e.g. ORD-1001)');
      return;
    }
    setError(null);
    router.push(`/orders/${trimmed}`);
  };

  return (
    <main className="min-h-screen bg-heritage-dark text-heritage-cream py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-heritage-surface border border-heritage-border text-xs uppercase tracking-[0.2em] text-amber-200">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch & Courier Tracking</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-medium tracking-display text-heritage-cream">
            Track Your Order
          </h1>

          <p className="text-xs sm:text-sm text-heritage-muted max-w-md mx-auto leading-relaxed">
            Enter your 8-character reference code (e.g. <span className="font-mono text-amber-300 font-semibold">ORD-1001</span>) provided upon checkout to check real-time casting inspection and courier dispatch status.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-heritage-surface/70 border border-heritage-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label htmlFor="track-order-code" className="block text-xs font-medium text-heritage-cream mb-1.5 uppercase tracking-wider">
                Order Reference Code
              </label>
              <div className="relative">
                <input
                  id="track-order-code"
                  type="text"
                  required
                  value={orderCode}
                  onChange={(e) => {
                    setOrderCode(e.target.value.toUpperCase());
                    if (error) setError(null);
                  }}
                  placeholder="ORD-1001"
                  className="w-full min-h-tap px-4 py-3.5 bg-heritage-dark border border-heritage-border rounded-xl text-base sm:text-lg font-mono font-bold tracking-widest text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400 uppercase"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-heritage-cream text-heritage-dark hover:bg-heritage-cream-hover rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors min-h-tap"
                  aria-label="Track order"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Track</span>
                </button>
              </div>
              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            </div>
          </form>

          <div className="pt-4 border-t border-heritage-border-light flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-heritage-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Insured express courier delivery across India</span>
            </span>

            <Link href="/shop" className="text-amber-300 hover:underline flex items-center gap-1">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Assistance Box */}
        <div className="bg-heritage-darker p-5 rounded-xl border border-heritage-border-light flex items-start gap-3 text-xs text-heritage-muted">
          <HelpCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p leading-relaxed>
            Cannot locate your reference code? Check the confirmation receipt sent to your email, or message our artisans directly on WhatsApp at{' '}
            <a
              href={`https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}`}
              className="text-amber-300 font-semibold underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ADMIN_CONFIG.phone}
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
