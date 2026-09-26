'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PredefinedProduct } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';

interface ProductCardProps {
  product: PredefinedProduct;
}

// 3 authentic bronze finish swatches matching Shopify Heritage styling
const FINISH_SWATCHES = [
  { name: 'Antique Bronze', bg: '#8C6D58' },
  { name: 'High Polish Gold', bg: '#C8A951' },
  { name: 'Verdant Patina', bg: '#4A7C59' },
];

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
      aria-label={`View details for ${product.name}`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] w-full bg-heritage-surface rounded-xl overflow-hidden border border-heritage-border/70 group-hover:border-amber-400/40 transition-all duration-300">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
            Handcrafted Bronze
          </div>
        )}

        {/* Minimal pill badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-pill text-[11px] text-heritage-cream/90 font-medium">
          In stock
        </div>
      </div>

      {/* Product Info below image */}
      <div className="pt-3 pb-1 space-y-1">
        <h3 className="text-sm sm:text-base font-normal text-heritage-cream group-hover:text-amber-200 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm font-normal text-heritage-cream/80">
          {formatPaiseToInr(product.pricePaise)}
        </p>

        {/* Finish Color Swatches */}
        <div className="flex items-center gap-1.5 pt-1" aria-label="Available finishes">
          {FINISH_SWATCHES.map((swatch) => (
            <span
              key={swatch.name}
              className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
              style={{ backgroundColor: swatch.bg }}
              title={swatch.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
