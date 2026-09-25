import React from 'react';
import type { PortfolioPiece } from '@/domain/types';
import { PortfolioCard } from './PortfolioCard';
import { Sparkles } from 'lucide-react';

interface PortfolioGridProps {
  pieces: PortfolioPiece[];
}

export function PortfolioGrid({ pieces }: PortfolioGridProps) {
  if (!pieces || pieces.length === 0) {
    return (
      <div className="py-16 text-center bg-heritage-surface border border-heritage-border rounded-2xl p-8">
        <Sparkles className="w-10 h-10 text-heritage-muted mx-auto mb-3" />
        <h3 className="text-lg font-medium text-heritage-cream">
          No Portfolio Pieces Found
        </h3>
        <p className="mt-1 text-sm text-heritage-cream/70">
          Our master artisans are currently documenting new sanctum commissions.
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Custom Bronze Masterworks Showcase"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
    >
      {pieces.map((piece) => (
        <PortfolioCard key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
