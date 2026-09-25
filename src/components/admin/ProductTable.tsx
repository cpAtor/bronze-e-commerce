'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Plus, Search, PackageOpen } from 'lucide-react';
import type { PredefinedProduct } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ProductTableProps {
  initialProducts: PredefinedProduct[];
  onProductDeleted?: (id: string) => void;
}

export function ProductTable({
  initialProducts,
  onProductDeleted,
}: ProductTableProps) {
  const [products, setProducts] = useState<PredefinedProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PredefinedProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (onProductDeleted) {
        onProductDeleted(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      setActionError(err.message || 'Error deleting product');
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
            placeholder="Search products by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-heritage-surface border border-heritage-border rounded-full pl-10 pr-4 py-2.5 text-sm text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
          />
        </div>

        <Link
          href="/admin/products/new"
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-heritage-cream text-heritage-dark px-6 py-2.5 text-sm font-medium hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px] shrink-0 font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-heritage-surface/60 border border-heritage-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-heritage-dark/60 border border-heritage-border flex items-center justify-center mx-auto mb-3 text-heritage-muted">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-medium text-heritage-cream">
            No products found
          </h3>
          <p className="text-xs text-heritage-muted mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No products matched "${searchQuery}". Try a different search term.`
              : 'The product catalog is currently empty. Create your first product to showcase on /shop.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-heritage-surface border border-heritage-border rounded-xl p-4 space-y-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-heritage-dark/80 border border-heritage-border shrink-0 relative">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
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
                      {product.name}
                    </h4>
                    <p className="text-xs text-heritage-muted font-mono truncate mt-0.5">
                      /{product.slug}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-heritage-cream">
                        {formatPaiseToInr(product.pricePaise)}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          product.stockQuantity > 0
                            ? 'bg-emerald-950/70 border border-emerald-800/40 text-emerald-300'
                            : 'bg-red-950/70 border border-red-800/40 text-red-300'
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} in stock`
                          : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-heritage-border/50">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="tap-target flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-heritage-border bg-heritage-dark/50 text-heritage-cream text-xs font-medium hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    className="tap-target inline-flex items-center justify-center gap-1.5 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-800/40 text-red-300 px-4 text-xs font-medium active:scale-[0.98] transition-all min-h-[44px]"
                    aria-label={`Delete product ${product.name}`}
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
                    Product
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Slug
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Price (INR)
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Inventory
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Weight
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-heritage-cream/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-heritage-dark border border-heritage-border shrink-0 relative">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
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
                            {product.name}
                          </p>
                          <p className="text-xs text-heritage-muted truncate max-w-xs">
                            {product.dimensions || 'No dimensions set'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-heritage-muted">
                      {product.slug}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {formatPaiseToInr(product.pricePaise)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.stockQuantity > 0
                            ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-300'
                            : 'bg-red-950/60 border border-red-800/40 text-red-300'
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} in stock`
                          : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-heritage-muted">
                      {product.weight || '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full text-heritage-muted hover:text-heritage-cream hover:bg-heritage-cream/10 transition-colors"
                          title="Edit product"
                          aria-label={`Edit product ${product.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="tap-target inline-flex items-center justify-center w-11 h-11 rounded-full text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                          title="Delete product"
                          aria-label={`Delete product ${product.name}`}
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
        title="Delete Product"
        itemName={deleteTarget?.name || ''}
        itemType="Product"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
