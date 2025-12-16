/**
 * Ingredient Wizard Step 3 - Allergen Selection
 * Allergens are automatically detected when entering this step using hybrid detection (keyword + AI)
 * Manual allergen selection is optional
 */

'use client';

import { useState } from 'react';
import { WizardStepProps } from './types';
import { AUSTRALIAN_ALLERGENS as AUSTRALIAN_FSANZ_ALLERGENS } from '@/lib/allergens/australian-allergens';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { Icon } from '@/components/ui/Icon';
import { Edit2, Check } from 'lucide-react';
import {
  Nut,
  Milk,
  Egg,
  Bean,
  Wheat,
  Fish,
  CircleDot,
  Flower,
  AlertTriangle,
  Circle,
  LucideIcon,
} from 'lucide-react';

// Icon mapping for allergens (same as AllergenBadge)
const ALLERGEN_ICONS: Record<string, LucideIcon> = {
  nuts: Nut,
  milk: Milk,
  eggs: Egg,
  soy: Bean,
  gluten: Wheat,
  fish: Fish,
  shellfish: Fish,
  sesame: CircleDot,
  lupin: Flower,
  sulphites: AlertTriangle,
  mustard: Circle,
};

export default function IngredientWizardStep4({
  formData,
  errors,
  onInputChange,
  detectingAllergens = false,
}: WizardStepProps) {
  const [showManualEdit, setShowManualEdit] = useState(false);

  const selectedAllergens = (formData.allergens as string[]) || [];
  const allergenSource = (formData.allergen_source as {
    manual?: boolean;
    ai?: boolean;
  }) || { manual: false, ai: false };

  const hasManualAllergens = allergenSource.manual && selectedAllergens.length > 0;
  const hasAutoDetectedAllergens =
    !allergenSource.manual && allergenSource.ai && selectedAllergens.length > 0;

  const handleAllergenToggle = (allergenCode: string) => {
    const current = selectedAllergens;
    const updated = current.includes(allergenCode)
      ? current.filter(a => a !== allergenCode)
      : [...current, allergenCode];

    onInputChange('allergens', updated);
    onInputChange('allergen_source', {
      ...allergenSource,
      manual: updated.length > 0,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Allergen Information</h3>
        <div className="mb-2 rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 px-3 py-2">
          <p className="text-xs font-medium text-[var(--color-warning)]">
            ⚠️ Experimental: Allergen detection is currently experimental and may not be 100%
            accurate.
          </p>
        </div>
        <p className="mb-4 text-xs text-[var(--foreground-muted)]">
          Allergens are automatically detected when you enter this step using hybrid detection
          (keyword matching + AI). You can optionally edit them manually below.
        </p>
      </div>

      {/* Auto-detection Info */}
      {detectingAllergens ? (
        <div className="mb-4 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            <div className="flex-1 text-xs text-[var(--foreground-secondary)]">
              <div className="font-semibold text-[var(--primary)]">Detecting Allergens...</div>
              <div className="mt-1 text-[var(--foreground-muted)]">
                Analyzing ingredient name and brand for allergens using hybrid detection.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3">
          <div className="flex items-start gap-2">
            <Icon icon={Check} size="sm" className="mt-0.5 text-[var(--primary)]" aria-hidden={true} />
            <div className="flex-1 text-xs text-[var(--foreground-secondary)]">
              <div className="font-semibold text-[var(--primary)]">
                {selectedAllergens.length > 0
                  ? `Detected ${selectedAllergens.length} Allergen${selectedAllergens.length !== 1 ? 's' : ''}`
                  : 'Automatic Detection Enabled'}
              </div>
              <div className="mt-1 text-[var(--foreground-muted)]">
                {selectedAllergens.length > 0
                  ? 'Allergens were automatically detected. You can edit them below if needed.'
                  : 'Allergens will be detected automatically on save using hybrid detection (keyword matching first, then AI if needed).'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Edit Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowManualEdit(!showManualEdit)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-all hover:bg-[var(--surface)]"
        >
          <Icon icon={Edit2} size="sm" aria-hidden={true} />
          <span>{showManualEdit ? 'Hide Manual Selection' : 'Edit Allergens Manually'}</span>
        </button>
        {(hasManualAllergens || hasAutoDetectedAllergens) && (
          <div className="mt-3 space-y-2">
            {hasManualAllergens ? (
              <>
                <p className="text-xs text-[var(--foreground-muted)]">
                  You have manually selected {selectedAllergens.length} allergen
                  {selectedAllergens.length !== 1 ? 's' : ''}. These will override automatic
                  detection.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAllergens.map(code => (
                    <AllergenBadge key={code} allergenCode={code} source="manual" size="sm" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {selectedAllergens.length} allergen{selectedAllergens.length !== 1 ? 's' : ''}{' '}
                  detected automatically. You can edit them below if needed.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAllergens.map(code => (
                    <AllergenBadge key={code} allergenCode={code} source="ai" size="sm" />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Allergen Checkboxes - Only show when manual edit is enabled */}
      {showManualEdit && (
        <div className="space-y-4">
          <div className="tablet:grid-cols-2 large-desktop:grid-cols-3 grid grid-cols-1 gap-2">
            {AUSTRALIAN_FSANZ_ALLERGENS.map(allergen => {
              const isSelected = selectedAllergens.includes(allergen.code);

              return (
                <label
                  key={allergen.code}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAllergenToggle(allergen.code)}
                    className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {allergen.icon && ALLERGEN_ICONS[allergen.icon] && (
                        <Icon
                          icon={ALLERGEN_ICONS[allergen.icon]}
                          size="sm"
                          className="text-[var(--primary)]"
                          aria-hidden={true}
                        />
                      )}
                      <span className="text-sm font-medium text-[var(--foreground)]">{allergen.displayName}</span>
                    </div>
                    {allergen.description && (
                      <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{allergen.description}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {errors.allergens && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.allergens}</p>}
    </div>
  );
}
