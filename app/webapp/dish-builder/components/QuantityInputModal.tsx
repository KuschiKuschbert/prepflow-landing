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
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-[65] w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 desktop:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onKeyDown={handleKeyDown}
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <Icon
            icon={Package}
            size="lg"
            className="text-[#29E7CD]"
            aria-hidden={true}
          />
        </div>

        {/* Title */}
        <h2 id="dialog-title" className="mb-2 text-center text-lg desktop:text-xl font-bold text-white">
          Add Ingredient
        </h2>

        {/* Ingredient Name */}
        <p id="dialog-description" className="mb-4 text-center text-sm text-gray-300">
          {ingredientName}
        </p>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError(null); // Clear error on input change
              }}
              placeholder="0.00"
              className={`flex-1 rounded-2xl border ${
                error ? 'border-red-500' : 'border-[#2a2a2a]'
              } bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD] focus:outline-none focus:ring-2 focus:ring-[#29E7CD]/20`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'error-message' : undefined}
            />
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-sm font-medium text-gray-300">
              {unit}
            </div>
          </div>
          {error && (
            <p id="error-message" className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
