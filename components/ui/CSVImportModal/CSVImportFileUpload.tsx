/**
 * CSV Import File Upload Component
 */
'use client';

interface CSVImportFileUploadProps {
  expectedColumns: string[];
  optionalColumns?: string[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CSVImportFileUpload({
  expectedColumns,
  optionalColumns,
  onFileUpload,
}: CSVImportFileUploadProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
        Upload CSV File
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
      />
      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        Required columns: {expectedColumns.join(', ')}
        {optionalColumns && optionalColumns.length > 0 && (
          <> | Optional: {optionalColumns.join(', ')}</>
        )}
      </p>
    </div>
  );
}
