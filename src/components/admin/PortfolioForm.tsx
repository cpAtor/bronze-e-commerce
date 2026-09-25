'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import type { PortfolioPiece, CreatePortfolioPieceInput, UpdatePortfolioPieceInput } from '@/domain/types';

interface PortfolioFormProps {
  initialPiece?: PortfolioPiece;
  isEdit?: boolean;
}

export function PortfolioForm({ initialPiece, isEdit = false }: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialPiece?.name || '');
  const [slug, setSlug] = useState(initialPiece?.slug || '');
  const [description, setDescription] = useState(initialPiece?.description || '');
  const [referenceDimensions, setReferenceDimensions] = useState(
    initialPiece?.referenceDimensions || '24" H x 18" W x 8" D (approx. 22 kg)'
  );
  const [castingTechnique, setCastingTechnique] = useState(
    initialPiece?.castingTechnique ||
      'Traditional Madhuchishtavidhana (lost-wax casting) with alluvial clay mold and solid lost-wax core'
  );
  const [finishOptionsText, setFinishOptionsText] = useState(
    initialPiece?.finishOptions?.join(', ') ||
      'Antique Temple Patina, Polished Bronze Highlights, Verdant Patina'
  );
  const [typicalLeadTime, setTypicalLeadTime] = useState(
    initialPiece?.typicalLeadTime || '8–10 weeks'
  );
  const [imagesText, setImagesText] = useState(
    initialPiece?.images?.join('\n') || '/images/portfolio/nataraja.jpg'
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

    if (!name.trim()) {
      setError('Portfolio piece name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Portfolio piece slug is required.');
      return;
    }

    const finishOptions = finishOptionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreatePortfolioPieceInput | UpdatePortfolioPieceInput = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      referenceDimensions: referenceDimensions.trim(),
      castingTechnique: castingTechnique.trim(),
      finishOptions,
      typicalLeadTime: typicalLeadTime.trim(),
      images,
    };

    startTransition(async () => {
      try {
        const url = isEdit
          ? `/api/admin/portfolio/${initialPiece?.id}`
          : '/api/admin/portfolio';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to save portfolio piece');
        }

        router.push('/admin/portfolio');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving portfolio piece');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-heritage-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full border border-heritage-border bg-heritage-surface text-heritage-cream hover:bg-heritage-cream/10 active:scale-[0.98] transition-all"
            aria-label="Back to portfolio list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-heritage-cream">
              {isEdit ? 'Edit Portfolio Piece' : 'Add Showcase Masterwork'}
            </h1>
            <p className="text-xs text-heritage-muted mt-0.5">
              {isEdit
                ? `Updating "${initialPiece?.name}"`
                : 'Publish a monumental temple commission piece to /custom-work'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
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
            <span>{isPending ? 'Saving...' : isEdit ? 'Update Piece' : 'Publish Piece'}</span>
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
          Masterwork Showcase Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Piece Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="piece-name"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Piece Title <span className="text-amber-400">*</span>
            </label>
            <input
              id="piece-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nataraja Ananda Tandava Murti"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Piece Slug */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="piece-slug"
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
                /custom-work/
              </span>
              <input
                id="piece-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nataraja-ananda-tandava-murti"
                className="w-full bg-transparent px-4 py-3 text-sm font-mono text-heritage-cream placeholder:text-heritage-muted focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Lead Time */}
          <div>
            <label
              htmlFor="piece-lead-time"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Typical Lead Time
            </label>
            <input
              id="piece-lead-time"
              type="text"
              value={typicalLeadTime}
              onChange={(e) => setTypicalLeadTime(e.target.value)}
              placeholder="e.g. 8–10 weeks"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Reference Dimensions */}
          <div>
            <label
              htmlFor="piece-dimensions"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Reference Dimensions & Weight
            </label>
            <input
              id="piece-dimensions"
              type="text"
              value={referenceDimensions}
              onChange={(e) => setReferenceDimensions(e.target.value)}
              placeholder='e.g. 24" H x 18" W x 8" D (approx. 22 kg)'
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="piece-desc"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Masterwork Narrative & Agamic Iconography
            </label>
            <textarea
              id="piece-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cosmic dance of Shiva cast according to canonical Agamic Shilpa Shastra proportions..."
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
            />
          </div>
        </div>
      </div>

      {/* Form Fields Card 2: Casting & Finishes */}
      <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-heading font-medium text-heritage-cream tracking-wide uppercase text-xs border-b border-heritage-border pb-3">
          Casting Technique & Finish Options
        </h2>

        <div className="space-y-6">
          {/* Casting Technique */}
          <div>
            <label
              htmlFor="piece-technique"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Casting Technique Specification
            </label>
            <textarea
              id="piece-technique"
              rows={3}
              value={castingTechnique}
              onChange={(e) => setCastingTechnique(e.target.value)}
              placeholder="Traditional Madhuchishtavidhana (lost-wax casting) with alluvial clay mold and solid lost-wax core"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
            />
          </div>

          {/* Finish Options */}
          <div>
            <label
              htmlFor="piece-finishes"
              className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
            >
              Available Finish Options (comma separated)
            </label>
            <input
              id="piece-finishes"
              type="text"
              value={finishOptionsText}
              onChange={(e) => setFinishOptionsText(e.target.value)}
              placeholder="Antique Temple Patina, Polished Highlights, Verdant Patina"
              className="w-full bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Form Fields Card 3: Images */}
      <div className="bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-heading font-medium text-heritage-cream tracking-wide uppercase text-xs border-b border-heritage-border pb-3">
          Showcase Photography
        </h2>

        <div>
          <label
            htmlFor="piece-images"
            className="block text-xs font-medium uppercase tracking-wider text-heritage-cream/80 mb-2"
          >
            Image URLs (one per line)
          </label>
          <textarea
            id="piece-images"
            rows={4}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            placeholder="/images/portfolio/nataraja.jpg&#10;https://example.com/sanctum-arch-detail.jpg"
            className="w-full font-mono text-xs bg-heritage-dark/80 border border-heritage-border rounded-xl px-4 py-3 text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-heritage-border">
        <Link
          href="/admin/portfolio"
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
          <span>{isPending ? 'Saving...' : isEdit ? 'Update Piece' : 'Publish Piece'}</span>
        </button>
      </div>
    </form>
  );
}
