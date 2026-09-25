'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Plus, Search, Sparkles } from 'lucide-react';
import type { PortfolioPiece } from '@/domain/types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PortfolioTableProps {
  initialPieces: PortfolioPiece[];
  onPieceDeleted?: (id: string) => void;
}

export function PortfolioTable({
  initialPieces,
  onPieceDeleted,
}: PortfolioTableProps) {
  const [pieces, setPieces] = useState<PortfolioPiece[]>(initialPieces);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PortfolioPiece | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredPieces = pieces.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.castingTechnique.toLowerCase().includes(q)
    );
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/portfolio/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete portfolio piece');
      }

      setPieces((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (onPieceDeleted) {
        onPieceDeleted(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      setActionError(err.message || 'Error deleting portfolio piece');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm">
          {actionError}
        </div>
      )}

      {/* Top Search & Create Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-heritage-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search portfolio by name, slug, or technique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-heritage-surface border border-heritage-border rounded-full pl-10 pr-4 py-2.5 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
          />
        </div>

        <Link
          href="/admin/portfolio/new"
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-heritage-cream text-heritage-dark px-6 py-2.5 text-sm font-medium hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px] shrink-0 font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>New Portfolio Piece</span>
        </Link>
      </div>

      {/* Empty State */}
      {filteredPieces.length === 0 ? (
        <div className="text-center py-16 px-4 bg-heritage-surface/60 border border-heritage-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-heritage-dark/60 border border-heritage-border flex items-center justify-center mx-auto mb-3 text-heritage-muted">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-medium text-heritage-cream">
            No portfolio pieces found
          </h3>
          <p className="text-xs text-heritage-muted mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No showcase pieces matched "${searchQuery}". Try a different search term.`
              : 'Your portfolio showcase is empty. Add a piece to display on /custom-work.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredPieces.map((piece) => (
              <div
                key={piece.id}
                className="bg-heritage-surface border border-heritage-border rounded-xl p-4 space-y-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-heritage-dark/80 border border-heritage-border shrink-0 relative">
                    {piece.images && piece.images[0] ? (
                      <Image
                        src={piece.images[0]}
                        alt={piece.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-heritage-muted text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-medium text-heritage-cream text-base truncate">
                      {piece.name}
                    </h4>
                    <p className="text-xs text-heritage-muted font-mono truncate mt-0.5">
                      /{piece.slug}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-200">
                        {piece.typicalLeadTime || 'Custom Lead Time'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-heritage-muted space-y-1">
                  <p>
                    <strong className="text-heritage-cream/90 font-medium">Dims:</strong>{' '}
                    {piece.referenceDimensions}
                  </p>
                  <p className="line-clamp-2">
                    <strong className="text-heritage-cream/90 font-medium">Casting:</strong>{' '}
                    {piece.castingTechnique}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-heritage-border/50">
                  <Link
                    href={`/admin/portfolio/${piece.id}/edit`}
                    className="tap-target flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-heritage-border bg-heritage-dark/50 text-heritage-cream text-xs font-medium hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(piece)}
                    className="tap-target inline-flex items-center justify-center gap-1.5 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-800/40 text-red-300 px-4 text-xs font-medium active:scale-[0.98] transition-all min-h-[44px]"
                    aria-label={`Delete portfolio piece ${piece.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-heritage-border bg-heritage-surface">
            <table className="w-full text-left text-sm text-heritage-cream">
              <thead className="bg-heritage-dark/60 text-xs uppercase tracking-wider text-heritage-muted border-b border-heritage-border">
                <tr>
                  <th scope="col" className="py-4 px-6">
                    Showcase Piece
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Slug
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Dimensions
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Lead Time
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Finishes
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border">
                {filteredPieces.map((piece) => (
                  <tr
                    key={piece.id}
                    className="hover:bg-heritage-cream/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-heritage-dark border border-heritage-border shrink-0 relative">
                          {piece.images && piece.images[0] ? (
                            <Image
                              src={piece.images[0]}
                              alt={piece.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-heritage-muted text-[10px]">
                              None
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-medium text-heritage-cream truncate max-w-xs">
                            {piece.name}
                          </p>
                          <p className="text-xs text-heritage-muted truncate max-w-xs">
                            {piece.castingTechnique}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-heritage-muted">
                      {piece.slug}
                    </td>
                    <td className="py-4 px-6 text-heritage-cream/90 text-xs">
                      {piece.referenceDimensions}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 border border-amber-800/40 text-amber-200">
                        {piece.typicalLeadTime}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {piece.finishOptions && piece.finishOptions.length > 0 ? (
                          piece.finishOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-heritage-dark/80 border border-heritage-border text-heritage-muted"
                            >
                              {opt}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-heritage-muted">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/portfolio/${piece.id}/edit`}
                          className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full text-heritage-muted hover:text-heritage-cream hover:bg-heritage-cream/10 transition-colors"
                          title="Edit portfolio piece"
                          aria-label={`Edit portfolio piece ${piece.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(piece)}
                          className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                          title="Delete portfolio piece"
                          aria-label={`Delete portfolio piece ${piece.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Safe Destructive Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Portfolio Piece"
        itemName={deleteTarget?.name || ''}
        itemType="Portfolio Piece"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
