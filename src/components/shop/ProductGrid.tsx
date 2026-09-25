'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { PredefinedProduct } from '@/domain/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  initialProducts: PredefinedProduct[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.alloyDescription.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePaise - b.pricePaise);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePaise - a.pricePaise);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Default seed ordering
        break;
    }

    return result;
  }, [initialProducts, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filter and Sort Toolbar */}
      <div className="bg-heritage-surface/60 border border-heritage-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-heritage-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by idol, vessel, or alloy..."
            className="w-full min-h-tap pl-10 pr-4 py-2 bg-heritage-dark border border-heritage-border rounded-lg text-sm text-heritage-cream placeholder:text-heritage-subtle focus:outline-none focus:border-amber-400"
            aria-label="Search products"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-heritage-muted shrink-0" />
            <span className="text-xs text-heritage-muted hidden md:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="min-h-tap px-3 py-2 bg-heritage-dark border border-heritage-border rounded-lg text-xs text-heritage-cream focus:outline-none focus:border-amber-400 cursor-pointer"
            aria-label="Sort products"
          >
            <option value="featured">Featured Artisanal Wares</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-heritage-muted px-1">
        <span>
          Showing <strong className="text-heritage-cream">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'heirloom piece' : 'heirloom pieces'}
        </span>
        <span className="flex items-center gap-1.5 text-amber-200/90">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>All wares forged from pure Panchaloha & Kansa bronze</span>
        </span>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-heritage-surface/30 border border-dashed border-heritage-border rounded-xl space-y-3">
          <p className="text-base text-heritage-cream font-medium">No artisanal wares match your search</p>
          <p className="text-xs text-heritage-muted max-w-sm mx-auto">
            Try adjusting your search terms or clearing the filter to view our complete collection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSortBy('featured');
            }}
            className="button-secondary text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
