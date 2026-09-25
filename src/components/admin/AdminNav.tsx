'use client';

import Link from 'next/link';
import { ExternalLink, ShieldCheck, PlusCircle } from 'lucide-react';

interface AdminNavProps {
  currentTab?: 'products' | 'portfolio' | 'orders' | 'inquiries';
}

export function AdminNav({ currentTab }: AdminNavProps) {
  return (
    <header className="bg-heritage-surface border-b border-heritage-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Title & Status Indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 group text-heritage-cream"
              aria-label="Admin Dashboard"
            >
              <div className="w-9 h-9 rounded-full bg-heritage-cream/10 border border-heritage-border flex items-center justify-center text-heritage-cream group-hover:bg-heritage-cream group-hover:text-heritage-dark transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-base sm:text-lg tracking-tight">
                  Admin Portal
                </span>
                <span className="text-[11px] text-heritage-muted hidden sm:inline">
                  Bronze Craft & Temple Commissions
                </span>
              </div>
            </Link>

            {/* Live Seam Status Badge */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live StoreRepository Seam</span>
            </div>
          </div>

          {/* Right Actions & Storefront Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Create Buttons depending on view */}
            <Link
              href="/admin/products/new"
              className="tap-target inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-full bg-heritage-cream text-heritage-dark px-3.5 sm:px-4 py-2 hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">Add</span> Product
            </Link>

            <Link
              href="/admin/portfolio/new"
              className="tap-target inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-full border border-heritage-border bg-heritage-dark/40 text-heritage-cream px-3.5 sm:px-4 py-2 hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">Add</span> Portfolio
            </Link>

            {/* External Storefront Link */}
            <Link
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target p-2 text-heritage-muted hover:text-heritage-cream transition-colors rounded-full"
              title="Open customer storefront in new tab"
              aria-label="View live storefront"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
