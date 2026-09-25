import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortfolioCatalogService } from '@/services/portfolio-catalog.service';
import { ADMIN_CONFIG } from '@/lib/config';
import {
  Clock,
  Ruler,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolioService = new PortfolioCatalogService();
  const piece = await portfolioService.getPortfolioPieceBySlug(slug);

  if (!piece) {
    return {
      title: 'Piece Not Found | Heritage Bronze',
    };
  }

  return {
    title: `${piece.name} | Custom Bronze Masterworks`,
    description: piece.description,
  };
}

export default async function PortfolioPieceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolioService = new PortfolioCatalogService();
  const piece = await portfolioService.getPortfolioPieceBySlug(slug);

  if (!piece) {
    notFound();
  }

  const imageUrl = piece.images[0] || '/images/portfolio/nataraja.jpg';
  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    `Namaskaram! I am inquiring about the ${piece.name} from your portfolio showcase. Please let me know how we can commission a similar masterwork.`
  );
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/custom-work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-heritage-muted hover:text-heritage-cream transition-colors min-h-[44px]"
            aria-label="Back to Portfolio Showcase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio Showcase</span>
          </Link>
        </div>

        {/* Masterwork Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-2xl overflow-hidden border border-heritage-border bg-heritage-surface shadow-2xl">
              <Image
                src={imageUrl}
                alt={piece.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/60 via-transparent to-transparent pointer-events-none" />

              {/* Craft badge overlay */}
              <div className="absolute top-4 left-4 bg-heritage-dark/85 backdrop-blur-md border border-heritage-border text-heritage-cream text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bespoke Archive</span>
              </div>
            </div>

            {/* Casting Specs Card */}
            <div className="bg-heritage-surface border border-heritage-border rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-heritage-muted font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Madhuchista Vidhana (Lost-Wax) Foundry Specs</span>
              </h3>
              <p className="text-xs sm:text-sm text-heritage-cream/80 leading-relaxed font-light">
                {piece.castingTechnique}
              </p>
              <div className="pt-3 border-t border-heritage-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-heritage-muted" />
                  <span className="text-heritage-cream/90 font-light">Consecrated Panchaloha Alloy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-heritage-muted" />
                  <span className="text-heritage-cream/90 font-light">Agamic Shilpa Shastra Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Piece Specs & Commission CTA */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-heritage-muted uppercase tracking-widest mb-2">
                <span>Ref ID: {piece.id}</span>
                <span>•</span>
                <span className="text-amber-400">Authentic Chola Canon</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-heritage-cream leading-tight">
                {piece.name}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-heritage-cream/80 leading-relaxed font-light">
                {piece.description}
              </p>
            </div>

            {/* Key Specifications Grid */}
            <div className="rounded-xl border border-heritage-border bg-heritage-surface/80 p-5 space-y-4">
              {/* Reference Dimensions */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-heritage-dark border border-heritage-border flex items-center justify-center shrink-0">
                  <Ruler className="w-4 h-4 text-heritage-muted" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-heritage-muted block">
                    Reference Proportions & Scale
                  </span>
                  <span className="text-sm font-mono font-medium text-heritage-cream mt-0.5 block">
                    {piece.referenceDimensions}
                  </span>
                  <span className="text-[11px] text-heritage-cream/60">
                    Scalable to any temple sanctum specifications.
                  </span>
                </div>
              </div>

              {/* Lead Time */}
              <div className="flex items-start gap-3 pt-3 border-t border-heritage-border/50">
                <div className="w-9 h-9 rounded-lg bg-heritage-dark border border-heritage-border flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-heritage-muted" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-heritage-muted block">
                    Typical Foundry Lead Time
                  </span>
                  <span className="text-sm font-medium text-heritage-cream mt-0.5 block">
                    {piece.typicalLeadTime}
                  </span>
                  <span className="text-[11px] text-heritage-cream/60">
                    Includes clay wax modeling, drying, casting & sacred hand-chiseling.
                  </span>
                </div>
              </div>
            </div>

            {/* Finish Options */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-heritage-muted font-medium mb-3">
                Available Traditional Finishes
              </h3>
              <div className="flex flex-wrap gap-2">
                {piece.finishOptions.map((finish) => (
                  <div
                    key={finish}
                    className="px-3.5 py-2 rounded-xl bg-heritage-surface border border-heritage-border text-xs text-heritage-cream/90 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    <span>{finish}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/custom-work/inquire?piece=${piece.slug}`}
                className="button-primary w-full min-h-[48px] text-sm font-medium tracking-wide flex items-center justify-center gap-2"
                aria-label={`Request custom quote inspired by ${piece.name}`}
              >
                <span>Request Similar Commission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary min-h-[44px] text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href={`tel:${ADMIN_CONFIG.phone}`}
                  className="button-secondary min-h-[44px] text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-heritage-muted" />
                  <span>Call Sthapati</span>
                </a>
              </div>
            </div>

            {/* Consultation Guarantee Note */}
            <p className="text-xs text-center text-heritage-muted font-light leading-relaxed">
              Every commission begins with personal consultation with the master sculptor to establish Agamic parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
