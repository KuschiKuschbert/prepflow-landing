'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { MenuItem } from '../types';

interface MenuItemStatisticsModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  menuId: string;
  onClose: () => void;
  onUpdatePrice?: (itemId: string, price: number | null) => void;
}

interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
}

export function MenuItemStatisticsModal({
  isOpen,
  item,
  menuId,
  onClose,
  onUpdatePrice,
}: MenuItemStatisticsModalProps) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState('');

  const loadStatistics = useCallback(async () => {
    if (!item) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/menus/${menuId}/items/${item.id}/statistics`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('[MenuItemStatisticsModal] Failed to load statistics:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          menuId,
          itemId: item.id,
        });
        setError(
          response.status === 404
            ? 'Statistics endpoint not available. This may be a Next.js routing issue. Please restart the dev server and try again.'
            : errorData.error || errorData.message || 'Failed to load statistics',
        );
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setStatistics(result.statistics);
      } else {
        setError(result.error || result.message || 'Failed to load statistics');
      }
    } catch (err) {
      logger.error('Failed to load item statistics:', err);
      setError('Failed to load statistics. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [menuId, item]);

  useEffect(() => {
    if (isOpen && item) {
      loadStatistics();
      setPriceValue(
        item.actual_selling_price?.toFixed(2) || item.recommended_selling_price?.toFixed(2) || '',
      );
    } else {
      setStatistics(null);
      setError(null);
      setIsEditingPrice(false);
    }
  }, [isOpen, item, loadStatistics]);

  const handlePriceSave = async () => {
    if (!item) return;

    const numValue = parseFloat(priceValue);
    if (isNaN(numValue) || numValue < 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsEditingPrice(false);
    onUpdatePrice?.(item.id, numValue);

    // Reload statistics after price update
    setTimeout(() => {
      loadStatistics();
    }, 500);
  };

  const handlePriceCancel = () => {
    setIsEditingPrice(false);
    setPriceValue(
      item?.actual_selling_price?.toFixed(2) || item?.recommended_selling_price?.toFixed(2) || '',
    );
  };

  if (!isOpen || !item) return null;

  const isDish = !!item.dish_id;
  const isRecipe = !!item.recipe_id;
  const itemName = isDish
    ? item.dishes?.dish_name
    : isRecipe
      ? item.recipes?.recipe_name
      : 'Unknown Item';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-[#1f1f1f]/95 p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close modal"
          >
            <Icon icon={X} size="md" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">{itemName}</h2>
            <p className="mt-1 text-sm text-gray-400">
              {isDish ? 'Dish' : isRecipe ? 'Recipe' : 'Item'} Statistics
            </p>
          </div>

          {/* Loading State */}
          {loading && <div className="py-8 text-center text-gray-400">Loading statistics...</div>}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Statistics */}
          {statistics && !loading && (
            <div className="space-y-6">
              {/* Price Section */}
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                <h3 className="mb-4 text-lg font-semibold text-white">Pricing</h3>
                <div className="space-y-3">
                  {statistics.recommended_selling_price != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Recommended Price</span>
                      <span className="text-xs font-medium text-gray-300">
                        ${statistics.recommended_selling_price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Actual Price</span>
                    {isEditingPrice ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={priceValue}
                          onChange={e => setPriceValue(e.target.value)}
                          className="w-32 rounded border border-[#29E7CD] bg-[#1f1f1f] px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                          placeholder="0.00"
                          autoFocus
                        />
                        <button
                          onClick={handlePriceSave}
                          className="rounded-lg bg-[#29E7CD] px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-[#29E7CD]/80"
                        >
                          Save
                        </button>
                        <button
                          onClick={handlePriceCancel}
                          className="rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white">
                          {statistics.actual_selling_price != null
                            ? `$${statistics.actual_selling_price.toFixed(2)}`
                            : 'Not set'}
                        </span>
                        {onUpdatePrice && (
                          <button
                            onClick={() => setIsEditingPrice(true)}
                            className="rounded-lg px-2 py-1 text-xs text-[#29E7CD] transition-colors hover:bg-[#2a2a2a]"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3">
                    <span className="text-sm font-medium text-white">Selling Price Used</span>
                    <span className="text-lg font-bold text-[#29E7CD]">
                      ${statistics.selling_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost & Profit Section */}
              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-400">COGS</h3>
                  <p className="text-2xl font-bold text-white">${statistics.cogs.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-400">Gross Profit</h3>
                  <p
                    className={`text-2xl font-bold ${
                      statistics.gross_profit >= 0 ? 'text-[#29E7CD]' : 'text-red-400'
                    }`}
                  >
                    ${statistics.gross_profit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Margins Section */}
              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-400">Gross Profit Margin</h3>
                  <p
                    className={`text-2xl font-bold ${
                      statistics.gross_profit_margin >= 0 ? 'text-[#29E7CD]' : 'text-red-400'
                    }`}
                  >
                    {statistics.gross_profit_margin.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-400">Food Cost %</h3>
                  <p className="text-2xl font-bold text-white">
                    {statistics.food_cost_percent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
