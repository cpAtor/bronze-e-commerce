import React from 'react';
import Link from 'next/link';
import { ProductCatalogService } from '@/services/product-catalog.service';
import { ProductGrid } from '@/components/shop/ProductGrid';

export const revalidate = 0; // Dynamic server-rendered to reflect repository updates instantly

export default async function ShopPage() {
  const service = new ProductCatalogService();
  const products = await service.browseProducts();

  return (
    <main className="bg-heritage-dark text-heritage-cream min-h-screen pb-24">
      {/* Clean Minimalist Header */}
      <section className="pt-10 sm:pt-16 pb-8 border-b border-heritage-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2 text-center sm:text-left">
          <h1 className="font-heading text-3xl sm:text-4xl font-normal text-heritage-cream">
            Artisanal Wares
          </h1>
          <p className="text-sm text-heritage-muted max-w-2xl">
            Heirloom bronze vessels and sacred idols, lost-wax cast by master sthapatis in Kumbakonam.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <ProductGrid initialProducts={products} />
      </section>

      {/* Custom Work Commission Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
