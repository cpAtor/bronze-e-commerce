import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
  MessageSquare,
  Package,
} from 'lucide-react';
import { SEED_PREDEFINED_PRODUCTS, SEED_PORTFOLIO_PIECES } from '@/data/seed-data';
import { formatPaiseToInr } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-parchment-200/60 via-parchment-100 to-parchment-100 border-b border-parchment-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bronze-900/10 border border-gold-500/30 text-bronze-900 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Madhuchishtavidhana &bull; Swamimalai Lineage</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-bronze-950 leading-[1.15]">
                Living Bronze.
                <br />
                <span className="text-bronze-700 italic">Sacred Fire.</span>
                <br />
                Timeless Form.
              </h1>

              <p className="text-base sm:text-lg text-bronze-800/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Authentic handcrafted Panchaloha lifestyle wares and bespoke temple deity murtis, forged with ancient lost-wax casting methods unchanged since the Chola dynasty.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#shop"
                  className="tap-target w-full sm:w-auto px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-parchment-50 bg-bronze-900 hover:bg-bronze-800 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Explore Curated Wares</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-400" />
                </a>

                <a
                  href="#custom"
                  className="tap-target w-full sm:w-auto px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-bronze-900 bg-parchment-50 hover:bg-parchment-200 border-2 border-bronze-700/30 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <span>Temple Commissions</span>
                </a>
              </div>

              {/* Micro-assurances */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-parchment-300 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-serif font-bold text-bronze-950 text-base sm:text-lg">5-Metal</p>
                  <p className="text-xs text-bronze-600">Panchaloha Alloy</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-bronze-950 text-base sm:text-lg">₹2,500+</p>
                  <p className="text-xs text-bronze-600">Free India Shipping</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-bronze-950 text-base sm:text-lg">100%</p>
                  <p className="text-xs text-bronze-600">Hand-Cast Bronze</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-bronze-900/10 group">
                <Image
                  src="/images/portfolio/nataraja.jpg"
                  alt="Masterwork Nataraja Murti in lost-wax Panchaloha bronze"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bronze-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-gold-400 text-xs tracking-widest uppercase font-semibold">
                    Masterpiece Showcase
                  </span>
                  <h3 className="text-parchment-100 font-serif text-lg font-bold">
                    Nataraja Ananda Tandava Murti
                  </h3>
                  <p className="text-parchment-300 text-xs">
                    Madhuchishtavidhana Lost-Wax Casting &bull; Swamimalai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft & Metallurgy Storytelling */}
      <section id="craft" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">
            Heritage & Metallurgical Canon
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-bronze-950">
            The Alchemy of Panchaloha & Lost-Wax Casting
          </h2>
          <p className="text-base text-bronze-700 font-sans leading-relaxed">
            In our Swamimalai atelier, bronze is not simply cast—it is awakened according to the sacred Shilpa Shastras, balancing five sacred metals with elemental fire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Panchaloha */}
          <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-bronze-900/10 flex items-center justify-center text-bronze-800">
                <ShieldCheck className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-bronze-950">
                The Five Sacred Metals (Panchaloha)
              </h3>
              <p className="text-sm text-bronze-800 leading-relaxed font-sans">
                Mentioned in ancient Agamas, Panchaloha is an alloy revered for its spiritual conductivity and therapeutic Ayurvedic properties:
              </p>
              <ul className="space-y-3 text-sm text-bronze-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                  <span><strong>Copper (Tamra):</strong> Forms the sacred structural core, providing strength, thermal conductivity, and longevity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                  <span><strong>Zinc (Jada):</strong> Enhances fluidity during molten pour and imparts an enduring warm golden luster.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                  <span><strong>Tin (Vanga):</strong> Grants pure acoustic resonance for sacred bells (*Ghantas*) and corrosion resistance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                  <span><strong>Lead (Sisa) & Silver/Gold:</strong> Trace sacramental elements ensuring smooth mold penetration and sanctum purity.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-parchment-200">
              <p className="text-xs text-bronze-600 italic">
                All daily drinkware and cooking vessels are forged strictly in food-safe lead-free Kansa (78% copper, 22% tin).
              </p>
            </div>
          </div>

          {/* Card 2: Lost-Wax Process */}
          <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-bronze-900/10 flex items-center justify-center text-bronze-800">
                <Flame className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-bronze-950">
                Madhuchishtavidhana (Cire Perdue)
              </h3>
              <p className="text-sm text-bronze-800 leading-relaxed font-sans">
                Each custom idol is completely singular because the original wax model is sacrificed in fire during casting:
              </p>
              <div className="space-y-4 text-sm text-bronze-800">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-bronze-200 text-bronze-900 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold text-bronze-900">Beeswax Sculpting</h4>
                    <p className="text-xs text-bronze-700">The artisan carves pure beeswax and resin to define every divine gesture (*Mudra*) and ornament.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-bronze-200 text-bronze-900 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold text-bronze-900">Alluvial Clay Encasement</h4>
                    <p className="text-xs text-bronze-700">Multiple fine coatings of Cauvery river silt clay are layered around the wax to capture micro-details.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-bronze-200 text-bronze-900 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold text-bronze-900">The Molten Pour</h4>
                    <p className="text-xs text-bronze-700">Red-hot molten alloy is poured in; the wax drains away, replacing wax with solid eternal bronze.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-bronze-200 text-bronze-900 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <h4 className="font-semibold text-bronze-900">Chiseling & Eye-Opening</h4>
                    <p className="text-xs text-bronze-700">Days of hand chiseling, diamond paste buffing, and the sacred ritual opening of the eyes (*Netronmeelana*).</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-parchment-200">
              <p className="text-xs text-bronze-600 italic">
                No industrial stamping or modern plastic molds—every curve carries human intention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Predefined Products Catalog */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">
              Ready for Dispatch
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-bronze-950 mt-1">
              Curated Artisanal Bronze Wares
            </h2>
            <p className="text-sm text-bronze-700 mt-2 max-w-xl">
              Authentic bronze vessels, ritual sets, and jewellery hand-finished in our workshop. Packed in protective wooden crates with insurance.
            </p>
          </div>

          <div className="bg-parchment-200/80 border border-parchment-300 rounded-xl px-4 py-2.5 text-xs text-bronze-900 flex items-center gap-2 self-start md:self-auto">
            <Package className="w-4 h-4 text-gold-600 flex-shrink-0" />
            <span><strong>Flat ₹150 shipping</strong> &bull; <strong>Free</strong> on orders ₹2,500+</span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEED_PREDEFINED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="bg-parchment-50 border border-parchment-300/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-bronze-950/5">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3 bg-parchment-50/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-bronze-900 border border-parchment-200">
                  {product.weight}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-bronze-500 font-medium">
                    {product.dimensions}
                  </p>
                  <h3 className="font-serif font-bold text-lg text-bronze-950 leading-snug group-hover:text-gold-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-bronze-700 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-parchment-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-bronze-500 block">Price</span>
                    <span className="text-xl font-serif font-bold text-bronze-950">
                      {formatPaiseToInr(product.pricePaise)}
                    </span>
                  </div>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target px-4 text-xs font-semibold uppercase tracking-wider text-parchment-100 bg-bronze-900 hover:bg-bronze-800 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bespoke Temple Commissions Portfolio */}
      <section id="custom" className="bg-bronze-950 text-parchment-100 py-20 border-y border-bronze-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-400">
              Sanctum Murti & Temple Accessories
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-parchment-100">
              Bespoke Custom Works Showcase
            </h2>
            <p className="text-sm sm:text-base text-parchment-300 font-sans leading-relaxed">
              Every deity sculpture is created according to your temple’s sanctum measurements (*Ayadi calculation*) and specific iconography canons.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SEED_PORTFOLIO_PIECES.map((piece) => (
              <div
                key={piece.id}
                className="bg-bronze-900/60 border border-bronze-800 rounded-2xl overflow-hidden flex flex-col group hover:border-gold-500/50 transition-colors"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={piece.images[0]}
                    alt={piece.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-bronze-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-gold-400 border border-bronze-700">
                    Lead: {piece.typicalLeadTime}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-parchment-100 group-hover:text-gold-400 transition-colors">
                      {piece.name}
                    </h3>
                    <p className="text-xs text-parchment-300/80 line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>

                    <div className="pt-2 text-xs text-parchment-400 space-y-1">
                      <p><strong className="text-gold-400/90 font-medium">Ref Dimensions:</strong> {piece.referenceDimensions}</p>
                      <p><strong className="text-gold-400/90 font-medium">Casting:</strong> {piece.castingTechnique}</p>
                      <p><strong className="text-gold-400/90 font-medium">Finishes:</strong> {piece.finishOptions.join(', ')}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-bronze-800">
                    <a
                      href={`https://wa.me/919876543210?text=Inquiring%20about%20commissioning%20${encodeURIComponent(piece.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target w-full text-xs font-semibold uppercase tracking-wider text-bronze-950 bg-gold-500 hover:bg-gold-400 rounded-full transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Custom Quote</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Inquiry Callout */}
          <div className="mt-16 bg-gradient-to-r from-bronze-900 to-bronze-950 border border-gold-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
              Need a Custom Temple Idol or Sanctum Restoration?
            </h3>
            <p className="text-sm text-parchment-300 max-w-2xl mx-auto leading-relaxed">
              We work directly with temple trustees, archakas, and private patrons worldwide to design, cast, and consecrate murtis following Shilpa Shastra proportions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/919876543210?text=Namaskaram%2C%20I%20would%20like%20to%20discuss%20a%20temple%20bronze%20commission"
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target px-8 text-xs font-semibold uppercase tracking-wider text-bronze-950 bg-gold-400 hover:bg-gold-300 rounded-full transition-colors flex items-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Master Sthapati</span>
              </a>

              <a
                href="tel:+919876543210"
                className="tap-target px-8 text-xs font-semibold uppercase tracking-wider text-parchment-100 bg-bronze-800 hover:bg-bronze-700 border border-bronze-700 rounded-full transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
