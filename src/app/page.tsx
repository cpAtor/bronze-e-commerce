import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { SEED_PREDEFINED_PRODUCTS, SEED_PORTFOLIO_PIECES } from '@/data/seed-data';
import { formatPaiseToInr } from '@/lib/utils';
import { ADMIN_CONFIG } from '@/lib/config';

export default function HomePage() {
  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-heritage-dark text-heritage-cream selection:bg-heritage-cream selection:text-heritage-dark">
      {/* ── SECTION 1: EDITORIAL STATEMENT HERO & ASYMMETRIC GALLERY ─────── */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Single Confident Headline Statement */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-light tracking-tight text-heritage-cream leading-[1.12]">
            Authentic five-metal bronze, hand-cast for generations to come.
          </h1>
        </div>

        {/* Asymmetrical Staggered Gallery (Shopify Heritage Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Staggered Item 1: Vertical Portrait */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/shop" className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-heritage-surface">
                <Image
                  src="/images/products/bronze-bottle.jpg"
                  alt="Ayurvedic Kansa Drinkware"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="pt-3 flex items-center gap-1.5 text-sm font-light text-heritage-cream group-hover:underline underline-offset-4">
                <span>Shop Lifestyle Wares</span>
                <ArrowRight className="w-3.5 h-3.5 text-heritage-muted" />
              </div>
            </Link>
          </div>

          {/* Staggered Item 2: Offset Landscape / Square */}
          <div className="md:col-span-7 md:pt-16 lg:pt-24 space-y-3">
            <Link href="/custom-work" className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-heritage-surface">
                <Image
                  src="/images/portfolio/prabhavali.jpg"
                  alt="Temple Sanctum Idols & Arch"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
              <div className="pt-3 flex items-center gap-1.5 text-sm font-light text-heritage-cream group-hover:underline underline-offset-4">
                <span>Temple Sanctum Commissions</span>
                <ArrowRight className="w-3.5 h-3.5 text-heritage-muted" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: OUR BESTSELLERS (Shopify Heritage Bestsellers Row) ─── */}
      <section id="shop" className="py-16 sm:py-24 border-t border-heritage-border-light scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-light text-heritage-cream">
              Our bestsellers
            </h2>
          </div>

          {/* Floating Borderless Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
            {SEED_PREDEFINED_PRODUCTS.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group flex flex-col space-y-3"
              >
                {/* Clean floating product image */}
                <div className="relative aspect-square w-full overflow-hidden bg-heritage-surface">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-normal text-heritage-cream">
                    In Stock
                  </div>
                </div>

                {/* Minimal typography hierarchy */}
                <div className="space-y-1">
                  <h3 className="font-heading font-normal text-sm sm:text-base text-heritage-cream group-hover:text-heritage-cream-hover transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-heritage-muted font-light">
                    <span className="text-heritage-cream">{formatPaiseToInr(product.pricePaise)}</span>
                  </div>

                  {/* Finish Swatch Dots */}
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D58]" title="Traditional Bronze" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8A951]" title="High Polish" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" title="Verdant Patina" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FLUSH 50/50 EDITORIAL SPLIT #1 (The Wool Blanket Layout) ─ */}
      <section id="lifestyle" className="border-t border-heritage-border-light">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Muted Olive Text Block */}
          <div className="bg-heritage-moss flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 space-y-6 order-2 lg:order-1">
            <span className="text-xs font-light tracking-[0.16em] uppercase text-heritage-cream/70 block">
              Sacred Living
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-heritage-cream leading-tight">
              The Swamimalai Urli
            </h2>

            <p className="text-sm sm:text-base text-heritage-cream/85 font-light leading-relaxed max-w-md">
              Hand-sculpted using pure beeswax and ancient lost-wax casting. Crafted with high-tin bell bronze to resonate positive acoustics and bring sacred tranquility to homes and sanctums.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link href="/shop/fluted-traditional-urli-bowl" className="button-primary text-xs sm:text-sm">
                Shop now
              </Link>
              <Link href="/shop" className="button-secondary text-xs sm:text-sm">
                Explore the collection
              </Link>
            </div>
          </div>

          {/* Right Column: Full-Bleed Image */}
          <div className="relative aspect-square lg:aspect-auto min-h-[380px] lg:min-h-[580px] w-full overflow-hidden order-1 lg:order-2">
            <Image
              src="/images/products/bronze-urli.jpg"
              alt="The Handcrafted Swamimalai Bronze Urli"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FLUSH 50/50 EDITORIAL SPLIT #2 (The Cozy Beanie Layout) ── */}
      <section id="custom" className="border-t border-heritage-border-light scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Full-Bleed Image */}
          <div className="relative aspect-square lg:aspect-auto min-h-[380px] lg:min-h-[580px] w-full overflow-hidden">
            <Image
              src="/images/portfolio/nataraja.jpg"
              alt="Sacred Consecrated Nataraja Vigraha"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column: Contrast Text Block */}
          <div className="bg-[#383a30] flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 space-y-6">
            <span className="text-xs font-light tracking-[0.16em] uppercase text-heritage-cream/70 block">
              Sanctum Commissions
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-heritage-cream leading-tight">
              The Divine Vigraha
            </h2>

            <p className="text-sm sm:text-base text-heritage-cream/85 font-light leading-relaxed max-w-md">
              Custom temple murtis cast according to Shilpa Shastra Ayadi canonical measurements. Every wax model is uniquely chiseled and consumed by fire—yielding an irreplaceable, consecrated sacred presence.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/custom-work/inquire?piece=nataraja-ananda-tandava-murti"
                className="button-primary text-xs sm:text-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-2" />
                <span>Request custom quote</span>
              </Link>
              <Link href="/custom-work" className="button-secondary text-xs sm:text-sm">
                View portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: REPRESENTATIVE PORTFOLIO SHOWCASE ───────────────────── */}
      <section id="portfolio" className="py-16 sm:py-24 border-t border-heritage-border-light max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 sm:mb-12 gap-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-light text-heritage-cream">
            Sanctum Portfolio
          </h2>
          <span className="text-xs text-heritage-muted font-light">
            Commission Lead Times: 4–12 Weeks
          </span>
        </div>

        {/* Clean floating portfolio showcase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
          {SEED_PORTFOLIO_PIECES.slice(0, 4).map((piece) => (
            <Link key={piece.id} href={`/custom-work/${piece.slug}`} className="group flex flex-col space-y-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-heritage-surface">
                <Image
                  src={piece.images[0]}
                  alt={piece.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-normal text-sm sm:text-base text-heritage-cream group-hover:text-heritage-cream-hover transition-colors line-clamp-1">
                  {piece.name}
                </h3>
                <p className="text-xs text-heritage-muted font-light">
                  {piece.referenceDimensions} &bull; {piece.typicalLeadTime}
                </p>
                <div className="pt-1 text-xs text-heritage-cream/80 group-hover:underline underline-offset-4 inline-flex items-center gap-1">
                  <span>Explore Masterwork</span>
                  <ArrowRight className="w-3 h-3 text-heritage-muted" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
