'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { CommissionInquiry } from '@/domain/types';
import { ADMIN_CONFIG } from '@/lib/config';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CommissionConfirmationProps {
  inquiry: CommissionInquiry;
}

export function CommissionConfirmation({ inquiry }: CommissionConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    `Namaskaram! I have submitted Commission Inquiry ${inquiry.commissionCode} for a bespoke ${inquiry.itemType} (${inquiry.dimensions}). Please connect with me regarding iconography and casting schedule.`
  );
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

  const emailSubject = encodeURIComponent(
    `Commission Inquiry ${inquiry.commissionCode} - ${inquiry.itemType}`
  );
  const emailBody = encodeURIComponent(
    `Namaskaram Sthapati,\n\nI have submitted Commission Inquiry ${inquiry.commissionCode}.\n\nDetails:\n- Item Type: ${inquiry.itemType}\n- Deity / Iconography: ${inquiry.deityIconography}\n- Dimensions: ${inquiry.dimensions}\n- Finish Preference: ${inquiry.finishPreference}\n- Target Date: ${inquiry.targetDate}\n- Callback Phone: ${inquiry.phoneNumber}\n\nPlease review and reach out.\n`
  );
  const emailLink = `mailto:${ADMIN_CONFIG.email}?subject=${emailSubject}&body=${emailBody}`;
  const phoneLink = `tel:${ADMIN_CONFIG.phone}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(inquiry.commissionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 shadow-2xl">
      {/* Top Banner */}
      <div className="text-center pb-6 border-b border-heritage-border/70">
        <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium">
          Inquiry Successfully Recorded
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-heritage-cream mt-1">
          Bespoke Sanctum Commission
        </h2>
        <p className="mt-2 text-sm text-heritage-cream/75 max-w-lg mx-auto font-light leading-relaxed">
          The Master Sthapati will review your sacred iconography specifications and initiate a consultation callback within 24 hours.
        </p>
      </div>

      {/* Commission Code Highlight Box */}
      <div className="my-6 bg-heritage-dark/90 border border-heritage-border/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-heritage-muted block">
            Official Commission Reference Code
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-heritage-cream">
            {inquiry.commissionCode}
          </span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="button-secondary text-xs py-2.5 px-4 min-h-[44px] min-w-[120px] flex items-center justify-center gap-2"
          aria-label="Copy commission reference code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-heritage-muted" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Callback Timeline Notice */}
      <div className="mb-6 p-4 rounded-xl bg-heritage-moss/30 border border-heritage-border/40 flex items-start gap-3">
        <Clock className="w-5 h-5 text-heritage-cream shrink-0 mt-0.5" />
        <div className="text-xs text-heritage-cream/90 leading-relaxed font-light">
          <strong className="font-semibold text-heritage-cream">Callback Scheduled:</strong>{' '}
          Our artisan workshop will contact you directly at{' '}
          <span className="font-mono font-medium text-heritage-cream">{inquiry.phoneNumber}</span>{' '}
          within 24 hours to discuss clay modeling, auspicious casting muhurtham, and alloy composition.
        </div>
      </div>

      {/* Submitted Specs Summary */}
      <div className="mb-6 rounded-xl border border-heritage-border/60 bg-heritage-dark/40 divide-y divide-heritage-border/40 text-xs">
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Item Category</span>
          <span className="font-medium text-heritage-cream text-right">{inquiry.itemType}</span>
        </div>
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Deity & Iconography</span>
          <span className="font-medium text-heritage-cream text-right max-w-xs">{inquiry.deityIconography}</span>
        </div>
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Target Scale / Dimensions</span>
          <span className="font-mono text-heritage-cream text-right">{inquiry.dimensions}</span>
        </div>
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Finish Preference</span>
          <span className="font-medium text-heritage-cream text-right">{inquiry.finishPreference}</span>
        </div>
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Target Delivery Date</span>
          <span className="font-mono text-heritage-cream text-right">{inquiry.targetDate}</span>
        </div>
        <div className="p-3.5 flex justify-between gap-4">
          <span className="text-heritage-muted">Callback Phone</span>
          <span className="font-mono text-heritage-cream text-right">{inquiry.phoneNumber}</span>
        </div>
      </div>

      {/* 1-Click Direct Artisan Communication */}
      <div className="pt-2">
        <h4 className="text-xs uppercase tracking-widest text-heritage-muted mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Instant 1-Click Consultation</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary text-xs py-3 min-h-[44px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
            aria-label="Direct WhatsApp message to Master Sthapati"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href={emailLink}
            className="button-secondary text-xs py-3 min-h-[44px] flex items-center justify-center gap-2"
            aria-label="Send Email with commission reference"
          >
            <Mail className="w-4 h-4 text-heritage-muted" />
            <span>Email Spec</span>
          </a>

          <a
            href={phoneLink}
            className="button-secondary text-xs py-3 min-h-[44px] flex items-center justify-center gap-2"
            aria-label="Call artisan directly"
          >
            <Phone className="w-4 h-4 text-heritage-muted" />
            <span>Call Sthapati</span>
          </a>
        </div>
      </div>

      {/* Return Links */}
      <div className="mt-8 pt-6 border-t border-heritage-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <Link
          href="/custom-work"
          className="text-heritage-cream/80 hover:text-heritage-cream transition-colors min-h-[44px] flex items-center"
        >
          ← Return to Portfolio Showcase
        </Link>
        <Link
          href="/shop"
          className="button-secondary text-xs min-h-[44px] flex items-center gap-1.5 px-5"
        >
          <span>Explore Available Wares</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
