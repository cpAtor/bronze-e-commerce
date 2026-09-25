'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Sparkles, ShoppingCart, MessageSquare, Download, Upload, Plus } from 'lucide-react';
import type { PredefinedProduct, PortfolioPiece, Order, CommissionInquiry } from '@/domain/types';
import { AdminNav } from './AdminNav';
import { AdminTabs, type AdminTabKey } from './AdminTabs';
import { ProductTable } from './ProductTable';
import { PortfolioTable } from './PortfolioTable';
import { OrdersTable } from './OrdersTable';
import { InquiriesTable } from './InquiriesTable';

interface AdminDashboardProps {
  initialProducts: PredefinedProduct[];
  initialPortfolio: PortfolioPiece[];
  initialOrders: Order[];
  initialInquiries: CommissionInquiry[];
  defaultTab?: AdminTabKey;
}

export function AdminDashboard({
  initialProducts,
  initialPortfolio,
  initialOrders,
  initialInquiries,
  defaultTab = 'products',
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTabKey>(defaultTab);
  const [products, setProducts] = useState<PredefinedProduct[]>(initialProducts);
  const [portfolio, setPortfolio] = useState<PortfolioPiece[]>(initialPortfolio);
  const [orders] = useState<Order[]>(initialOrders);
  const [inquiries] = useState<CommissionInquiry[]>(initialInquiries);

  const [snapshotStatus, setSnapshotStatus] = useState<string | null>(null);

  const handleExportSnapshot = async () => {
    try {
      setSnapshotStatus('Exporting repository snapshot...');
      const res = await fetch('/api/admin/snapshot');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to export');
      }

      // Download file to browser
      const blob = new Blob([JSON.stringify(data.snapshot, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bronze-storefront-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSnapshotStatus('Snapshot downloaded successfully!');
      setTimeout(() => setSnapshotStatus(null), 3000);
    } catch (err: any) {
      setSnapshotStatus(`Export error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab={activeTab} />
      <AdminTabs
        activeTab={activeTab}
        counts={{
          products: products.length,
          portfolio: portfolio.length,
          orders: orders.length,
          inquiries: inquiries.length,
        }}
        onSelectTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Products */}
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`w-full text-left p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between min-h-[110px] ${
              activeTab === 'products'
                ? 'bg-heritage-surface border-heritage-cream/40 ring-1 ring-heritage-cream/30'
                : 'bg-heritage-surface/60 border-heritage-border hover:bg-heritage-surface'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase tracking-wider text-heritage-muted font-medium">
                Catalog Wares
              </span>
              <div className="w-8 h-8 rounded-full bg-heritage-dark/80 border border-heritage-border flex items-center justify-center text-heritage-cream shrink-0">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-heading font-semibold text-heritage-cream">
                {products.length}
              </p>
              <p className="text-[11px] text-heritage-muted mt-0.5">
                Active predefined items
              </p>
            </div>
          </button>

          {/* Card 2: Portfolio */}
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`w-full text-left p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between min-h-[110px] ${
              activeTab === 'portfolio'
                ? 'bg-heritage-surface border-heritage-cream/40 ring-1 ring-heritage-cream/30'
                : 'bg-heritage-surface/60 border-heritage-border hover:bg-heritage-surface'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase tracking-wider text-heritage-muted font-medium">
                Masterworks
              </span>
              <div className="w-8 h-8 rounded-full bg-heritage-dark/80 border border-heritage-border flex items-center justify-center text-heritage-cream shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-heading font-semibold text-heritage-cream">
                {portfolio.length}
              </p>
              <p className="text-[11px] text-heritage-muted mt-0.5">
                Custom showcase pieces
              </p>
            </div>
          </button>

          {/* Card 3: Orders */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between min-h-[110px] ${
              activeTab === 'orders'
                ? 'bg-heritage-surface border-heritage-cream/40 ring-1 ring-heritage-cream/30'
                : 'bg-heritage-surface/60 border-heritage-border hover:bg-heritage-surface'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase tracking-wider text-heritage-muted font-medium">
                Orders
              </span>
              <div className="w-8 h-8 rounded-full bg-heritage-dark/80 border border-heritage-border flex items-center justify-center text-heritage-cream shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-heading font-semibold text-heritage-cream">
                {orders.length}
              </p>
              <p className="text-[11px] text-heritage-muted mt-0.5">
                {orders.filter((o) => o.status === 'Ordered').length} awaiting dispatch
              </p>
            </div>
          </button>

          {/* Card 4: Inquiries */}
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between min-h-[110px] ${
              activeTab === 'inquiries'
                ? 'bg-heritage-surface border-heritage-cream/40 ring-1 ring-heritage-cream/30'
                : 'bg-heritage-surface/60 border-heritage-border hover:bg-heritage-surface'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase tracking-wider text-heritage-muted font-medium">
                Inquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-heritage-dark/80 border border-heritage-border flex items-center justify-center text-heritage-cream shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-heading font-semibold text-heritage-cream">
                {inquiries.length}
              </p>
              <p className="text-[11px] text-heritage-muted mt-0.5">
                Bespoke idol callbacks
              </p>
            </div>
          </button>
        </div>

        {/* Tab Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-heritage-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-heritage-cream">
              {activeTab === 'products' && 'Predefined Products Catalog'}
              {activeTab === 'portfolio' && 'Custom Portfolio Showcase'}
              {activeTab === 'orders' && 'Order Management & Shipping'}
              {activeTab === 'inquiries' && 'Sanctum Commission Inquiries'}
            </h2>
            <p className="text-xs text-heritage-muted mt-1">
              {activeTab === 'products' &&
                'All updates immediately reflect across customer catalog pages (/shop and /shop/[slug]).'}
              {activeTab === 'portfolio' &&
                'Manage masterwork dimensions, casting notes, and finishes for /custom-work.'}
              {activeTab === 'orders' &&
                'Track retail orders, update courier URLs, and communicate with customers.'}
              {activeTab === 'inquiries' &&
                'Review devotee iconographic requirements and initiate telephone or WhatsApp callbacks.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSnapshot}
              className="tap-target inline-flex items-center gap-1.5 text-xs text-heritage-muted hover:text-heritage-cream border border-heritage-border rounded-full px-3.5 py-2 hover:bg-heritage-cream/10 transition-colors min-h-[44px]"
              title="Export complete store snapshot JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Snapshot</span>
            </button>
          </div>
        </div>

        {snapshotStatus && (
          <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-800 text-amber-200 text-xs">
            {snapshotStatus}
          </div>
        )}

        {/* Tab View Render */}
        <section aria-label="Tab View Content">
          {activeTab === 'products' && (
            <ProductTable
              initialProducts={products}
              onProductDeleted={(id) =>
                setProducts((prev) => prev.filter((p) => p.id !== id))
              }
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioTable
              initialPieces={portfolio}
              onPieceDeleted={(id) =>
                setPortfolio((prev) => prev.filter((p) => p.id !== id))
              }
            />
          )}

          {activeTab === 'orders' && <OrdersTable initialOrders={orders} />}

          {activeTab === 'inquiries' && (
            <InquiriesTable initialInquiries={inquiries} />
          )}
        </section>
      </main>
    </div>
  );
}
