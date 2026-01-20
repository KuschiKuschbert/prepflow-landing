'use client';

import { ImportProgress } from '@/components/ui/ImportProgress';
import { useTranslation } from '@/lib/useTranslation';
import { CSVImportPreview } from './CSVImportPreview';
import { useCSVImport, type Ingredient } from './hooks/useCSVImport';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (ingredients: Partial<Ingredient>[]) => Promise<void>;
  loading?: boolean;
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImport,
  loading = false,
}: CSVImportModalProps) {
   
  const { t: _t } = useTranslation();
   

  const {
    parsedIngredients,
    selectedIngredients,
    error,
    handleFileUpload,
    handleSelectIngredient,
    handleSelectAll,
    handleImport,
    handleClose,
    getDisplayCost,
  } = useCSVImport({ onImport, onClose });

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-[70] flex items-center justify-center bg-[var(--background)] p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-[var(--surface)]/95">
          {/* Header */}
          <div className="desktop:p-6 border-b border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <h2 className="desktop:text-2xl text-xl font-bold text-[var(--foreground)]">
                📁 Import Ingredients from CSV
              </h2>
              <button
                onClick={handleClose}
                className="rounded-full bg-[var(--surface)] p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
          </div>

          {/* Content */}
          <div className="desktop:space-y-6 desktop:p-6 space-y-4 p-4">
            {/* File Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Supported columns: name, brand, cost, unit, supplier, code, location, pack_size
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-lg border border-[var(--color-error)] bg-red-900/20 px-4 py-3 text-[var(--color-error)]">
                {error}
              </div>
            )}

            {/* Progress Indicator */}
            {loading && (
              <ImportProgress
                progress={{
                  total: selectedIngredients.size,
                  processed: selectedIngredients.size,
                  successful: selectedIngredients.size,
                  failed: 0,
                  isComplete: false,
                }}
                title="Importing ingredients..."
              />
            )}

            {/* Preview */}
            {parsedIngredients.length > 0 && !loading && (
              <>
                <CSVImportPreview
                  parsedIngredients={parsedIngredients}
                  selectedIngredients={selectedIngredients}
                  onSelectIngredient={handleSelectIngredient}
                  onSelectAll={handleSelectAll}
                  getDisplayCost={getDisplayCost}
                />

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={loading || selectedIngredients.size === 0}
                    className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {`Import Selected (${selectedIngredients.size})`}
                  </button>
                </div>
              </>
            )}

            {/* Instructions */}
            <div className="rounded-lg border border-[var(--border)]/50 bg-[var(--muted)]/30 p-4">
              <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
                📋 CSV Format Instructions
              </h4>
              <div className="space-y-1 text-xs text-[var(--foreground-muted)]">
                <p>• First row should contain column headers</p>
                <p>• Required columns: name (or ingredient), cost (or price), unit</p>
                <p>
                  • Optional columns: brand, supplier, code (or sku), location (or storage),
                  pack_size
                </p>
                <p>• Values will be automatically formatted and capitalized</p>
                <p>• Empty rows will be skipped</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
