'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { MenuItem } from '@/lib/types/menu-builder';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

/**
 * Sub-component for individual statistics cards
 */
function StatCard({
  label,
  value,
  colorClass = 'text-[var(--foreground)]',
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <h3 className="mb-3 text-sm font-medium text-[var(--foreground-muted)]">{label}</h3>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

/**
 * Price editing and display section
 */
function PriceSection({
  statistics,
  isEditing,
  priceValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  hasUpdatePermission,
}: {
  statistics: ItemStatistics;
  isEditing: boolean;
  priceValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (val: string) => void;
  hasUpdatePermission: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Pricing</h3>
      <div className="space-y-3">
        {statistics.recommended_selling_price != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--foreground-muted)]">Recommended Price</span>
            <span className="text-xs font-medium text-[var(--foreground-secondary)]">
              ${statistics.recommended_selling_price.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--foreground-muted)]">Actual Price</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={priceValue}
                onChange={e => onChange(e.target.value)}
                className="w-32 rounded border border-[var(--primary)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                placeholder="0.00"
                autoFocus
              />
              <button
                onClick={onSave}
                className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-[var(--primary)]/80"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--foreground)]">
                {statistics.actual_selling_price != null
                  ? `$${statistics.actual_selling_price.toFixed(2)}`
                  : 'Not set'}
              </span>
              {hasUpdatePermission && (
                <button
                  onClick={onEdit}
                  className="rounded-lg px-2 py-1 text-xs text-[var(--primary)] transition-colors hover:bg-[var(--muted)]"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="text-sm font-medium text-[var(--foreground)]">Selling Price Used</span>
          <span className="text-lg font-bold text-[var(--primary)]">
            ${statistics.selling_price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
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
        setError(
          response.status === 404
            ? 'Statistics endpoint not available.'
            : errorData.error || errorData.message || 'Failed to load statistics',
        );
        setLoading(false);
        return;
      }
      const result = await response.json();
      if (result.success) setStatistics(result.statistics);
      else setError(result.error || result.message || 'Failed to load statistics');
    } catch (err) {
      logger.error('Failed to load item statistics:', err);
      setError('Failed to load statistics. Please check your connection.');
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
    setTimeout(() => loadStatistics(), 500);
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
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-[var(--surface)]/95 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close modal"
          >
            <Icon icon={X} size="md" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">{itemName}</h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {isDish ? 'Dish' : isRecipe ? 'Recipe' : 'Item'} Statistics
            </p>
          </div>

          {loading && (
            <div className="py-8 text-center text-[var(--foreground-muted)]">
              Loading statistics...
            </div>
          )}
          {error && !loading && (
            <div className="rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
              {error}
            </div>
          )}

          {statistics && !loading && (
            <div className="space-y-6">
              <PriceSection
                statistics={statistics}
                isEditing={isEditingPrice}
                priceValue={priceValue}
                onEdit={() => setIsEditingPrice(true)}
                onSave={handlePriceSave}
                onCancel={() => {
                  setIsEditingPrice(false);
                  setPriceValue(item.actual_selling_price?.toFixed(2) || '');
                }}
                onChange={setPriceValue}
                hasUpdatePermission={!!onUpdatePrice}
              />

              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
                <StatCard label="COGS" value={`$${statistics.cogs.toFixed(2)}`} />
                <StatCard
                  label="Gross Profit"
                  value={`$${statistics.gross_profit.toFixed(2)}`}
                  colorClass={
                    statistics.gross_profit >= 0
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--color-error)]'
                  }
                />
              </div>

              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
                <StatCard
                  label="Gross Profit Margin"
                  value={`${statistics.gross_profit_margin.toFixed(1)}%`}
                  colorClass={
                    statistics.gross_profit_margin >= 0
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--color-error)]'
                  }
                />
                <StatCard
                  label="Food Cost %"
                  value={`${statistics.food_cost_percent.toFixed(1)}%`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
