import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { getStoreRepository } from '@/repositories';
import { formatPaiseToInr } from '@/lib/utils';
import { ADMIN_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');
  const repo = getStoreRepository();

  const [products, portfolioPieces] = await Promise.all([
    repo.listProducts(),
    repo.listPortfolioPieces(),
  ]);

  const bestsellers = products.slice(0, 4);
  const showcasePieces = portfolioPieces.slice(0, 4);

  // Dynamic featured picks from live database records
  const heroLifestyleProduct = products[1] || products[0];
  const heroTemplePiece = portfolioPieces[1] || portfolioPieces[0];
  const featuredLifestyle =
    products.find((p) => p.slug === 'fluted-traditional-urli-bowl') ||
    products.find((p) => p.slug.includes('urli')) ||
    products[4] ||
    products[0];
  const featuredSanctum =
    portfolioPieces.find((p) => p.slug === 'nataraja-ananda-tandava-murti') ||
    portfolioPieces.find((p) => p.slug.includes('nataraja')) ||
    portfolioPieces[0];

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
            <Link
              href={heroLifestyleProduct ? `/shop/${heroLifestyleProduct.slug}` : '/shop'}
              className="group block"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-heritage-surface">
                {heroLifestyleProduct?.images[0] ? (
                  <Image
                    src={heroLifestyleProduct.images[0]}
                    alt={heroLifestyleProduct.name}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
                    Handcrafted Bronze
                  </div>
                )}
              </div>
              <div className="pt-3 flex items-center gap-1.5 text-sm font-light text-heritage-cream group-hover:underline underline-offset-4">
                <span>Shop Lifestyle Wares</span>
                <ArrowRight className="w-3.5 h-3.5 text-heritage-muted" />
              </div>
            </Link>
          </div>

          {/* Staggered Item 2: Offset Landscape / Square */}
          <div className="md:col-span-7 md:pt-16 lg:pt-24 space-y-3">
            <Link
              href={heroTemplePiece ? `/custom-work/${heroTemplePiece.slug}` : '/custom-work'}
              className="group block"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-heritage-surface">
                {heroTemplePiece?.images[0] ? (
                  <Image
                    src={heroTemplePiece.images[0]}
                    alt={heroTemplePiece.name}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
                    Sanctum Commission
                  </div>
                )}
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
      <section id="bestsellers" className="py-16 sm:py-24 border-t border-heritage-border-light scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-light text-heritage-cream">
              Our bestsellers
            </h2>
          </div>

          {/* Floating Borderless Products Grid from Real Database */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
            {bestsellers.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group flex flex-col space-y-3"
                >
                  {/* Clean floating product image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-heritage-surface">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
                        Handcrafted Bronze
                      </div>
                    )}
                    <div className={`absolute top-2.5 left-2.5 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-normal ${
                      isOutOfStock ? 'bg-red-950/80 text-red-200' : 'bg-black/60 text-heritage-cream'
                    }`}>
                      {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </div>
                  </div>

                  {/* Minimal typography hierarchy */}
                  <div className="space-y-1">
                    <h3 className="font-heading font-normal text-sm sm:text-base text-heritage-cream group-hover:text-heritage-cream-hover transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-heritage-muted font-light">
                      <span className="text-heritage-cream">{formatPaiseToInr(product.pricePaise)}</span>
                      <span>&bull;</span>
                      <span>{product.weight}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FLUSH 50/50 EDITORIAL SPLIT #1 (The Wool Blanket Layout) ─ */}
      {featuredLifestyle && (
        <section id="lifestyle" className="border-t border-heritage-border-light">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Muted Olive Text Block */}
            <div className="bg-heritage-moss flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 space-y-6 order-2 lg:order-1">
              <span className="text-xs font-light tracking-[0.16em] uppercase text-heritage-cream/70 block">
                Sacred Living
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-heritage-cream leading-tight">
                {featuredLifestyle.name}
              </h2>

              <p className="text-sm sm:text-base text-heritage-cream/85 font-light leading-relaxed max-w-md">
                {featuredLifestyle.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link href={`/shop/${featuredLifestyle.slug}`} className="button-primary text-xs sm:text-sm">
                  Shop now
                </Link>
                <Link href="/shop" className="button-secondary text-xs sm:text-sm">
                  Explore the collection
                </Link>
              </div>
            </div>

            {/* Right Column: Full-Bleed Image from Database */}
            <div className="relative aspect-square lg:aspect-auto min-h-[380px] lg:min-h-[580px] w-full overflow-hidden order-1 lg:order-2">
              {featuredLifestyle.images[0] && (
                <Image
                  src={featuredLifestyle.images[0]}
                  alt={featuredLifestyle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4: FLUSH 50/50 EDITORIAL SPLIT #2 (The Cozy Beanie Layout) ── */}
      {featuredSanctum && (
        <section id="commissions" className="border-t border-heritage-border-light scroll-mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Full-Bleed Image from Database */}
            <div className="relative aspect-square lg:aspect-auto min-h-[380px] lg:min-h-[580px] w-full overflow-hidden">
              {featuredSanctum.images[0] && (
                <Image
                  src={featuredSanctum.images[0]}
                  alt={featuredSanctum.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Right Column: Contrast Text Block */}
            <div className="bg-heritage-contrast flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 space-y-6">
              <span className="text-xs font-light tracking-[0.16em] uppercase text-heritage-cream/70 block">
                Sanctum Commissions
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-heritage-cream leading-tight">
                {featuredSanctum.name}
              </h2>

              <p className="text-sm sm:text-base text-heritage-cream/85 font-light leading-relaxed max-w-md">
                {featuredSanctum.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=Namaskaram%2C%20I%20would%20like%20to%20discuss%20a%20temple%20bronze%20commission%20for%20${encodeURIComponent(featuredSanctum.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary text-xs sm:text-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  <span>Request custom quote</span>
                </a>
                <Link href={`/custom-work/${featuredSanctum.slug}`} className="button-secondary text-xs sm:text-sm">
                  View piece
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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

        {/* Clean floating portfolio showcase from Real Database */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
          {showcasePieces.map((piece) => (
            <div key={piece.id} className="group flex flex-col space-y-3">
              <Link href={`/custom-work/${piece.slug}`} className="block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-heritage-surface">
                  {piece.images[0] && (
                    <Image
                      src={piece.images[0]}
                      alt={piece.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  )}
                </div>
              </Link>

              <div className="space-y-1">
                <Link href={`/custom-work/${piece.slug}`} className="block">
                  <h3 className="font-heading font-normal text-sm sm:text-base text-heritage-cream group-hover:text-heritage-cream-hover transition-colors line-clamp-1">
                    {piece.name}
                  </h3>
                </Link>
                <p className="text-xs text-heritage-muted font-light">
                  {piece.referenceDimensions} &bull; {piece.typicalLeadTime}
                </p>
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Inquiring%20about%20${encodeURIComponent(piece.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-heritage-cream hover:underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    <span>Inquire via WhatsApp</span>
                    <ArrowRight className="w-3 h-3 text-heritage-muted" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
