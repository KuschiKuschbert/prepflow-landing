'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface ParLevel {
  id: string;
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
  notes?: string;
}

interface ParLevelFormModalProps {
  show: boolean;
  editingParLevel: ParLevel | null;
  formData: {
    ingredientId: string;
    parLevel: string;
    reorderPoint: string;
    unit: string;
    notes: string;
  };
  ingredients: Ingredient[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (field: string, value: string) => void;
}

export function ParLevelFormModal({
  show,
  editingParLevel,
  formData,
  ingredients,
  onClose,
  onSubmit,
  onFormDataChange,
}: ParLevelFormModalProps) {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {editingParLevel
              ? t('parLevels.editParLevel', 'Edit Par Level')
              : t('parLevels.addParLevel', 'Add Par Level')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {!editingParLevel && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('parLevels.ingredient', 'Ingredient')}
              </label>
              <select
                value={formData.ingredientId}
                onChange={e => onFormDataChange('ingredientId', e.target.value)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                required
              >
                <option value="">{t('parLevels.selectIngredient', 'Select an ingredient')}</option>
                {ingredients.map(ingredient => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} ({ingredient.unit})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              {t('parLevels.parLevel', 'Par Level')}
              <HelpTooltip content={getHelpText('parLevel', true)} title="Par Level" />
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.parLevel}
              onChange={e => onFormDataChange('parLevel', e.target.value)}
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
            <input
              type="number"
              step="0.01"
              value={formData.reorderPoint}
              onChange={e => onFormDataChange('reorderPoint', e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., 25"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('parLevels.unit', 'Unit')}
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={e => onFormDataChange('unit', e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., kg, pieces, liters"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('parLevels.notes', 'Notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={e => onFormDataChange('notes', e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              rows={3}
              placeholder={String(
                t('parLevels.notesPlaceholder', 'Optional notes about this par level'),
              )}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
            >
              {t('parLevels.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              {editingParLevel ? t('parLevels.update', 'Update') : t('parLevels.create', 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
