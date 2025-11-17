'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X, Save, List, Grid, Loader2 } from 'lucide-react';
import type { GeneratedPrepListData, KitchenSection } from '../types';
import { usePrepListPreview } from './hooks/usePrepListPreview';
import { PrepListAggregatedView } from './PrepListAggregatedView';
import { PrepListRecipeGroupedView } from './PrepListRecipeGroupedView';

import { logger } from '../../lib/logger';
interface PrepListPreviewProps {
  data: GeneratedPrepListData;
  kitchenSections: KitchenSection[];
  ingredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
  onClose: () => void;
  onSave: (prepLists: Array<{ sectionId: string | null; name: string; items: any[] }>) => void;
}

type ViewMode = 'aggregated' | 'recipe-grouped';

export function PrepListPreview({
  data,
  kitchenSections,
  ingredients,
  onClose,
  onSave,
}: PrepListPreviewProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('aggregated');

  // Safe ingredients array
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const {
    sections,
    saving,
    error,
    setSaving,
    setError,
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
    prepareSaveData,
  } = usePrepListPreview({ data, kitchenSections, ingredients });

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const prepListsToSave = prepareSaveData();

      if (prepListsToSave.length === 0) {
        setError('No items to save. Please add ingredients to at least one section.');
        setSaving(false);
        return;
      }

      onSave(prepListsToSave);
    } catch (err) {
      setError('Failed to save prep lists');
      logger.error('Error saving prep lists:', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {t('prepLists.previewTitle', 'Preview Prep Lists')} - {data.menuName}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {t('prepLists.previewSubtitle', 'Review and edit ingredients before saving')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] p-1">
              <button
                onClick={() => setViewMode('aggregated')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  viewMode === 'aggregated'
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon icon={List} size="sm" aria-hidden={true} />
                {t('prepLists.aggregated', 'Aggregated')}
              </button>
              <button
                onClick={() => setViewMode('recipe-grouped')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  viewMode === 'recipe-grouped'
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon icon={Grid} size="sm" aria-hidden={true} />
                {t('prepLists.recipeGrouped', 'By Recipe')}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 transition-colors hover:text-white"
              aria-label="Close"
            >
              <Icon icon={X} size="md" aria-hidden={true} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {sections.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">No ingredients found in this menu.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => {
                if (
                  (viewMode === 'aggregated' && section.aggregatedIngredients.length === 0) ||
                  (viewMode === 'recipe-grouped' && section.recipeGrouped.length === 0)
                ) {
                  return null;
                }

                return (
                  <div
                    key={sectionIndex}
                    className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
                  >
                    {/* Section Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{section.sectionName}</h3>
                        {section.sectionId === null && (
                          <select
                            value=""
                            onChange={e =>
                              handleSectionChange(sectionIndex, e.target.value || null)
                            }
                            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-1 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                          >
                            <option value="">Assign to section...</option>
                            {kitchenSections.map(ks => (
                              <option key={ks.id} value={ks.id}>
                                {ks.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      {viewMode === 'aggregated' && (
                        <div className="flex items-center gap-2">
                          <select
                            onChange={e => {
                              if (e.target.value) {
                                handleAddIngredient(sectionIndex, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                            defaultValue=""
                          >
                            <option value="">Add ingredient...</option>
                            {safeIngredients.map(ing => {
                              const ingName = ing.name || ing.ingredient_name || '';
                              return (
                                <option key={ing.id} value={ing.id}>
                                  {ingName} ({ing.unit})
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>

                    {viewMode === 'aggregated' && (
                      <PrepListAggregatedView
                        section={section}
                        sectionIndex={sectionIndex}
                        safeIngredients={safeIngredients}
                        handleQuantityChange={handleQuantityChange}
                        handleRemoveIngredient={handleRemoveIngredient}
                        handleIngredientSelect={handleIngredientSelect}
                      />
                    )}

                    {viewMode === 'recipe-grouped' && (
                      <PrepListRecipeGroupedView section={section} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2a2a2a] p-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#2a2a2a] px-6 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
          >
            {t('prepLists.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('prepLists.saving', 'Saving...')}
              </>
            ) : (
              <>
                <Icon icon={Save} size="sm" aria-hidden={true} />
                {t('prepLists.savePrepLists', 'Save Prep Lists')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
