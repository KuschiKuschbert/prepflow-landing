'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useOnSave } from '@/lib/personality/hooks';
import { useTranslation } from '@/lib/useTranslation';
import { useState, useEffect } from 'react';
import type { ParLevel, Ingredient } from '../types';

interface ParLevelEditDrawerProps {
  isOpen: boolean;
  parLevel: ParLevel | null;
  ingredients: Ingredient[];
  onSave: (parLevel: Partial<ParLevel>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function ParLevelEditDrawer({
  isOpen,
  parLevel,
  ingredients,
  onSave,
  onClose,
  loading = false,
}: ParLevelEditDrawerProps) {
  const { t } = useTranslation();
  const handlePersonalitySave = useOnSave();

  const [formData, setFormData] = useState({
    parLevel: '',
    reorderPointPercentage: '50',
    unit: '',
  });

  // Initialize form data when par level changes
  useEffect(() => {
    if (parLevel) {
      // Calculate percentage from existing reorder point
      const percentage =
        parLevel.par_level > 0
          ? Math.round((parLevel.reorder_point / parLevel.par_level) * 100)
          : 50;
      setFormData({
        parLevel: parLevel.par_level.toString(),
        reorderPointPercentage: percentage.toString(),
        unit: parLevel.unit,
      });
    }
  }, [parLevel]);

  // Numeric input validation - allow only numbers and one decimal point
  const handleNumericChange = (field: string, value: string) => {
    // Allow empty string, numbers, and one decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || numericRegex.test(value)) {
      handleInputChange(field, value);
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

  const entityId = deriveAutosaveId('par_levels', parLevel?.id, [
    parLevel?.ingredient_id || '',
    formData.parLevel || '',
  ]);
  const canAutosave = Boolean(parLevel && isValidParLevel && formData.unit);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'par_levels',
    entityId: entityId,
    data: {
      id: parLevel?.id,
      par_level: parLevelValue,
      reorder_point: calculatedReorderPoint,
      unit: formData.unit,
    },
    enabled: canAutosave && isOpen,
    onSave: async savedData => {
      // Autosave saves silently in the background
      // Don't call the parent's onSave prop here - that would close the drawer
    },
  });

  const handleSave = async () => {
    if (!parLevel || !isValidParLevel) return;

    const updates = {
      id: parLevel.id,
      par_level: parLevelValue,
      reorder_point: calculatedReorderPoint,
      unit: formData.unit,
    };

    await saveNow();
    handlePersonalitySave();
    await onSave(updates);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!parLevel) return null;

  const ingredient = ingredients.find(ing => ing.id === parLevel.ingredient_id);

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Par Level${ingredient ? ` - ${ingredient.ingredient_name}` : ''}`}
      maxWidth="md"
      onSave={handleSave}
      saving={loading || status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || status === 'saving' || !isValidParLevel}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        {/* Read-only ingredient display */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('parLevels.ingredient', 'Ingredient')}
          </label>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-gray-400">
            {ingredient?.ingredient_name || 'Unknown ingredient'}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
            {t('parLevels.parLevel', 'Par Level')}
            <HelpTooltip content={getHelpText('parLevel', true)} title="Par Level" />
          </label>
          <input
            type="text"
            value={formData.parLevel}
            onChange={e => handleNumericChange('parLevel', e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., 50"
            required
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
            {t('parLevels.reorderPoint', 'Reorder Point')}
            <HelpTooltip content={getHelpText('reorderPoint', true)} title="Reorder Point" />
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.reorderPointPercentage || '50'}
              onChange={e => handleInputChange('reorderPointPercentage', e.target.value)}
              className="slider h-3 w-48 flex-shrink-0 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
              style={{
                background: `linear-gradient(to right, #29e7cd 0%, #29e7cd ${reorderPointPercentage}%, #2a2a2a ${reorderPointPercentage}%, #2a2a2a 100%)`,
              }}
              required
            />
            <div className="w-16 text-center">
              <div className="text-lg font-bold text-[#29E7CD]">
                {String(Math.round(reorderPointPercentage))}%
              </div>
            </div>
          </div>
          {parLevelValue > 0 && (
            <p className="mt-1 text-xs text-gray-400">
              {calculatedReorderPoint.toFixed(1)} {formData.unit}
            </p>
          )}
          {!isValidParLevel && formData.parLevel && formData.reorderPointPercentage && (
            <p className="mt-1 text-xs text-red-400">
              {reorderPointPercentage > 100
                ? 'Reorder point percentage cannot exceed 100%'
                : calculatedReorderPoint >= parLevelValue
                  ? 'Reorder point must be less than par level'
                  : 'Please fill in all required fields'}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('parLevels.unit', 'Unit')}
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={e => handleInputChange('unit', e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., kg, pieces, liters"
            required
          />
        </div>
      </form>
    </EditDrawer>
  );
}
