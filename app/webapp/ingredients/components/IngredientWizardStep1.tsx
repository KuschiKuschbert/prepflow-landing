'use client';

import { useEffect, useState } from 'react';
import { WizardStepProps } from './types';

export default function IngredientWizardStep1({
  formData,
  availableUnits,
  errors,
  onInputChange,
  onInputBlur,
  formatCost,
}: WizardStepProps) {
  // Local state for pack price input to allow free typing
  const [packPriceInput, setPackPriceInput] = useState<string>('');

  // Sync local state with formData when it changes externally
  useEffect(() => {
    if (formData.pack_price) {
      setPackPriceInput(String(formData.pack_price));
    } else {
      setPackPriceInput('');
    }
  }, [formData.pack_price]);
  // Calculate cost per pack unit
  const costPerPackUnit =
    formData.pack_price && formData.pack_size && parseFloat(formData.pack_size) > 0
      ? formData.pack_price / parseFloat(formData.pack_size)
      : 0;

  // Calculate cost per working unit (if different from pack unit)
  const costPerWorkingUnit = formData.cost_per_unit || 0;
  const packUnit = formData.pack_size_unit || '';
  const workingUnit = formData.unit || '';
  const unitsAreDifferent = packUnit && workingUnit && packUnit !== workingUnit;

  // Parse price input (remove commas and convert to number)
  const parsePriceInput = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/,/g, '').trim();
    return parseFloat(cleaned) || 0;
  };

  // Format price for display (add commas for thousands)
  const formatPriceDisplay = (value: string | number | undefined): string => {
    if (!value) return '';
    const numValue = typeof value === 'string' ? parsePriceInput(value) : value;
    if (numValue === 0) return '';
    // Format with commas for thousands, keep decimals
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Handle pack price change - allow free typing
  const handlePackPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow digits, commas, and decimal point - remove only invalid characters
    const validInput = inputValue.replace(/[^\d,.]/g, '');

    // Ensure only one decimal point
    const parts = validInput.split('.');
    const formattedInput = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : validInput;

    // Update local state for free typing
    setPackPriceInput(formattedInput);

    // Parse and store numeric value (commas are removed during parsing)
    const numericValue = parsePriceInput(formattedInput);
    onInputChange('pack_price', numericValue);
  };

  // Handle blur - format the display value
  const handlePackPriceBlur = () => {
    if (packPriceInput) {
      const numericValue = parsePriceInput(packPriceInput);
      // Format for display
      const formatted = formatPriceDisplay(numericValue);
      setPackPriceInput(formatted);
      // Ensure numeric value is stored
      if (numericValue !== formData.pack_price) {
        onInputChange('pack_price', numericValue);
      }
    }
  };
  return (
    <div className="tablet:grid-cols-2 large-desktop:grid-cols-5 grid grid-cols-1 gap-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
          Ingredient Name *
        </label>
        <input
          type="text"
          required
          value={formData.ingredient_name || ''}
          onChange={e => onInputChange('ingredient_name', e.target.value)}
          onBlur={e => onInputBlur?.('ingredient_name', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="e.g., Fresh Tomatoes"
        />
        {errors.ingredient_name && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{errors.ingredient_name}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
          Brand (Optional)
        </label>
        <input
          type="text"
          value={formData.brand || ''}
          onChange={e => onInputChange('brand', e.target.value)}
          onBlur={e => onInputBlur?.('brand', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="e.g., Coles, Woolworths"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
          Pack Size *
        </label>
        <input
          type="text"
          required
          value={formData.pack_size || ''}
          onChange={e => onInputChange('pack_size', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="e.g., 5"
        />
        {errors.pack_size && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{errors.pack_size}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
          Pack Unit *
        </label>
        <select
          required
          value={formData.pack_size_unit || ''}
          onChange={e => onInputChange('pack_size_unit', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        >
          <option value="">Select unit</option>
          {availableUnits.map(unit => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        {errors.pack_size_unit && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{errors.pack_size_unit}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
          Pack Price *
        </label>
        <input
          type="text"
          required
          value={packPriceInput}
          onChange={handlePackPriceChange}
          onBlur={handlePackPriceBlur}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="e.g., 12.99 or 1,234.56"
        />
        {errors.pack_price && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{errors.pack_price}</p>
        )}
        {formData.pack_price !== undefined &&
          formData.pack_price > 0 &&
          formData.pack_size &&
          parseFloat(formData.pack_size) > 0 &&
          formData.pack_size_unit && (
            <div className="mt-0.5 space-y-0.5">
              <p className="text-xs text-[var(--foreground-subtle)]">
                ${formatCost(costPerPackUnit)}/{packUnit}
              </p>
              {unitsAreDifferent && formData.unit && costPerWorkingUnit > 0 && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  = ${formatCost(costPerWorkingUnit)}/{workingUnit}
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
