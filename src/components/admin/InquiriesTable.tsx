'use client';

import { Phone, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import type { CommissionInquiry } from '@/domain/types';

interface InquiriesTableProps {
  initialInquiries: CommissionInquiry[];
}

export function InquiriesTable({ initialInquiries }: InquiriesTableProps) {
  return (
    <div className="space-y-6">
      {initialInquiries.length === 0 ? (
        <div className="text-center py-16 px-4 bg-heritage-surface/60 border border-heritage-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-heritage-dark/60 border border-heritage-border flex items-center justify-center mx-auto mb-3 text-heritage-muted">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-medium text-heritage-cream">
            No commission inquiries received yet
          </h3>
          <p className="text-xs text-heritage-muted mt-1 max-w-sm mx-auto">
            Bespoke idol and temple commission inquiries submitted via /custom-work/inquire will appear here for craftsman review.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {initialInquiries.map((inq) => {
              const cleanPhone = inq.phoneNumber.replace(/[^0-9+]/g, '');
              const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                `Namaskaram, this is the Sthapati regarding your Commission Inquiry ${inq.commissionCode}.`
              )}`;

              return (
                <div
                  key={inq.id}
                  className="bg-heritage-surface border border-heritage-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-heritage-cream">
                      {inq.commissionCode}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-200">
                      {inq.itemType}
                    </span>
                  </div>

                  <div className="text-xs text-heritage-muted space-y-1.5">
                    <p>
                      <strong className="text-heritage-cream/90 font-medium">Deity / Iconography:</strong>{' '}
                      {inq.deityIconography}
                    </p>
                    <p>
                      <strong className="text-heritage-cream/90 font-medium">Target Dims:</strong>{' '}
                      {inq.dimensions} &bull; <strong className="text-heritage-cream/90 font-medium">Finish:</strong>{' '}
                      {inq.finishPreference}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-heritage-muted" />
                      <span>Target Date: {inq.targetDate || 'Flexible'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-heritage-border/50">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="tap-target flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-heritage-border bg-heritage-dark/50 text-heritage-cream text-xs font-medium hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call {inq.phoneNumber}</span>
                    </a>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 text-xs font-semibold active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-heritage-border bg-heritage-surface">
            <table className="w-full text-left text-sm text-heritage-cream">
              <thead className="bg-heritage-dark/60 text-xs uppercase tracking-wider text-heritage-muted border-b border-heritage-border">
                <tr>
                  <th scope="col" className="py-4 px-6">
                    Inquiry Code
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Item Type & Iconography
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Dimensions & Finish
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Target Date
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    Customer Callback Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border">
                {initialInquiries.map((inq) => {
                  const cleanPhone = inq.phoneNumber.replace(/[^0-9+]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                    `Namaskaram, this is the Sthapati regarding your Commission Inquiry ${inq.commissionCode}.`
                  )}`;

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-heritage-cream/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-semibold">
                        {inq.commissionCode}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-heritage-cream">
                          {inq.itemType}
                        </p>
                        <p className="text-xs text-heritage-muted truncate max-w-xs">
                          {inq.deityIconography}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-xs text-heritage-muted">
                        <p className="font-medium text-heritage-cream">
                          {inq.dimensions}
                        </p>
                        <p>{inq.finishPreference}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-heritage-muted">
                        {inq.targetDate || 'Flexible'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="tap-target inline-flex items-center gap-1.5 rounded-full border border-heritage-border px-3.5 py-1.5 text-xs text-heritage-cream hover:bg-heritage-cream/10 transition-colors min-h-[44px]"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{inq.phoneNumber}</span>
                          </a>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tap-target inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-medium transition-colors min-h-[44px]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
