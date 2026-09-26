'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Flame,
  Hammer,
  ChevronDown,
} from 'lucide-react';
import type { PredefinedProduct } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';
import { useCart } from './CartContext';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: PredefinedProduct;
  relatedProducts?: PredefinedProduct[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  const { addToCart, openCheckout } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Accordion toggle states
  const [materialsOpen, setMaterialsOpen] = useState(true);
  const [careOpen, setCareOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isOutOfStock = product.stockQuantity <= 0;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/bronze-kalash.jpg'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    openCheckout();
  };

  return (
    <div className="pb-24 md:pb-16 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-heritage-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-heritage-cream transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-heritage-cream transition-colors">
          Artisanal Wares
        </Link>
        <span>/</span>
        <span className="text-heritage-cream line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid: Images Left, Details Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left: Product Media */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] sm:aspect-square w-full bg-heritage-surface rounded-2xl overflow-hidden border border-heritage-border/80 shadow-2xl">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Thumbnails if multiple */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-heritage-cream ring-2 ring-heritage-cream/30'
                      : 'border-heritage-border opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box (Faithful to Shopify Heritage theme) */}
        <div className="space-y-5">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-heritage-cream leading-tight">
              {product.name}
            </h1>
            <p className="text-lg sm:text-xl font-normal text-heritage-cream/90 pt-1">
              {formatPaiseToInr(product.pricePaise)}
            </p>
          </div>

          {/* Specifications Pills */}
          <div className="space-y-2 pt-1">
            <span className="text-xs text-heritage-cream/80 block">Specifications</span>
            <div className="flex flex-wrap gap-2 text-xs text-heritage-cream/90">
              <span className="px-3 py-1.5 rounded-full bg-heritage-surface border border-heritage-border">
                {product.weight}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-heritage-surface border border-heritage-border">
                {product.dimensions}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-heritage-surface border border-heritage-border">
                {product.alloyDescription}
              </span>
              <span className={`px-3 py-1.5 rounded-full border ${
                isOutOfStock
                  ? 'bg-red-950/40 border-red-800/60 text-red-300'
                  : 'bg-heritage-surface border-heritage-border text-heritage-cream/90'
              }`}>
                {isOutOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
              </span>
            </div>
          </div>

          {/* Stepper + Add to Cart Row */}
          <div className="pt-2 flex items-center gap-3">
            {/* Stepper */}
            <div className="flex items-center bg-heritage-surface border border-heritage-border rounded-full px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
                className="w-8 h-8 flex items-center justify-center text-heritage-cream/80 hover:text-heritage-cream disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium text-heritage-cream">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                disabled={isOutOfStock || quantity >= product.stockQuantity}
                className="w-8 h-8 flex items-center justify-center text-heritage-cream/80 hover:text-heritage-cream disabled:opacity-40 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 min-h-[44px] rounded-full border border-heritage-cream/30 hover:border-heritage-cream disabled:opacity-40 disabled:hover:border-heritage-cream/30 bg-transparent hover:bg-heritage-surface text-heritage-cream font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of stock' : 'Add to cart'}</span>
            </button>
          </div>

          {/* Buy It Now Full Width Warm Cream CTA */}
          <div>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="button-primary w-full text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? 'Currently Unavailable' : 'Buy it now'}
            </button>
          </div>

          {/* Product Description from Database */}
          <div className="pt-4 text-xs sm:text-sm text-heritage-cream/80 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* 4-Reassurance Icons Row (Shopify Heritage demo style) */}
          <div className="grid grid-cols-4 border-t border-b border-heritage-border py-6 text-center">
            <div className="flex flex-col items-center gap-2 px-1 border-r border-heritage-border/70">
              <Sparkles className="w-5 h-5 text-heritage-cream/80" />
              <span className="text-[10px] uppercase tracking-wider text-heritage-cream/90 font-medium leading-tight">
                Made With<br />Care
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 px-1 border-r border-heritage-border/70">
              <ShieldCheck className="w-5 h-5 text-heritage-cream/80" />
              <span className="text-[10px] uppercase tracking-wider text-heritage-cream/90 font-medium leading-tight">
                Heirloom<br />Quality
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 px-1 border-r border-heritage-border/70">
              <Flame className="w-5 h-5 text-heritage-cream/80" />
              <span className="text-[10px] uppercase tracking-wider text-heritage-cream/90 font-medium leading-tight">
                Consecrated<br />Alloy
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 px-1">
              <Hammer className="w-5 h-5 text-heritage-cream/80" />
              <span className="text-[10px] uppercase tracking-wider text-heritage-cream/90 font-medium leading-tight">
                Foundry<br />Direct
              </span>
            </div>
          </div>

          {/* Clean Accordions: Materials, Care, Details - All from Database */}
          <div className="divide-y divide-heritage-border/70 text-xs sm:text-sm">
            {/* Materials */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setMaterialsOpen(!materialsOpen)}
                className="w-full flex items-center justify-between text-left font-medium text-heritage-cream hover:text-amber-200 transition-colors"
                aria-expanded={materialsOpen}
              >
                <span>Materials</span>
                <ChevronDown
                  className={`w-4 h-4 text-heritage-muted transition-transform duration-200 ${
                    materialsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {materialsOpen && (
                <p className="mt-2 text-xs text-heritage-cream/80 leading-relaxed">
                  {product.alloyDescription}
                </p>
              )}
            </div>

            {/* Care */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setCareOpen(!careOpen)}
                className="w-full flex items-center justify-between text-left font-medium text-heritage-cream hover:text-amber-200 transition-colors"
                aria-expanded={careOpen}
              >
                <span>Care</span>
                <ChevronDown
                  className={`w-4 h-4 text-heritage-muted transition-transform duration-200 ${
                    careOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {careOpen && (
                <p className="mt-2 text-xs text-heritage-cream/80 leading-relaxed">
                  {product.careGuide}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between text-left font-medium text-heritage-cream hover:text-amber-200 transition-colors"
                aria-expanded={detailsOpen}
              >
                <span>Details</span>
                <ChevronDown
                  className={`w-4 h-4 text-heritage-muted transition-transform duration-200 ${
                    detailsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {detailsOpen && (
                <div className="mt-2 text-xs text-heritage-cream/80 space-y-1">
                  <p>Weight: {product.weight}</p>
                  <p>Dimensions: {product.dimensions}</p>
                  <p>Alloy Composition: {product.alloyDescription}</p>
                  <p>Availability: {product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Out of stock'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "You may also like" Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t border-heritage-border-light">
          <h2 className="font-heading text-xl sm:text-2xl font-normal text-heritage-cream mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Mini-Bar (Shopify Heritage demo style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-heritage-darker/95 backdrop-blur-md border-t border-heritage-border px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-heritage-surface shrink-0 border border-heritage-border">
            <Image
              src={images[0]}
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-heritage-cream truncate">
              {product.name}
            </p>
            <p className="text-[11px] text-heritage-cream/70 truncate">
              {formatPaiseToInr(product.pricePaise)} • {isOutOfStock ? 'Out of stock' : `${product.weight}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-11 h-11 rounded-full bg-heritage-cream text-heritage-dark flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-40 transition-transform shrink-0"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
