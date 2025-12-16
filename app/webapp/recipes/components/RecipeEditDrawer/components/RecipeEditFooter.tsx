import { AutosaveStatus } from '@/components/ui/AutosaveStatus';

interface RecipeEditFooterProps {
  saving: boolean;
  savingIngredients: boolean;
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  autosaveError: string | null;
  editedName: string;
  ingredientCalculationsCount: number;
  consumableCalculationsCount: number;
  onSave: () => void;
  onClose: () => void;
  onRetryAutosave: () => void;
}

/**
 * Component for the recipe edit drawer footer
 */
export function RecipeEditFooter({
  saving,
  savingIngredients,
  autosaveStatus,
  autosaveError,
  editedName,
  ingredientCalculationsCount,
  consumableCalculationsCount,
  onSave,
  onClose,
  onRetryAutosave,
}: RecipeEditFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <AutosaveStatus status={autosaveStatus} error={autosaveError} onRetry={onRetryAutosave} />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-[var(--muted)] px-4 py-2.5 font-semibold text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--surface-variant)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={
            saving ||
            savingIngredients ||
            autosaveStatus === 'saving' ||
            !editedName.trim() ||
            (ingredientCalculationsCount === 0 && consumableCalculationsCount === 0)
          }
          className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#3B82F6] px-4 py-2.5 font-semibold text-[var(--button-active-text)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving || savingIngredients || autosaveStatus === 'saving'
            ? 'Saving...'
            : ingredientCalculationsCount === 0 && consumableCalculationsCount === 0
              ? 'Add Ingredients to Save'
              : 'Save'}
        </button>
      </div>
    </div>
  );
}




