'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react';
import type { PredefinedProduct } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: PredefinedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <article className="group relative flex flex-col bg-heritage-surface/50 border border-heritage-border rounded-xl overflow-hidden hover:border-amber-300/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/40">
      {/* Product Image Link */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/3] w-full bg-heritage-dark overflow-hidden">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-heritage-muted text-sm">
            Handcrafted Bronze
          </div>
        )}

        {/* Purity / Craft Badge */}
        <div className="absolute top-3 left-3 bg-heritage-dark/85 backdrop-blur-md px-2.5 py-1 rounded-pill border border-heritage-border-light text-[10px] uppercase tracking-wider text-amber-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Panchaloha</span>
        </div>

        {/* Weight Tag */}
        <div className="absolute top-3 right-3 bg-heritage-dark/85 backdrop-blur-md px-2.5 py-1 rounded-pill border border-heritage-border-light text-[10px] text-heritage-cream/90 font-mono">
          {product.weight}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base sm:text-lg font-medium text-heritage-cream group-hover:text-amber-200 transition-colors line-clamp-1">
              <Link href={`/shop/${product.slug}`}>{product.name}</Link>
            </h3>
            <Link
              href={`/shop/${product.slug}`}
              className="tap-target text-heritage-muted group-hover:text-heritage-cream transition-colors p-1"
              aria-label={`View details for ${product.name}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-heritage-muted line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-heritage-muted">
            <span className="bg-heritage-dark px-2 py-0.5 rounded border border-heritage-border-light">
              {product.dimensions}
            </span>
          </div>
        </div>

        {/* Pricing and Action Bar */}
        <div className="pt-3 border-t border-heritage-border-light flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-heritage-muted block">
              Direct Price
            </span>
            <span className="text-base sm:text-lg font-semibold text-heritage-cream font-mono">
              {formatPaiseToInr(product.pricePaise)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="min-h-tap min-w-tap px-4 py-2 rounded-pill bg-heritage-cream text-heritage-dark hover:bg-heritage-cream-hover font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
