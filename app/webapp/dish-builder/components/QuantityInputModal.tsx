'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Package } from 'lucide-react';

interface QuantityInputModalProps {
  isOpen: boolean;
  ingredientName: string;
  unit: string;
  defaultQuantity?: number;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export function QuantityInputModal({
  isOpen,
  ingredientName,
  unit,
  defaultQuantity = 1,
  onConfirm,
  onCancel,
}: QuantityInputModalProps) {
  const [quantity, setQuantity] = useState<string>(defaultQuantity.toString());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(defaultQuantity.toString());
      setError(null);
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, defaultQuantity]);

  const handleConfirm = () => {
    const numValue = parseFloat(quantity);

    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    if (numValue <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    onConfirm(numValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden={true}
      />

      {/* Dialog */}
      <div className="relative z-[65] w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div
          className="desktop:p-6 rounded-3xl bg-[var(--surface)]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          onKeyDown={handleKeyDown}
        >
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <Icon icon={Package} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
          </div>

          {/* Title */}
          <h2
            id="dialog-title"
            className="desktop:text-xl mb-2 text-center text-lg font-bold text-[var(--foreground)]"
          >
            Add Ingredient
          </h2>

          {/* Ingredient Name */}
          <p id="dialog-description" className="mb-4 text-center text-sm text-[var(--foreground-secondary)]">
            {ingredientName}
          </p>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Quantity</label>
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={e => {
                  setQuantity(e.target.value);
                  setError(null); // Clear error on input change
                }}
                placeholder="0.00"
                className={`flex-1 rounded-2xl border ${
                  error ? 'border-[var(--color-error)]' : 'border-[var(--border)]'
                } bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-gray-500 transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'error-message' : undefined}
              />
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-4 py-3 text-sm font-medium text-[var(--foreground-secondary)]">
                {unit}
              </div>
            </div>
            {error && (
              <p id="error-message" className="mt-2 text-sm text-[var(--color-error)]" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-4 py-3 font-semibold text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)]/60"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
