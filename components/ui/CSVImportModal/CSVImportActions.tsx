/**
 * CSV Import Actions Component
 * Action buttons for CSV import modal
 */

interface CSVImportActionsProps {
  selectedValidCount: number;
  validCount: number;
  entityNamePlural: string;
  loading: boolean;
  onClose: () => void;
  onImport: () => void;
}

export function CSVImportActions({
  selectedValidCount,
  validCount,
  entityNamePlural,
  loading,
  onClose,
  onImport,
}: CSVImportActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-400">
        {selectedValidCount} of {validCount} valid {entityNamePlural} selected
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={onImport}
          disabled={loading || selectedValidCount === 0}
          className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          Import Selected ({selectedValidCount})
        </button>
      </div>
    </div>
  );
}
