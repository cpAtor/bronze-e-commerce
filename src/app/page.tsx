import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Flame,
  Package,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { SEED_PREDEFINED_PRODUCTS, SEED_PORTFOLIO_PIECES } from '@/data/seed-data';
import { formatPaiseToInr } from '@/lib/utils';
import { ADMIN_CONFIG } from '@/lib/config';

export default function HomePage() {
  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 bg-heritage-dark text-heritage-cream">
      {/* ── SECTION 1: HERO (Shopify Heritage Scheme 1) ────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 border-b border-heritage-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Hero Editorial Text */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-heritage-border bg-heritage-surface text-heritage-cream text-xs font-medium tracking-[0.14em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-heritage-cream" />
                <span>Swamimalai Lineage &bull; Lost-Wax Casting</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-medium tracking-tight leading-[1.05] text-heritage-cream">
                Heirloom Bronze.
                <br />
                <span className="text-heritage-muted italic font-normal">Hand-Forged</span>
                <br />
                for Eternity.
              </h1>

              <p className="text-base sm:text-lg text-heritage-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
                Authentic handcrafted Panchaloha lifestyle wares and bespoke temple deity vigrahas, forged with unbroken 3,000-year Chola metallurgical traditions.
              </p>

              {/* Heritage Pill Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#shop"
                  className="button-primary w-full sm:w-auto"
                >
                  <span>Shop the Collection</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>

                <a
                  href="#custom"
                  className="button-secondary w-full sm:w-auto"
                >
                  <span>Temple Commissions</span>
                </a>
              </div>

              {/* Minimal Trust Metadata */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-heritage-border/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-heading font-semibold text-heritage-cream text-lg">5-Metal</p>
                  <p className="text-xs text-heritage-muted tracking-wider uppercase mt-0.5">Panchaloha</p>
                </div>
                <div>
                  <p className="font-heading font-semibold text-heritage-cream text-lg">₹2,500+</p>
                  <p className="text-xs text-heritage-muted tracking-wider uppercase mt-0.5">Free Shipping</p>
                </div>
                <div>
                  <p className="font-heading font-semibold text-heritage-cream text-lg">100%</p>
                  <p className="text-xs text-heritage-muted tracking-wider uppercase mt-0.5">Hand-Cast</p>
                </div>
              </div>
            </div>

            {/* Hero Featured Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border shadow-2xl group">
                <Image
                  src="/images/portfolio/nataraja.jpg"
                  alt="Nataraja Ananda Tandava Murti in authentic lost-wax Panchaloha bronze"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/90 via-transparent to-transparent flex flex-col justify-end p-7">
                  <span className="text-[11px] tracking-[0.16em] uppercase text-heritage-muted font-medium">
                    Sanctum Masterpiece
                  </span>
                  <h3 className="font-heading text-xl font-medium text-heritage-cream mt-1">
                    Nataraja Ananda Tandava
                  </h3>
                  <p className="text-xs text-heritage-muted font-light mt-0.5">
                    Madhuchishtavidhana Lost-Wax Casting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CURATED COLLECTIONS ROW ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-heritage-border gap-4">
          <div>
            <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
              Curated Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-heritage-cream mt-1">
              Browse by Category
            </h2>
          </div>
          <span className="text-xs text-heritage-muted font-light">
            3 Core Atelier Disciplines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1 */}
          <a
            href="#custom"
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border bg-heritage-surface flex flex-col justify-end p-6"
          >
            <Image
              src="/images/portfolio/prabhavali.jpg"
              alt="Temple Vigrahas & Accessories"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/90 via-heritage-darker/30 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-heritage-muted">
                Bespoke Sanctum
              </span>
              <h3 className="font-heading text-xl font-medium text-heritage-cream">
                Temple Vigrahas & Arch
              </h3>
              <p className="text-xs text-heritage-muted font-light pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </a>

          {/* Category 2 */}
          <a
            href="#shop"
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border bg-heritage-surface flex flex-col justify-end p-6"
          >
            <Image
              src="/images/products/bronze-bottle.jpg"
              alt="Ayurvedic Kansa Drinkware"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/90 via-heritage-darker/30 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-heritage-muted">
                Daily Living
              </span>
              <h3 className="font-heading text-xl font-medium text-heritage-cream">
                Ayurvedic Kansa Ware
              </h3>
              <p className="text-xs text-heritage-muted font-light pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Shop Wares</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </a>

          {/* Category 3 */}
          <a
            href="#shop"
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border bg-heritage-surface flex flex-col justify-end p-6"
          >
            <Image
              src="/images/products/bronze-urli.jpg"
              alt="Ritual Devotion & Urli"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/90 via-heritage-darker/30 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-heritage-muted">
                Sacred Living
              </span>
              <h3 className="font-heading text-xl font-medium text-heritage-cream">
                Ritual Ensembles & Urli
              </h3>
              <p className="text-xs text-heritage-muted font-light pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Shop Wares</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* ── SECTION 3: MEDIA WITH CONTENT (Shopify Heritage Scheme 3 Moss) ── */}
      <section id="craft" className="bg-heritage-moss text-heritage-cream py-20 border-y border-heritage-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Large Editorial Portrait */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border shadow-2xl">
                <Image
                  src="/images/products/bronze-pooja-set.jpg"
                  alt="Panchaloha Sacred Pooja Set"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Editorial Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
                Heritage &bull; Metallurgical Canon
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-heritage-cream">
                The Sacred Five Metals (Panchaloha)
              </h2>
              <p className="text-sm sm:text-base text-heritage-muted leading-relaxed font-light">
                In our Swamimalai atelier, bronze is alloyed according to the ancient Shilpa Shastras. Five sacred metals are combined in harmonic equilibrium:
              </p>

              <div className="space-y-4 pt-2 text-sm text-heritage-cream/90">
                <div className="pb-3 border-b border-heritage-border/50">
                  <strong className="font-medium text-heritage-cream">Copper (Tamra) &bull; Structural Heart</strong>
                  <p className="text-xs text-heritage-muted mt-0.5 font-light">Provides structural core strength, longevity, and thermal conductivity.</p>
                </div>
                <div className="pb-3 border-b border-heritage-border/50">
                  <strong className="font-medium text-heritage-cream">Zinc (Jada) &bull; Radiance</strong>
                  <p className="text-xs text-heritage-muted mt-0.5 font-light">Imparts smooth molten flow and an enduring warm golden gleam.</p>
                </div>
                <div className="pb-3 border-b border-heritage-border/50">
                  <strong className="font-medium text-heritage-cream">Tin (Vanga) &bull; Acoustic Resonance</strong>
                  <p className="text-xs text-heritage-muted mt-0.5 font-light">Grants bell-metal acoustics (*Kansya*) and anti-corrosive permanence.</p>
                </div>
                <div>
                  <strong className="font-medium text-heritage-cream">Sacramental Elements &bull; Silver & Gold</strong>
                  <p className="text-xs text-heritage-muted mt-0.5 font-light">Ensures spiritual conductivity and sanctum ritual purity.</p>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#shop"
                  className="button-primary"
                >
                  <span>Explore Finished Wares</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PRODUCT LIST GRID (The 6 Predefined Products) ────── */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-heritage-border gap-4">
          <div>
            <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
              In Stock & Ready to Ship
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium text-heritage-cream mt-1">
              Curated Bronze Wares
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-heritage-muted">
            <Package className="w-4 h-4 text-heritage-cream" />
            <span>Flat ₹150 delivery &bull; <strong>Free</strong> over ₹2,500</span>
          </div>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEED_PREDEFINED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col border border-heritage-border rounded-2xl overflow-hidden bg-heritage-surface hover:border-heritage-cream/40 transition-all duration-300"
            >
              {/* Product Visual */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-heritage-darker">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3.5 right-3.5 bg-heritage-darker/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-heritage-cream border border-heritage-border">
                  {product.weight}
                </div>
              </div>

              {/* Product Card Details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-heritage-muted font-normal block">
                    {product.dimensions}
                  </span>
                  <h3 className="font-heading font-medium text-lg text-heritage-cream leading-snug group-hover:text-heritage-cream-hover transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-heritage-muted line-clamp-2 leading-relaxed font-light pt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-heritage-border/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-heritage-subtle block">Price</span>
                    <span className="text-xl font-heading font-medium text-heritage-cream">
                      {formatPaiseToInr(product.pricePaise)}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="button-secondary text-xs px-5 py-2.5"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: MEDIA WITH CONTENT #2 (Bespoke Temple Intake) ───────── */}
      <section id="custom" className="bg-heritage-darker py-20 border-y border-heritage-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
                Bespoke Temple Commissions
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-heritage-cream">
                Madhuchishtavidhana (Lost-Wax Casting)
              </h2>
              <p className="text-sm sm:text-base text-heritage-muted leading-relaxed font-light">
                Each custom temple vigraha is sculpted uniquely in pure beeswax according to the patron’s sanctum measurements (*Ayadi calculations*). The wax model is consumed by fire, creating an irreplaceable, singular work of living bronze.
              </p>

              <div className="space-y-3 pt-1 text-sm text-heritage-cream/90">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-heritage-cream" />
                  <span>Custom heights from 12 inches to 7 feet</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-heritage-cream" />
                  <span>Finishes: Antique Temple Patina, High Polish, or Verdant Patina</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-heritage-cream" />
                  <span>Consecrated iconography compliant with Agama traditions</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`https://wa.me/${cleanPhone}?text=Namaskaram%2C%20I%20would%20like%20to%20discuss%20a%20bespoke%20temple%20commission`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>WhatsApp Sthapati</span>
                </a>

                <a
                  href={`tel:${ADMIN_CONFIG.phone}`}
                  className="button-secondary w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Call {ADMIN_CONFIG.phone}</span>
                </a>
              </div>
            </div>

            {/* Showcase Visual */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-heritage-border shadow-2xl">
                <Image
                  src="/images/portfolio/deepastambha.jpg"
                  alt="Deepastambha Ritual Branching Lamp"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BESPOKE PORTFOLIO SHOWCASE ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-heritage-border gap-4">
          <div>
            <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
              Representative Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium text-heritage-cream mt-1">
              Custom Portfolio Pieces
            </h2>
          </div>
          <span className="text-xs text-heritage-muted font-light">
            Typical Lead Times: 4–12 Weeks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEED_PORTFOLIO_PIECES.map((piece) => (
            <div
              key={piece.id}
              className="group border border-heritage-border rounded-2xl overflow-hidden bg-heritage-surface flex flex-col justify-between hover:border-heritage-cream/40 transition-colors"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-heritage-darker">
                  <Image
                    src={piece.images[0]}
                    alt={piece.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-heritage-darker/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-heritage-cream border border-heritage-border">
                    Lead: {piece.typicalLeadTime}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-heading font-medium text-lg text-heritage-cream leading-snug">
                    {piece.name}
                  </h3>
                  <p className="text-xs text-heritage-muted line-clamp-2 leading-relaxed font-light">
                    {piece.description}
                  </p>
                  <div className="pt-2 text-xs text-heritage-subtle space-y-1 font-light">
                    <p><strong className="text-heritage-cream/80 font-normal">Ref Dimensions:</strong> {piece.referenceDimensions}</p>
                    <p><strong className="text-heritage-cream/80 font-normal">Technique:</strong> {piece.castingTechnique}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={`https://wa.me/${cleanPhone}?text=Inquiring%20about%20custom%20commission%20for%20${encodeURIComponent(piece.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary w-full text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  <span>Request Custom Quote</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: ATELIER STATEMENT / VALUES ─────────────────────────── */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-heritage-border rounded-3xl p-8 sm:p-14 bg-heritage-surface/60 backdrop-blur-sm text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-muted block">
              Atelier Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-heritage-cream">
              Direct from the Swamimalai Hereditary Sthapatis
            </h2>
            <p className="text-sm text-heritage-muted leading-relaxed font-light">
              No retail markups or mass-production factories. Every bronze piece and consecrated deity vigraha is cast, chiseled, and buffed in our master workshop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-6 border-t border-heritage-border/70 max-w-4xl mx-auto">
            <div className="space-y-2">
              <ShieldCheck className="w-5 h-5 text-heritage-cream" />
              <h4 className="font-heading font-medium text-sm text-heritage-cream">Authentic Five Metals</h4>
              <p className="text-xs text-heritage-muted font-light leading-relaxed">
                Certified sacred copper, tin, zinc, and precious alloy proportions according to Agamic tenets.
              </p>
            </div>
            <div className="space-y-2">
              <Flame className="w-5 h-5 text-heritage-cream" />
              <h4 className="font-heading font-medium text-sm text-heritage-cream">Pure Lost-Wax Sculpting</h4>
              <p className="text-xs text-heritage-muted font-light leading-relaxed">
                Every wax mold is sculpted by hand and lost to molten bronze; no two works are identical.
              </p>
            </div>
            <div className="space-y-2">
              <Package className="w-5 h-5 text-heritage-cream" />
              <h4 className="font-heading font-medium text-sm text-heritage-cream">Insured Wooden Crating</h4>
              <p className="text-xs text-heritage-muted font-light leading-relaxed">
                Custom shockproof timber framing ensures safe transit for heavy consecrated idols across India and abroad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
