import { Icon } from '@/components/ui/Icon';
import { Edit, QrCode, Trash2 } from 'lucide-react';

interface RecipeCardActionsProps {
  recipeName: string;
  onPreview: () => void;
  onShowQR: () => void;
  onEdit: () => void;
  onDelete: () => void;
  capitalizeRecipeName: (name: string) => string;
}

/**
 * Recipe card action buttons component
 */
export function RecipeCardActions({
  recipeName,
  onPreview,
  onShowQR,
  onEdit,
  onDelete,
  capitalizeRecipeName,
}: RecipeCardActionsProps) {
  return (
    <div className="ml-7 flex gap-2">
      <button
        onClick={e => {
          e.stopPropagation();
          onPreview();
        }}
        className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        title="View full recipe details, ingredients, and instructions"
      >
        Preview
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          onShowQR();
        }}
        className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
        aria-label={`Generate QR code for ${capitalizeRecipeName(recipeName)}`}
        title="Generate QR code for this recipe"
      >
        <Icon icon={QrCode} size="xs" />
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          onEdit();
        }}
        className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
        aria-label={`Edit recipe ${capitalizeRecipeName(recipeName)}`}
        title="Edit recipe in builder"
      >
        <Icon icon={Edit} size="xs" />
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--color-error)]"
        aria-label={`Delete recipe ${capitalizeRecipeName(recipeName)}`}
        title="Delete this recipe"
      >
        <Icon icon={Trash2} size="xs" />
      </button>
    </div>
  );
}
