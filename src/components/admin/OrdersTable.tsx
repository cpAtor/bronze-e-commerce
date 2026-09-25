'use client';

import { useState } from 'react';
import { Truck, CheckCircle2, ExternalLink, Package } from 'lucide-react';
import type { Order } from '@/domain/types';
import { formatPaiseToInr } from '@/lib/utils';

interface OrdersTableProps {
  initialOrders: Order[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShipClick = (order: Order) => {
    setSelectedOrder(order);
    setTrackingUrl(order.courierTrackingUrl || 'https://bluedart.com/track?ref=BD' + Math.floor(100000 + Math.random() * 900000));
    setError(null);
  };

  const handleConfirmShipped = async () => {
    if (!selectedOrder) return;
    if (!trackingUrl.trim()) {
      setError('Courier tracking URL is required.');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courierTrackingUrl: trackingUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to mark order shipped');
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? data.order : o))
      );
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.message || 'Error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-heritage-surface/60 border border-heritage-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-heritage-dark/60 border border-heritage-border flex items-center justify-center mx-auto mb-3 text-heritage-muted">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-medium text-heritage-cream">
            No orders placed yet
          </h3>
          <p className="text-xs text-heritage-muted mt-1 max-w-sm mx-auto">
            When customers place orders on /shop, they will appear here for fulfillment and dispatch tracking.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-heritage-surface border border-heritage-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-heritage-cream">
                    {order.orderCode}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      order.status === 'Shipped'
                        ? 'bg-emerald-950/70 border border-emerald-800/40 text-emerald-300'
                        : 'bg-amber-950/70 border border-amber-800/40 text-amber-200'
                    }`}
                  >
                    {order.status === 'Shipped' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                    <span>{order.status}</span>
                  </span>
                </div>

                <div className="text-xs text-heritage-muted space-y-1">
                  <p>
                    <strong className="text-heritage-cream/90 font-medium">Customer:</strong>{' '}
                    {order.shippingAddress?.fullName} ({order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.state})
                  </p>
                  <p>
                    <strong className="text-heritage-cream/90 font-medium">Items:</strong>{' '}
                    {order.items?.length || 0} items &bull; Total: {formatPaiseToInr(order.totalPaise)}
                  </p>
                  {order.courierTrackingUrl && (
                    <p className="truncate">
                      <strong className="text-heritage-cream/90 font-medium">Tracking:</strong>{' '}
                      <a
                        href={order.courierTrackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 underline inline-flex items-center gap-1"
                      >
                        Track Shipment <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                  )}
                </div>

                {order.status === 'Ordered' && (
                  <button
                    type="button"
                    onClick={() => handleShipClick(order)}
                    className="tap-target w-full inline-flex items-center justify-center gap-2 rounded-full bg-heritage-cream text-heritage-dark text-xs font-semibold py-2.5 hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px]"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch & Add Courier Tracking</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-heritage-border bg-heritage-surface">
            <table className="w-full text-left text-sm text-heritage-cream">
              <thead className="bg-heritage-dark/60 text-xs uppercase tracking-wider text-heritage-muted border-b border-heritage-border">
                <tr>
                  <th scope="col" className="py-4 px-6">
                    Order Ref
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Recipient & Destination
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Items & Total
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Status
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    Fulfillment Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-heritage-cream/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-semibold">
                      {order.orderCode}
                    </td>
                    <td className="py-4 px-6 text-xs text-heritage-muted">
                      <p className="font-medium text-heritage-cream text-sm">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                        {order.shippingAddress?.postalCode}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-heritage-cream">
                        {formatPaiseToInr(order.totalPaise)}
                      </p>
                      <p className="text-xs text-heritage-muted">
                        {order.items?.length || 0} line items
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Shipped'
                            ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-300'
                            : 'bg-amber-950/60 border border-amber-800/40 text-amber-200'
                        }`}
                      >
                        {order.status === 'Shipped' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Truck className="w-3.5 h-3.5" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {order.status === 'Ordered' ? (
                        <button
                          type="button"
                          onClick={() => handleShipClick(order)}
                          className="tap-target inline-flex items-center gap-1.5 rounded-full bg-heritage-cream text-heritage-dark px-4 py-2 text-xs font-medium hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px]"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch Order</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-xs text-heritage-muted">
                          {order.courierTrackingUrl ? (
                            <a
                              href={order.courierTrackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tap-target inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 py-1 px-2"
                            >
                              <span>Tracking Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span>Shipped</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Mark Shipped Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-4">
            <h3 className="text-lg font-heading font-medium text-heritage-cream">
              Fulfill Order & Dispatch
            </h3>
            <p className="text-xs text-heritage-muted leading-relaxed">
              Dispatching Order <strong className="text-heritage-cream font-mono">{selectedOrder.orderCode}</strong> to{' '}
              {selectedOrder.shippingAddress?.fullName}. Please provide the courier tracking link.
            </p>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-800">
                {error}
              </p>
            )}

            <div>
              <label
                htmlFor="courier-url"
                className="block text-xs uppercase tracking-wider text-heritage-muted mb-1.5"
              >
                Courier Tracking URL
              </label>
              <input
                id="courier-url"
                type="url"
                required
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://bluedart.com/track?ref=BD123456"
                className="w-full bg-heritage-dark border border-heritage-border rounded-xl px-4 py-3 text-xs text-heritage-cream placeholder:text-heritage-muted focus:outline-none focus:border-heritage-cream min-h-[44px]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={isUpdating}
                className="tap-target rounded-full border border-heritage-border px-5 py-2.5 text-xs text-heritage-cream min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmShipped}
                disabled={isUpdating}
                className="tap-target rounded-full bg-heritage-cream text-heritage-dark px-6 py-2.5 text-xs font-semibold hover:bg-heritage-cream-hover active:scale-[0.98] transition-all min-h-[44px]"
              >
                {isUpdating ? 'Saving...' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
