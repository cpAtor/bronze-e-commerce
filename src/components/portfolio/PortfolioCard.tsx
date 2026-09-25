import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioPiece } from '@/domain/types';
import { Clock, Ruler, ArrowRight, Sparkles } from 'lucide-react';

interface PortfolioCardProps {
  piece: PortfolioPiece;
}

export function PortfolioCard({ piece }: PortfolioCardProps) {
  const imageUrl = piece.images[0] || '/images/portfolio/nataraja.jpg';

  return (
    <article className="group bg-heritage-surface border border-heritage-border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-heritage-cream/40 hover:shadow-xl hover:shadow-black/40">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-heritage-darker">
        <Image
          src={imageUrl}
          alt={piece.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-darker/90 via-transparent to-transparent opacity-80" />

        {/* Lead time badge */}
        <div className="absolute top-3 right-3 bg-heritage-dark/85 backdrop-blur-md border border-heritage-border text-heritage-cream text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-heritage-muted" />
          <span>{piece.typicalLeadTime}</span>
        </div>

        {/* Technique pill */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-md bg-heritage-dark/80 backdrop-blur-sm border border-heritage-border/60 text-heritage-cream/90">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Lost-Wax Madhuchista Vidhana
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-medium text-heritage-cream tracking-tight group-hover:text-heritage-cream-hover transition-colors line-clamp-1">
            {piece.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-heritage-cream/75 line-clamp-2 font-light leading-relaxed">
            {piece.description}
          </p>

          {/* Reference Dimensions */}
          <div className="mt-4 flex items-center gap-2 text-xs text-heritage-cream/90 bg-heritage-dark/40 px-3 py-2 rounded-lg border border-heritage-border/40">
            <Ruler className="w-3.5 h-3.5 text-heritage-muted shrink-0" />
            <span className="font-mono text-[11px] truncate">
              {piece.referenceDimensions}
            </span>
          </div>

          {/* Finish Options preview */}
          {piece.finishOptions && piece.finishOptions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {piece.finishOptions.map((finish) => (
                <span
                  key={finish}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-heritage-cream/10 text-heritage-cream/80 border border-heritage-border/30"
                >
                  {finish}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-heritage-border/60 flex flex-col sm:flex-row gap-2.5">
          <Link
            href={`/custom-work/${piece.slug}`}
            className="button-secondary flex-1 text-xs justify-center py-2.5 min-h-[44px]"
            aria-label={`View details of ${piece.name}`}
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
          <Link
            href={`/custom-work/inquire?piece=${piece.slug}`}
            className="button-primary flex-1 text-xs justify-center py-2.5 min-h-[44px]"
            aria-label={`Inquire about commission inspired by ${piece.name}`}
          >
            <span>Request Similar</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
