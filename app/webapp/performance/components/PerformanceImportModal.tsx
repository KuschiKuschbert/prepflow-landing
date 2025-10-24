'use client';

import { ImportCSVData } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <h3 className="mb-4 text-xl font-semibold text-white">Import Sales Data</h3>
        <p className="mb-4 text-gray-300">
          Paste your CSV data below. Format: Dish, Number Sold, Popularity %
        </p>
        <textarea
          value={csvData.csvData}
          onChange={e => onCsvDataChange(e.target.value)}
          placeholder="Dish, Number Sold, Popularity %&#10;Double Cheese Burger, 175, 10.85&#10;Hot Dog, 158, 9.80"
          className="h-40 w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        />
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onImport}
            disabled={csvData.importing || !csvData.csvData.trim()}
            className="rounded-lg bg-[#29E7CD] px-6 py-2 text-black transition-colors hover:bg-[#29E7CD]/80 disabled:bg-gray-600"
          >
            {csvData.importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
