'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';

interface Recipe {
  id: string;
  recipe_name: string;
}

interface FormData {
  recipeId: string;
  shareType: 'pdf' | 'link' | 'email';
  recipientEmail: string;
  notes: string;
}

interface ShareFormModalProps {
  isOpen: boolean;
  recipes: Recipe[];
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ShareFormModal({
  isOpen,
  recipes,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
}: ShareFormModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
        <div className="rounded-3xl bg-[var(--surface)]/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--button-active-text)]">
              {t('recipeSharing.shareRecipe', 'Share Recipe')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              <Icon icon={X} size="lg" aria-hidden={true} />
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                {t('recipeSharing.selectRecipe', 'Select Recipe')}
              </label>
              <select
                value={formData.recipeId}
                onChange={e => onFormDataChange({ ...formData, recipeId: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                <option value="">
                  {t('recipeSharing.chooseRecipe', 'Choose a recipe to share')}
                </option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.recipe_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                {t('recipeSharing.shareType', 'Share Type')}
              </label>
              <select
                value={formData.shareType}
                onChange={e =>
                  onFormDataChange({
                    ...formData,
                    shareType: e.target.value as 'pdf' | 'link' | 'email',
                  })
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                <option value="pdf">📄 PDF Download</option>
                <option value="link">🔗 Shareable Link</option>
                <option value="email">📧 Email Recipe</option>
              </select>
            </div>
            {formData.shareType === 'email' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                  {t('recipeSharing.recipientEmail', 'Recipient Email')}
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={e => onFormDataChange({ ...formData, recipientEmail: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="recipient@example.com"
                  required={formData.shareType === 'email'}
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                {t('recipeSharing.notes', 'Notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={e => onFormDataChange({ ...formData, notes: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                rows={3}
                placeholder={String(
                  t(
                    'recipeSharing.notesPlaceholder',
                    'Optional message to include with the shared recipe',
                  ),
                )}
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[var(--muted)] px-4 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/80"
              >
                {t('recipeSharing.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
              >
                {t('recipeSharing.share', 'Share')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
