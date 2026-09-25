import React from 'react';
import Link from 'next/link';
import { PortfolioCatalogService } from '@/services/portfolio-catalog.service';
import { CommissionInquiryForm } from '@/components/portfolio';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Commission Quote | Heritage Bronze Sanctum Works',
  description:
    'Submit an inquiry for custom temple bronze casting, vigraha sanctum commissions, prabhavalis, and ritual brassware directly to our Master Sthapati.',
};

interface InquirePageProps {
  searchParams: Promise<{
    piece?: string;
    inspiredBy?: string;
  }>;
}

export default async function CommissionInquirePage({
  searchParams,
}: InquirePageProps) {
  const params = await searchParams;
  const portfolioService = new PortfolioCatalogService();

  let initialPiece = null;
  if (params.piece) {
    initialPiece = await portfolioService.getPortfolioPieceBySlug(params.piece);
  } else if (params.inspiredBy) {
    initialPiece = await portfolioService.getPortfolioPieceById(params.inspiredBy);
  }

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream py-10 sm:py-16 selection:bg-heritage-cream selection:text-heritage-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/custom-work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-heritage-muted hover:text-heritage-cream transition-colors min-h-[44px]"
            aria-label="Back to Portfolio Showcase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio Showcase</span>
          </Link>
        </div>

        {/* Commission Form Component */}
        <CommissionInquiryForm initialPiece={initialPiece} />
      </div>
    </div>
  );
}
