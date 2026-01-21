'use client';

import { Icon } from '@/components/ui/Icon';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { Info } from 'lucide-react';
import { getStandardUnit } from '../utils/getStandardUnit';

import { ExistingIngredient as Ingredient } from './types';

interface IngredientTableCellProps {
  ingredient: Ingredient;
  displayUnit: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
};

export function IngredientNameCell({ ingredient }: { ingredient: Ingredient }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-[var(--foreground)]">
        {ingredient.ingredient_name}
      </div>
      {ingredient.product_code && (
        <div className="text-sm text-[var(--foreground-muted)]">{ingredient.product_code}</div>
      )}
    </td>
  );
}

export function IngredientBrandCell({
  ingredient,
  className,
}: {
  ingredient: Ingredient;
  className?: string;
}) {
  return (
    <td
      className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${className || ''}`}
    >
      {ingredient.brand || '-'}
    </td>
  );
}

export function IngredientPackSizeCell({
  ingredient,
  className,
}: {
  ingredient: Ingredient;
  className?: string;
}) {
  const packSizeUnit = ingredient.pack_size_unit || ingredient.unit || 'GM';
  const originalUnit = (ingredient as any).original_unit || packSizeUnit;
  const standardUnit = getStandardUnit(ingredient.unit, (ingredient as any).standard_unit);
  const showUnitTooltip = originalUnit && originalUnit !== standardUnit;

  return (
    <td
      className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${className || ''}`}
    >
      <div className="flex items-center gap-1">
        <span>
          {ingredient.pack_size != null ? `${ingredient.pack_size} ${packSizeUnit}` : '-'}
        </span>
        {showUnitTooltip && (
          <span
            className="cursor-help text-xs text-[var(--foreground-subtle)]"
            title={`Original unit: ${originalUnit}, Standard: ${standardUnit}`}
          >
            <Icon
              icon={Info}
              size="xs"
              className="text-[var(--foreground-subtle)]"
              aria-hidden={true}
            />
          </span>
        )}
      </div>
    </td>
  );
}

export function IngredientCostCell({ ingredient, displayUnit }: IngredientTableCellProps) {
  const standardUnit = getStandardUnit(ingredient.unit, (ingredient as any).standard_unit);
  const convertedCost = convertIngredientCost(
    ingredient.cost_per_unit || 0,
    standardUnit,
    displayUnit,
    1,
  );
  const originalUnit =
    (ingredient as any).original_unit || ingredient.pack_size_unit || ingredient.unit || 'GM';
  const showUnitTooltip = originalUnit && originalUnit !== standardUnit;

  return (
    <td className="px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)]">
      <div className="flex flex-col">
        <span>
          {formatCurrency(convertedCost)}/{displayUnit}
        </span>
        {showUnitTooltip && (
          <span className="text-xs text-[var(--foreground-subtle)]">(std: {standardUnit})</span>
        )}
      </div>
    </td>
  );
}

export function IngredientSupplierCell({
  ingredient,
  className,
}: {
  ingredient: Ingredient;
  className?: string;
}) {
  return (
    <td
      className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${className || ''}`}
    >
      {ingredient.supplier || '-'}
    </td>
  );
}

export function IngredientStockCell({
  ingredient,
  className,
}: {
  ingredient: Ingredient;
  className?: string;
}) {
  const isLowStock =
    ingredient.min_stock_level &&
    ingredient.current_stock &&
    ingredient.current_stock <= ingredient.min_stock_level;

  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className || ''}`}>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm ${isLowStock ? 'text-[var(--color-error)]' : 'text-[var(--foreground-secondary)]'}`}
        >
          {ingredient.current_stock != null ? String(ingredient.current_stock) : '0'}{' '}
          {ingredient.unit || ''}
        </span>
        {isLowStock && (
          <span className="inline-flex items-center rounded-full bg-red-900/20 px-2 py-1 text-xs font-medium text-[var(--color-error)]">
            Low Stock
          </span>
        )}
      </div>
    </td>
  );
}
