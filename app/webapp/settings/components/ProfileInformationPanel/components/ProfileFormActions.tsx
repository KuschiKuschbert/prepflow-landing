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
    <div className="flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
      <button
        onClick={onCancel}
        disabled={saving}
        className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
