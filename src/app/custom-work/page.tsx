import React from 'react';
import Link from 'next/link';
import { PortfolioCatalogService } from '@/services/portfolio-catalog.service';
import { PortfolioGrid, CraftBadges } from '@/components/portfolio';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bespoke Sanctum Commissions & Masterworks | Heritage Bronze',
  description:
    'Explore canonical lost-wax Chola-style bronze temple sculptures, prabhavalis, deepastambhas, and ceremonial bells cast by hereditary master sthapatis.',
};

export default async function CustomWorkPage() {
  const portfolioService = new PortfolioCatalogService();
  const pieces = await portfolioService.getPortfolioPieces();

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream selection:bg-heritage-cream selection:text-heritage-dark">
      {/* Hero Section */}
      <section className="relative border-b border-heritage-border/70 overflow-hidden py-16 sm:py-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-heritage-surface border border-heritage-border text-xs uppercase tracking-widest text-heritage-muted mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Madhuchista Vidhana • Sacred Lost-Wax Casting</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-medium tracking-tight text-heritage-cream max-w-4xl mx-auto leading-tight">
            Temple Sanctum Commissions & Masterpieces
          </h1>

          <p className="mt-6 text-sm sm:text-base text-heritage-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Hereditary master craftsmen (Sthapatis) preserving thousand-year-old Chola bronze casting traditions. We accept bespoke commissions for temple sanctorums, prabhavali arches, ritual deepams, and consecrated shrines.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/custom-work/inquire"
              className="button-primary min-h-[44px] w-full sm:w-auto px-8 py-3.5 text-sm font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <span>Initiate Custom Commission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#showcase"
              className="button-secondary min-h-[44px] w-full sm:w-auto px-8 py-3.5 text-sm font-medium tracking-wide flex items-center justify-center"
            >
              <span>Explore Archival Works</span>
            </a>
          </div>
        </div>
      </section>

      {/* Craftsmanship Principles */}
      <section className="py-12 sm:py-16 border-b border-heritage-border/50 bg-heritage-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-heritage-muted font-medium">
              Ancient Foundry Canon
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-medium text-heritage-cream mt-1">
              Consecrated Agamic Technique
            </h2>
          </div>
          <CraftBadges />
        </div>
      </section>

      {/* Portfolio Showcase Grid */}
      <section id="showcase" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4 pb-6 border-b border-heritage-border/60">
            <div>
              <span className="text-xs uppercase tracking-widest text-heritage-muted font-medium block">
                Curated Portfolio Archive
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-medium text-heritage-cream mt-1">
                Showcase of Masterworks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-heritage-cream/70 max-w-md font-light">
              Each piece serves as a reference for proportions, weight, casting intricacy, and temple finish options.
            </p>
          </div>

          <PortfolioGrid pieces={pieces} />
        </div>
      </section>

      {/* Bottom Commission Invitation Banner */}
      <section className="py-16 sm:py-20 border-t border-heritage-border/70 bg-heritage-surface/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-heritage-cream/10 border border-heritage-border flex items-center justify-center text-heritage-cream mx-auto mb-5">
            <Flame className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-medium text-heritage-cream tracking-tight">
            Have a Specific Vigraha or Sanctum Need?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-heritage-cream/80 max-w-xl mx-auto font-light leading-relaxed">
            Our Master Sthapati consults directly with temple trustees, archakas, and private devotees to formulate bespoke proportions and clay wax designs.
          </p>
          <div className="mt-8">
            <Link
              href="/custom-work/inquire"
              className="button-primary min-h-[44px] px-8 py-3.5 text-sm font-medium tracking-wide inline-flex items-center gap-2"
            >
              <span>Submit Bespoke Commission Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
