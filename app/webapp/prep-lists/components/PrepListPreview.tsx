'use client';

import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import type { GeneratedPrepListData, KitchenSection } from '../types';
import { usePrepListPreview } from './hooks/usePrepListPreview';
import { PrepListPreviewHeader } from './PrepListPreviewHeader';
import { PrepListPreviewFooter } from './PrepListPreviewFooter';
import { PrepListPreviewSection } from './PrepListPreviewSection';
import { PrepListExport } from './PrepListExport';
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
  const [viewMode, setViewMode] = useState<ViewMode>('aggregated');
  const [showExport, setShowExport] = useState(false);

  // Safe ingredients array
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const {
    sections,
    saving,
    error,
    loadingPrepDetails,
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
      <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
        <div className="flex h-[90vh] w-full flex-col rounded-3xl bg-[var(--surface)]/95">
          {/* Header */}
          <PrepListPreviewHeader
            menuName={data.menuName}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={() => setShowExport(true)}
            onClose={onClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-3">
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              </div>
            )}

            {sections.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[var(--foreground-muted)]">No ingredients found in this menu.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <PrepListPreviewSection
                    key={sectionIndex}
                    section={section}
                    sectionIndex={sectionIndex}
                    viewMode={viewMode}
                    kitchenSections={kitchenSections}
                    safeIngredients={safeIngredients}
                    loadingPrepDetails={loadingPrepDetails}
                    handleSectionChange={handleSectionChange}
                    handleAddIngredient={handleAddIngredient}
                    handleQuantityChange={handleQuantityChange}
                    handleRemoveIngredient={handleRemoveIngredient}
                    handleIngredientSelect={handleIngredientSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <PrepListPreviewFooter saving={saving} onCancel={onClose} onSave={handleSave} />
        </div>

        {showExport && (
          <PrepListExport
            generatedData={{
              sections: sections,
              menuName: data.menuName,
            }}
            kitchenSections={kitchenSections}
            onClose={() => setShowExport(false)}
          />
        )}
      </div>
    </div>
  );
}
