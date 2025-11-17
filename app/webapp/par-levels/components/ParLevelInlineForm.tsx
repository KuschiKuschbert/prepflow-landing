'use client';

import React, { useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import type { Ingredient } from '../types';

interface ParLevelInlineFormProps {
  formData: {
    ingredientId: string;
    parLevel: string;
    reorderPointPercentage: string;
    unit: string;
  };
  ingredients: Ingredient[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (field: string, value: string) => void;
}

export function ParLevelInlineForm({
  formData,
  ingredients,
  onClose,
  onSubmit,
  onFormDataChange,
}: ParLevelInlineFormProps) {
  const { t } = useTranslation();

  // Auto-populate unit when ingredient is selected
  useEffect(() => {
    if (formData.ingredientId && !formData.unit) {
      const selectedIngredient = ingredients.find(ing => ing.id === formData.ingredientId);
      if (selectedIngredient?.unit) {
        onFormDataChange('unit', selectedIngredient.unit);
      }
    }
  }, [formData.ingredientId, formData.unit, ingredients, onFormDataChange]);

  // Numeric input validation - allow only numbers and one decimal point
  const handleNumericChange = (field: string, value: string) => {
    // Allow empty string, numbers, and one decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || numericRegex.test(value)) {
      onFormDataChange(field, value);
    }
  };

  // Calculate reorder point from percentage
  const parLevelValue = parseFloat(formData.parLevel) || 0;
  const reorderPointPercentage = parseFloat(formData.reorderPointPercentage) || 0;
  const calculatedReorderPoint = parLevelValue * (reorderPointPercentage / 100);

  // Validation: par level must be greater than 0, percentage must be 0-100, and calculated reorder point must be less than par level
  const isValidParLevel =
    formData.parLevel &&
    formData.reorderPointPercentage &&
    !isNaN(parLevelValue) &&
    !isNaN(reorderPointPercentage) &&
    parLevelValue > 0 &&
    reorderPointPercentage >= 0 &&
    reorderPointPercentage <= 100 &&
    calculatedReorderPoint < parLevelValue;

  return (
    <div className="mb-4 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <form onSubmit={onSubmit}>
        {/* Single Row Layout - Always Horizontal */}
        <div className="flex items-end gap-3">
          {/* Ingredient Dropdown */}
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              {t('parLevels.ingredient', 'Ingredient')}
            </label>
            <select
              value={formData.ingredientId}
              onChange={e => {
                onFormDataChange('ingredientId', e.target.value);
                // Reset unit when ingredient changes
                if (formData.unit) {
                  onFormDataChange('unit', '');
                }
              }}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              required
            >
              <option value="">{t('parLevels.selectIngredient', 'Select...')}</option>
              {ingredients.map(ingredient => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.ingredient_name} {ingredient.unit ? `(${ingredient.unit})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Par Level Input */}
          <div className="max-w-[120px] flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-400">
              {t('parLevels.parLevel', 'Par Level')}
              <HelpTooltip content={getHelpText('parLevel', true)} title="Par Level" />
            </label>
            <input
              type="text"
              value={formData.parLevel}
              onChange={e => handleNumericChange('parLevel', e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="50"
              required
            />
          </div>

          {/* Reorder Point Percentage Slider */}
          <div className="max-w-[160px] min-w-[140px] flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-400">
              {t('parLevels.reorderPoint', 'Reorder Point')}
              <HelpTooltip content={getHelpText('reorderPoint', true)} title="Reorder Point" />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.reorderPointPercentage ? formData.reorderPointPercentage : '50'}
                onChange={e => onFormDataChange('reorderPointPercentage', e.target.value)}
                className="slider h-3 w-24 flex-shrink-0 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
                style={{
                  background: `linear-gradient(to right, #29e7cd 0%, #29e7cd ${reorderPointPercentage}%, #2a2a2a ${reorderPointPercentage}%, #2a2a2a 100%)`,
                }}
                required
              />
              <div className="w-10 text-center">
                <div className="text-sm font-bold text-[#29E7CD]">
                  {String(Math.round(reorderPointPercentage))}%
                </div>
              </div>
            </div>
            {parLevelValue > 0 && (
              <p className="mt-0.5 text-xs text-gray-500">
                {calculatedReorderPoint.toFixed(1)} {formData.unit}
              </p>
            )}
          </div>

          {/* Unit Input */}
          <div className="max-w-[100px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              {t('parLevels.unit', 'Unit')}
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={e => onFormDataChange('unit', e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="kg"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
              aria-label="Cancel"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
            <button
              type="submit"
              disabled={!isValidParLevel}
              className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('parLevels.create', 'Add')}
            </button>
          </div>
        </div>

        {/* Validation Error Message */}
        {!isValidParLevel && formData.parLevel && formData.reorderPointPercentage && (
          <p className="mt-2 text-xs text-red-400">
            {reorderPointPercentage > 100
              ? 'Reorder point percentage cannot exceed 100%'
              : calculatedReorderPoint >= parLevelValue
                ? 'Reorder point must be less than par level'
                : 'Please fill in all required fields'}
          </p>
        )}
      </form>
    </div>
  );
}
