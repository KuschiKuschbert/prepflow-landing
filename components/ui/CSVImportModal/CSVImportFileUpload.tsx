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
      <label className="mb-2 block text-sm font-medium text-gray-300">Upload CSV File</label>
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white transition-colors focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
      />
      <p className="mt-1 text-xs text-gray-400">
        Required columns: {expectedColumns.join(', ')}
        {optionalColumns && optionalColumns.length > 0 && (
          <> | Optional: {optionalColumns.join(', ')}</>
        )}
      </p>
    </div>
  );
}
