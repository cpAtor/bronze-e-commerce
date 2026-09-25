'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import type { PredefinedProduct, CreateProductInput, UpdateProductInput } from '@/domain/types';

interface ProductFormProps {
  initialProduct?: PredefinedProduct;
  isEdit?: boolean;
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [priceRupees, setPriceRupees] = useState<string>(
    initialProduct ? (initialProduct.pricePaise / 100).toString() : '2500'
  );
  const [stockQuantity, setStockQuantity] = useState<string>(
    initialProduct ? initialProduct.stockQuantity.toString() : '10'
  );
  const [weight, setWeight] = useState(initialProduct?.weight || '');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '');
  const [alloyDescription, setAlloyDescription] = useState(
    initialProduct?.alloyDescription || 'Traditional Panchaloha (copper, zinc, tin, lead, silver)'
  );
  const [careGuide, setCareGuide] = useState(
    initialProduct?.careGuide ||
      'Clean with tamarind paste or pitambari powder; rinse with clear water and dry immediately with a soft cotton cloth.'
  );
  const [imagesText, setImagesText] = useState(
    initialProduct?.images?.join('\n') || '/images/products/bronze-kalash.jpg'
  );

  const [error, setError] = useState<string | null>(null);

  const generateSlugFromName = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Product slug is required.');
      return;
    }

    const priceNum = parseFloat(priceRupees);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid non-negative price in Rupees (₹).');
      return;
    }

    const stockNum = parseInt(stockQuantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setError('Please enter a valid non-negative stock quantity.');
      return;
    }

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const pricePaise = Math.round(priceNum * 100);

    const payload: CreateProductInput | UpdateProductInput = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      pricePaise,
      stockQuantity: stockNum,
      weight: weight.trim(),
      dimensions: dimensions.trim(),
      alloyDescription: alloyDescription.trim(),
      careGuide: careGuide.trim(),
      images,
    };

    startTransition(async () => {
      try {
        const url = isEdit
          ? `/api/admin/products/${initialProduct?.id}`
          : '/api/admin/products';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to save product');
        }

        router.push('/admin/products');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the product');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-heritage-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full border border-heritage-border bg-heritage-surface text-heritage-cream hover:bg-heritage-cream/10 active:scale-[0.98] transition-all"
            aria-label="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-heritage-cream">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-heritage-muted mt-0.5">
              {isEdit
                ? `Updating "${initialProduct?.name}"`
                : 'Create and publish an authentic bronze ware item to /shop'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="tap-target inline-flex items-center justify-center rounded-full border border-heritage-border bg-transparent text-heritage-cream px-5 py-2.5 text-sm font-medium hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-heritage-cream text-heritage-dark px-7 py-2.5 text-sm font-medium hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px] shadow-lg shadow-black/30 font-heading"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields Card 1: Core Details */}
      <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-heading font-medium text-heritage-cream tracking-wide uppercase text-xs border-b border-heritage-border pb-3">
          Core Product Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Product Name <span className="text-amber-400">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Traditional Bronze Kalash (Lota)"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Product Slug */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="product-slug"
                className="text-xs font-medium uppercase tracking-wider text-heritage-cream/80"
              >
                URL Slug <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={generateSlugFromName}
                className="tap-target inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors py-1 px-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-generate from Name</span>
              </button>
            </div>
            <div className="flex items-center rounded-xl bg-heritage-dark/80 border border-heritage-border overflow-hidden focus-within:border-heritage-cream">
              <span className="px-3.5 py-3 text-xs font-mono text-heritage-muted border-r border-heritage-border/50 bg-heritage-darker/60 select-none">
                /shop/
              </span>
              <input
                id="product-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="traditional-bronze-kalash"
                className="w-full bg-transparent px-4 py-3 text-sm font-mono text-heritage-cream placeholder:text-heritage-muted focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Price (Rupees) */}
          <div>
            <label
              htmlFor="product-price"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Price (in ₹ INR) <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-heritage-muted select-none">
                ₹
              </span>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                required
                inputMode="decimal"
                value={priceRupees}
                onChange={(e) => setPriceRupees(e.target.value)}
                placeholder="2800"
                className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl pl-8 pr-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
              />
            </div>
            <p className="text-[11px] text-heritage-muted mt-1.5">
              Saved internally as {priceRupees ? Math.round(parseFloat(priceRupees || '0') * 100) : 0} paise.
            </p>
          </div>

          {/* Stock Quantity */}
          <div>
            <label
              htmlFor="product-stock"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Stock Quantity <span className="text-amber-400">*</span>
            </label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              required
              inputMode="numeric"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="10"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
            <p className="text-[11px] text-heritage-muted mt-1.5">
              Units currently on hand in the Swamimalai workshop.
            </p>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="product-desc"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Craft Description
            </label>
            <textarea
              id="product-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Handcrafted sacred water vessel forged from authentic five-metal Panchaloha alloy..."
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
            />
          </div>
        </div>
      </div>

      {/* Form Fields Card 2: Craft Specs & Care */}
      <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-heading font-medium text-heritage-cream tracking-wide uppercase text-xs border-b border-heritage-border pb-3">
          Dimensions & Craft Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Weight */}
          <div>
            <label
              htmlFor="product-weight"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Weight
            </label>
            <input
              id="product-weight"
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 1.25 kg"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label
              htmlFor="product-dimensions"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Dimensions
            </label>
            <input
              id="product-dimensions"
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 15cm x 15cm x 18cm"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Alloy Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="product-alloy"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Alloy Composition & Purity
            </label>
            <input
              id="product-alloy"
              type="text"
              value={alloyDescription}
              onChange={(e) => setAlloyDescription(e.target.value)}
              placeholder="e.g. Traditional Panchaloha (copper, zinc, tin, lead, silver)"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Care Guide */}
          <div className="sm:col-span-2">
            <label
              htmlFor="product-care"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Traditional Care Guide
            </label>
            <textarea
              id="product-care"
              rows={3}
              value={careGuide}
              onChange={(e) => setCareGuide(e.target.value)}
              placeholder="Clean with tamarind paste or pitambari powder; rinse with clear water and dry immediately with a soft cotton cloth."
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
            />
          </div>
        </div>
      </div>

      {/* Form Fields Card 3: Images */}
      <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-heading font-medium text-heritage-cream tracking-wide uppercase text-xs border-b border-heritage-border pb-3">
          Product Images
        </h2>

        <div>
          <label
            htmlFor="product-images"
            className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
          >
            Image URLs (one per line)
          </label>
          <textarea
            id="product-images"
            rows={4}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            placeholder="/images/products/bronze-kalash.jpg&#10;https://example.com/gallery-photo-2.jpg"
            className="w-full font-mono text-xs bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
          />
          <p className="text-[11px] text-heritage-muted mt-1.5">
            The first URL is used as the primary catalog thumbnail.
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-heritage-border">
        <Link
          href="/admin/products"
          className="tap-target inline-flex items-center justify-center rounded-full border border-heritage-border bg-transparent text-heritage-cream px-6 py-3 text-sm font-medium hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-heritage-cream text-heritage-dark px-8 py-3 text-sm font-medium hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px] shadow-lg shadow-black/30 font-heading font-semibold"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>
    </form>
  );
}
