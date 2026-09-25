'use client';

import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: 'Product' | 'Portfolio Piece' | 'Item';
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  itemType = 'Item',
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={isDeleting ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-heritage-surface border border-heritage-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="tap-target absolute top-4 right-4 text-heritage-muted hover:text-heritage-cream transition-colors rounded-full"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="delete-dialog-title"
              className="text-lg font-heading font-medium text-heritage-cream"
            >
              {title}
            </h2>
            <p className="text-xs text-heritage-muted uppercase tracking-wider">
              Safe Destructive Action
            </p>
          </div>
        </div>

        <p className="text-sm text-heritage-cream/80 leading-relaxed mb-6">
          Are you sure you want to permanently delete the {itemType.toLowerCase()}{' '}
          <strong className="text-heritage-cream font-semibold break-words">
            &ldquo;{itemName}&rdquo;
          </strong>
          ? This change will immediately remove it from the live catalog and cannot be undone.
        </p>

        {/* Buttons with >= 44x44px tap targets and safe spacing */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="tap-target inline-flex items-center justify-center rounded-full border border-heritage-border bg-heritage-dark/40 px-6 py-3 text-sm font-medium text-heritage-cream hover:bg-heritage-cream/10 active:scale-[0.98] transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="tap-target inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white px-6 py-3 text-sm font-medium tracking-wide transition-all min-h-[44px] shadow-lg shadow-red-950/50"
          >
            {isDeleting ? 'Deleting...' : `Confirm Delete`}
          </button>
        </div>
      </div>
    </div>
  );
}
