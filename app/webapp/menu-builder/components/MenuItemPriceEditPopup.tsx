'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  // Get menu price priority: actual_selling_price > dish.selling_price (for dishes) > recommended_selling_price
  const getMenuPrice = (menuItem: MenuItem): number | null => {
    if (menuItem.actual_selling_price != null) {
      return menuItem.actual_selling_price;
    }
    // For dishes, check dish.selling_price before recommended
    if (menuItem.dish_id && menuItem.dishes?.selling_price != null) {
      // Handle both string and number types from database
      const price = menuItem.dishes.selling_price;
      return typeof price === 'string' ? parseFloat(price) : price;
    }
    // For recipes, only check recommended (recipes don't have selling_price)
    if (menuItem.recommended_selling_price != null) {
      return menuItem.recommended_selling_price;
    }
    return null;
  };

  useEffect(() => {
    if (isOpen && item) {
      logger.dev('[MenuItemPriceEditPopup] Popup opened', {
        itemId: item.id,
        itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
        actual_selling_price: item.actual_selling_price,
        dish_selling_price: item.dishes?.selling_price || null,
        recommended_selling_price: item.recommended_selling_price,
      });
      const menuPrice = getMenuPrice(item);
      setPriceValue(menuPrice?.toFixed(2) || '');
      setError(null);
      // Focus input after a short delay to ensure popup is rendered
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    } else if (!isOpen) {
      logger.dev('[MenuItemPriceEditPopup] Popup closed');
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
    if (!item) {
      logger.warn('[MenuItemPriceEditPopup] Save called but item is null');
      return;
    }

    const numValue = parseFloat(priceValue);
    if (isNaN(numValue) || numValue < 0) {
      setError('Please enter a valid price');
      return;
    }

    // Get the menu price (what's currently displayed/used)
    const currentMenuPrice = getMenuPrice(item);

    // If same as current menu price, clear actual price (use menu price)
    const priceToSave =
      currentMenuPrice != null && Math.abs(numValue - currentMenuPrice) < 0.01 ? null : numValue;

    logger.dev('[MenuItemPriceEditPopup] Saving price', {
      itemId: item.id,
      itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
      currentMenuPrice,
      newPrice: numValue,
      priceToSave,
      clearingPrice: priceToSave === null,
    });

    onSave(item.id, priceToSave);
    onClose();
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  // Validate decimal input (only numbers and one decimal point)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPriceValue(value);
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Increment/decrement by 0.01 on arrow keys
      e.preventDefault();
      const currentValue = parseFloat(priceValue) || 0;
      const step = 0.01;
      const newValue = e.key === 'ArrowUp' ? currentValue + step : Math.max(0, currentValue - step);
      setPriceValue(newValue.toFixed(2));
      setError(null);
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
            type="text"
            inputMode="decimal"
            value={priceValue}
            onChange={handleInputChange}
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
