'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { MenuItem } from '../types';

interface MenuItemPriceEditPopupProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, price: number | null) => void;
}

export function MenuItemPriceEditPopup({
  item,
  isOpen,
  onClose,
  onSave,
}: MenuItemPriceEditPopupProps) {
  const [priceValue, setPriceValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      setPriceValue(
        item.actual_selling_price?.toFixed(2) || item.recommended_selling_price?.toFixed(2) || '',
      );
      setError(null);
      // Focus input after a short delay to ensure popup is rendered
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, item]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!item) return;

    const numValue = parseFloat(priceValue);
    if (isNaN(numValue) || numValue < 0) {
      setError('Please enter a valid price');
      return;
    }

    const recommendedPrice = item.recommended_selling_price ?? item.dishes?.selling_price ?? 0;
    // If same as recommended, clear actual price (use recommended)
    if (Math.abs(numValue - recommendedPrice) < 0.01 && item.recommended_selling_price != null) {
      onSave(item.id, null);
    } else {
      onSave(item.id, numValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen || !item) return null;

  const isRecipe = !!item.recipe_id;
  const itemName = item.dishes?.dish_name || item.recipes?.recipe_name || 'Unknown Item';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4">
      <div
        ref={popupRef}
        className="relative w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Close"
        >
          <Icon icon={X} size="sm" />
        </button>

        <h3 className="mb-4 text-lg font-semibold text-white">Edit Price: {itemName}</h3>

        {item.recommended_selling_price != null && (
          <div className="mb-3 text-xs text-gray-400">
            Recommended: ${item.recommended_selling_price.toFixed(2)}
            {isRecipe && ' per serve'}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-400">
            Actual Selling Price{isRecipe && ' (per serve)'}
          </label>
          <input
            ref={inputRef}
            type="number"
            step="0.01"
            min="0"
            value={priceValue}
            onChange={e => {
              setPriceValue(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="0.00"
          />
          {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-black transition-all hover:shadow-lg"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-[#3a3a3a]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
