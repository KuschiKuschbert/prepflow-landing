'use client';

import { ImportCSVData } from '@/lib/types/performance';
import { ImportProgress } from '@/components/ui/ImportProgress';

interface PerformanceImportModalProps {
  showImportModal: boolean;
  csvData: ImportCSVData;
  onClose: () => void;
  onImport: () => void;
  onCsvDataChange: (csvData: string) => void;
}

export default function PerformanceImportModal({
  showImportModal,
  csvData,
  onClose,
  onImport,
  onCsvDataChange,
}: PerformanceImportModalProps) {
  if (!showImportModal) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
        <div className="rounded-2xl bg-[var(--surface)]/95 p-6">
          <h3 className="mb-4 text-xl font-semibold text-[var(--button-active-text)]">
            Import Sales Data
          </h3>
          <p className="mb-4 text-[var(--foreground-secondary)]">
            Paste your CSV data below. Format: Dish, Number Sold, Popularity %
          </p>
          {csvData.importing ? (
            <ImportProgress
              progress={{
                total: 1,
                processed: 1,
                successful: 1,
                failed: 0,
                isComplete: false,
              }}
              title="Importing sales data..."
            />
          ) : (
            <>
              <textarea
                value={csvData.csvData}
                onChange={e => onCsvDataChange(e.target.value)}
                placeholder="Dish, Number Sold, Popularity %&#10;Double Cheese Burger, 175, 10.85&#10;Hot Dog, 158, 9.80"
                className="h-40 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-[var(--muted)] px-6 py-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
                >
                  Cancel
                </button>
                <button
                  onClick={onImport}
                  disabled={csvData.importing || !csvData.csvData.trim()}
                  className="rounded-lg bg-[var(--primary)] px-6 py-2 text-[var(--primary-text)] transition-colors hover:bg-[var(--primary)]/80 disabled:bg-[var(--muted)] disabled:text-[var(--foreground-muted)]"
                >
                  Import
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
