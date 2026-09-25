'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  Info,
  ArrowLeft,
} from 'lucide-react';
import type { PredefinedProduct } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';
import { useCart } from './CartContext';

interface ProductDetailViewProps {
  product: PredefinedProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/bronze-kalash.jpg'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="pb-24 md:pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-heritage-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-heritage-cream transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-heritage-cream transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Artisanal Wares</span>
        </Link>
        <span>/</span>
        <span className="text-heritage-cream font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid: Left Images, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Images (5 or 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-heritage-surface rounded-2xl overflow-hidden border border-heritage-border shadow-2xl">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 bg-heritage-dark/90 backdrop-blur-md px-3 py-1.5 rounded-pill border border-heritage-border text-xs uppercase tracking-wider text-amber-200 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Kumbakonam Craft</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-heritage-dark/90 backdrop-blur-md px-3 py-1 rounded-pill border border-heritage-border text-xs text-heritage-cream/90 font-mono">
              Weight: {product.weight}
            </div>
          </div>

          {/* Thumbnail Strip (if multiple) */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all min-h-tap min-w-tap ${
                    selectedImageIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : 'border-heritage-border hover:border-heritage-cream/50'
                  }`}
                  aria-label={`View image ${idx + 1} of ${product.name}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Specifications & Actions (6 or 7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold block">
              Heirloom Panchaloha Ware
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-medium tracking-display text-heritage-cream leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-semibold font-mono text-heritage-cream">
                {formatPaiseToInr(product.pricePaise)}
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-pill flex items-center gap-1 font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {product.pricePaise >= 250000 ? 'Free Insured Courier Shipping' : '+ ₹150 Courier Delivery'}
                </span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none text-sm text-heritage-muted leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Craft Specifications Card */}
          <div className="bg-heritage-surface/60 border border-heritage-border rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Craft & Alloy Specifications</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-heritage-dark/80 p-2.5 rounded-lg border border-heritage-border-light">
                <span className="text-heritage-muted block text-[10px] uppercase">Alloy Composition</span>
                <span className="text-heritage-cream font-medium block mt-0.5">{product.alloyDescription}</span>
              </div>
              <div className="bg-heritage-dark/80 p-2.5 rounded-lg border border-heritage-border-light">
                <span className="text-heritage-muted block text-[10px] uppercase">Weight</span>
                <span className="text-heritage-cream font-medium font-mono block mt-0.5">{product.weight}</span>
              </div>
              <div className="bg-heritage-dark/80 p-2.5 rounded-lg border border-heritage-border-light">
                <span className="text-heritage-muted block text-[10px] uppercase">Dimensions</span>
                <span className="text-heritage-cream font-medium block mt-0.5">{product.dimensions}</span>
              </div>
              <div className="bg-heritage-dark/80 p-2.5 rounded-lg border border-heritage-border-light">
                <span className="text-heritage-muted block text-[10px] uppercase">Foundry Stock</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready for Dispatch</span>
                </span>
              </div>
            </div>
          </div>

          {/* Authentic Care Instructions */}
          <div className="bg-heritage-moss/40 border border-heritage-border rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Heirloom Maintenance & Care
            </h3>
            <p className="text-xs text-heritage-cream/90 leading-relaxed">
              {product.careGuide}
            </p>
          </div>

          {/* Desktop Purchase Controls (>= 768px) */}
          <div className="hidden md:flex items-center gap-4 pt-4 border-t border-heritage-border">
            {/* Quantity Stepper (min 44px tap targets) */}
            <div className="flex items-center border border-heritage-border rounded-pill bg-heritage-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream hover:bg-heritage-dark transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-heritage-cream font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream hover:bg-heritage-dark transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Main Add to Cart Button (min 44px tap target) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="button-primary flex-1 min-h-tap text-sm font-medium flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • {formatPaiseToInr(product.pricePaise * quantity)}</span>
            </button>
          </div>

          {/* Reassurance Badges */}
          <div className="flex items-center gap-4 text-xs text-heritage-muted pt-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Panchaloha Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tracked Courier Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky "Add to Cart" Action Bar (< 768px) */}
      {/* Strict: min 44x44px tap targets, prevents unnecessary scrolling on small viewports */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-heritage-darker/95 backdrop-blur-md border-t border-heritage-border p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-heritage-muted font-mono tracking-wider">
            Total Price
          </span>
          <span className="text-base font-semibold text-heritage-cream font-mono">
            {formatPaiseToInr(product.pricePaise * quantity)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Quantity Stepper */}
          <div className="flex items-center border border-heritage-border rounded-pill bg-heritage-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream hover:bg-heritage-dark transition-colors px-1"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-heritage-cream font-mono">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="min-h-tap min-w-tap flex items-center justify-center text-heritage-cream hover:bg-heritage-dark transition-colors px-1"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="min-h-tap px-4 py-2.5 rounded-pill bg-heritage-cream text-heritage-dark hover:bg-heritage-cream-hover font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
