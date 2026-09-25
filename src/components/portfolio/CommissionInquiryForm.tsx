'use client';

import React, { useState } from 'react';
import type { PortfolioPiece, CommissionInquiry } from '@/domain/types';
import { CommissionConfirmation } from './CommissionConfirmation';
import { Sparkles, Phone, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CommissionInquiryFormProps {
  initialPiece?: PortfolioPiece | null;
}

export function CommissionInquiryForm({ initialPiece }: CommissionInquiryFormProps) {
  const [submittedInquiry, setSubmittedInquiry] =
    useState<CommissionInquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [itemType, setItemType] = useState(
    initialPiece ? initialPiece.name : 'Deity Idol / Murti'
  );
  const [deityIconography, setDeityIconography] = useState(
    initialPiece
      ? `Inspired by masterwork "${initialPiece.name}". Please advise on similar Agamic casting.`
      : ''
  );
  const [dimensions, setDimensions] = useState(
    initialPiece ? initialPiece.referenceDimensions : ''
  );
  const [finishPreference, setFinishPreference] = useState(
    initialPiece && initialPiece.finishOptions[0]
      ? initialPiece.finishOptions[0]
      : 'Antique Temple Patina'
  );
  const [targetDate, setTargetDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber =
        'Callback phone number is required for the artisan consultation.';
    } else if (phoneNumber.trim().length < 8) {
      newErrors.phoneNumber = 'Please enter a valid phone number (min 8 digits).';
    }

    if (!itemType.trim()) {
      newErrors.itemType = 'Please select or specify an item category.';
    }

    if (!deityIconography.trim()) {
      newErrors.deityIconography =
        'Iconography notes are required so the Sthapati can understand your sacred requirements.';
    }

    if (!dimensions.trim()) {
      newErrors.dimensions =
        'Target dimensions or approximate scale are required.';
    }

    if (!finishPreference.trim()) {
      newErrors.finishPreference = 'Please select a preferred bronze finish.';
    }

    if (!targetDate.trim()) {
      newErrors.targetDate =
        'Target delivery or consecration date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          itemType: itemType.trim(),
          deityIconography: deityIconography.trim(),
          dimensions: dimensions.trim(),
          finishPreference: finishPreference.trim(),
          targetDate: targetDate.trim(),
          customerName: customerName.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          inspiredByPortfolioId: initialPiece?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit commission inquiry');
      }

      setSubmittedInquiry(data.inquiry);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedInquiry) {
    return <CommissionConfirmation inquiry={submittedInquiry} />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="pb-6 border-b border-heritage-border/70">
        <span className="text-xs uppercase tracking-widest text-heritage-muted flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bespoke Agamic Casting</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-heritage-cream mt-1">
          Commission Custom Temple Bronze
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-heritage-cream/75 leading-relaxed font-light">
          Share your iconography preferences, sanctum dimensions, and finish requirements. Our master Sthapati will review your notes and initiate a direct consultation.
        </p>
      </div>

      {/* Inspiration piece banner */}
      {initialPiece && (
        <div className="mt-6 p-4 rounded-xl bg-heritage-dark/80 border border-heritage-border flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-heritage-border/60">
            <Image
              src={initialPiece.images[0] || '/images/portfolio/nataraja.jpg'}
              alt={initialPiece.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-heritage-muted block">
              Inquiring with Inspiration from:
            </span>
            <h4 className="text-sm font-medium text-heritage-cream truncate">
              {initialPiece.name}
            </h4>
            <p className="text-xs font-mono text-heritage-cream/70 mt-0.5 truncate">
              Ref: {initialPiece.referenceDimensions}
            </p>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Inquiry Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        {/* Callback Phone Number (MANDATORY) */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Callback Phone Number <span className="text-amber-400">*</span></span>
            </span>
            <span className="text-[11px] text-heritage-muted lowercase font-normal">
              for artisan consultation
            </span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
            }}
            placeholder="+91 98765 43210"
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border ${
              errors.phoneNumber ? 'border-red-400 focus:border-red-400' : 'border-heritage-border focus:border-heritage-cream'
            } text-heritage-cream text-sm placeholder:text-heritage-subtle focus:outline-none transition-colors`}
          />
          {errors.phoneNumber && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phoneNumber}</span>
            </p>
          )}
        </div>

        {/* Item Type */}
        <div>
          <label
            htmlFor="itemType"
            className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
          >
            Item Category / Work Type <span className="text-amber-400">*</span>
          </label>
          <select
            id="itemType"
            value={itemType}
            onChange={(e) => {
              setItemType(e.target.value);
              if (errors.itemType) setErrors((prev) => ({ ...prev, itemType: '' }));
            }}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border ${
              errors.itemType ? 'border-red-400' : 'border-heritage-border focus:border-heritage-cream'
            } text-heritage-cream text-sm focus:outline-none transition-colors`}
          >
            <option value="Deity Idol / Murti">Deity Idol / Sanctum Murti</option>
            <option value="Temple Prabhavali Arch">Temple Prabhavali Arch (Aureole)</option>
            <option value="Ritual Deepastambha Lamp">Ritual Deepastambha Lamp</option>
            <option value="Temple Bell / Kalasham">Temple Bell / Vimana Kalasham</option>
            <option value="Vigraha Armor / Kavacham">Vigraha Armor / Deity Kavacham</option>
            <option value="Other Bespoke Work">Other Bespoke Sanctum Work</option>
          </select>
          {errors.itemType && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.itemType}</span>
            </p>
          )}
        </div>

        {/* Deity Iconography & Specifications */}
        <div>
          <label
            htmlFor="deityIconography"
            className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
          >
            Deity & Iconography Notes <span className="text-amber-400">*</span>
          </label>
          <textarea
            id="deityIconography"
            rows={4}
            required
            value={deityIconography}
            onChange={(e) => {
              setDeityIconography(e.target.value);
              if (errors.deityIconography) setErrors((prev) => ({ ...prev, deityIconography: '' }));
            }}
            placeholder="Describe the sacred deity, posture (e.g. Tribhanga, Ananda Tandava, Samabhanga), mudras, ayuddhas (weapons), and temple tradition..."
            className={`w-full p-4 rounded-xl bg-heritage-dark border ${
              errors.deityIconography ? 'border-red-400 focus:border-red-400' : 'border-heritage-border focus:border-heritage-cream'
            } text-heritage-cream text-sm placeholder:text-heritage-subtle focus:outline-none transition-colors leading-relaxed`}
          />
          {errors.deityIconography && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.deityIconography}</span>
            </p>
          )}
        </div>

        {/* Dimensions & Scale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dimensions"
              className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
            >
              Target Dimensions / Scale <span className="text-amber-400">*</span>
            </label>
            <input
              id="dimensions"
              type="text"
              required
              value={dimensions}
              onChange={(e) => {
                setDimensions(e.target.value);
                if (errors.dimensions) setErrors((prev) => ({ ...prev, dimensions: '' }));
              }}
              placeholder='e.g. 24" H x 18" W (approx. 20 kg)'
              className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border ${
                errors.dimensions ? 'border-red-400 focus:border-red-400' : 'border-heritage-border focus:border-heritage-cream'
              } text-heritage-cream text-sm placeholder:text-heritage-subtle focus:outline-none transition-colors font-mono`}
            />
            {errors.dimensions && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.dimensions}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="finishPreference"
              className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
            >
              Finish Preference <span className="text-amber-400">*</span>
            </label>
            <select
              id="finishPreference"
              value={finishPreference}
              onChange={(e) => {
                setFinishPreference(e.target.value);
                if (errors.finishPreference) setErrors((prev) => ({ ...prev, finishPreference: '' }));
              }}
              className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border ${
                errors.finishPreference ? 'border-red-400' : 'border-heritage-border focus:border-heritage-cream'
              } text-heritage-cream text-sm focus:outline-none transition-colors`}
            >
              <option value="Antique Temple Patina">Antique Temple Patina (Traditional Dark)</option>
              <option value="Polished Bronze Highlights">Polished Bronze Highlights</option>
              <option value="Deep Verdant Patina">Deep Verdant Patina (Green/Verdigris)</option>
              <option value="Sacred Gold Finish">Sacred Gold Leaf / Gilded Accents</option>
              <option value="Natural Warm Bronze">Natural Warm Bronze</option>
              <option value="Mirror Polish">Mirror Polish (Temple Bell Luster)</option>
            </select>
            {errors.finishPreference && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.finishPreference}</span>
              </p>
            )}
          </div>
        </div>

        {/* Target Date & Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="targetDate"
              className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
            >
              Target Delivery / Consecration Date <span className="text-amber-400">*</span>
            </label>
            <input
              id="targetDate"
              type="date"
              required
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                if (errors.targetDate) setErrors((prev) => ({ ...prev, targetDate: '' }));
              }}
              className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border ${
                errors.targetDate ? 'border-red-400 focus:border-red-400' : 'border-heritage-border focus:border-heritage-cream'
              } text-heritage-cream text-sm focus:outline-none transition-colors`}
            />
            {errors.targetDate && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.targetDate}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customerName"
              className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
            >
              Your Name / Temple Trust <span className="text-heritage-muted lowercase font-normal">(optional)</span>
            </label>
            <input
              id="customerName"
              type="text"
              autoComplete="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sri Meenakshi Temple Trust"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border border-heritage-border text-heritage-cream text-sm placeholder:text-heritage-subtle focus:outline-none focus:border-heritage-cream transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="customerEmail"
            className="block text-xs uppercase tracking-wider font-medium text-heritage-cream mb-1.5"
          >
            Email Address <span className="text-heritage-muted lowercase font-normal">(optional, for documentation copy)</span>
          </label>
          <input
            id="customerEmail"
            type="email"
            autoComplete="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="trustee@temple.org"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-dark border border-heritage-border text-heritage-cream text-sm placeholder:text-heritage-subtle focus:outline-none focus:border-heritage-cream transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="button-primary w-full min-h-[44px] py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Commission Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Sacred Commission Inquiry</span>
              </>
            )}
          </button>
          <p className="mt-2 text-center text-[11px] text-heritage-muted">
            Generating official COM-XXXX reference code with 24h consultation follow-up.
          </p>
        </div>
      </form>
    </div>
  );
}
