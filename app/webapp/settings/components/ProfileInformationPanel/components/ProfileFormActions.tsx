'use client';

interface ProfileFormActionsProps {
  hasChanges: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Profile form actions component (Save/Cancel buttons)
 */
export function ProfileFormActions({
  hasChanges,
  saving,
  onSave,
  onCancel,
}: ProfileFormActionsProps) {
  if (!hasChanges) return null;

  return (
    <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
      <button
        onClick={onCancel}
        disabled={saving}
        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
