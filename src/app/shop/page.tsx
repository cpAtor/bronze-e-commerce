import React from 'react';
import Link from 'next/link';
import { ProductCatalogService } from '@/services/product-catalog.service';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Sparkles, Truck, ShieldCheck, Hammer } from 'lucide-react';

export const revalidate = 0; // Dynamic server-rendered to reflect repository updates instantly

export default async function ShopPage() {
  const service = new ProductCatalogService();
  const products = await service.browseProducts();

  return (
    <main className="bg-heritage-dark text-heritage-cream min-h-screen pb-24">
      {/* Editorial Header Section */}
      <section className="border-b border-heritage-border bg-gradient-to-b from-heritage-darker via-heritage-dark to-heritage-surface/40 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-heritage-surface border border-heritage-border text-xs uppercase tracking-[0.2em] text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Foundry Direct Wares</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-display text-heritage-cream">
              Artisanal Bronze Wares
            </h1>
            <p className="text-sm sm:text-base text-heritage-muted leading-relaxed">
              Curated everyday heirloom wares and sacred devotional vessels forged from authentic Panchaloha and high-tin bell metal (Kansa). Cast in Kumbakonam using ancient lost-wax and clay-mold traditions.
            </p>
          </div>

          {/* Value Props Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-heritage-border-light max-w-4xl">
            <div className="flex items-center gap-2.5 text-xs text-heritage-cream/90">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              <span><strong>Free Shipping</strong> across India for orders ≥ ₹2,500</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-heritage-cream/90">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>100% Panchaloha</strong> purity & Ayurvedic alloy ratios</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-heritage-cream/90">
              <Hammer className="w-4 h-4 text-amber-300 shrink-0" />
              <span><strong>Hand-finished</strong> with natural non-toxic burnishing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <ProductGrid initialProducts={products} />
      </section>

      {/* Custom Work Commission Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-heritage-surface/80 border border-heritage-border rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-[0.2em] text-amber-300 font-semibold">
              Bespoke Sanctum Commissions
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-medium text-heritage-cream">
              Seeking a custom temple deity idol or architectural bronze?
            </h2>
            <p className="text-xs sm:text-sm text-heritage-muted max-w-2xl">
              Explore our masterwork portfolio and submit your iconography specifications for custom lost-wax Panchaloha casting with callback by our Chief Sthapati.
            </p>
          </div>

          <Link
            href="/custom-work"
            className="button-secondary shrink-0 text-xs sm:text-sm px-6 py-3"
          >
            Explore Custom Work
          </Link>
        </div>
      </section>
    </main>
  );
}
