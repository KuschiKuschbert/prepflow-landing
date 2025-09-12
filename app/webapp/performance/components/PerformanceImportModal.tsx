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
  onCsvDataChange
}: PerformanceImportModalProps) {
  if (!showImportModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6 w-full max-w-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">Import Sales Data</h3>
        <p className="text-gray-300 mb-4">
          Paste your CSV data below. Format: Dish, Number Sold, Popularity %
        </p>
        <textarea
          value={csvData.csvData}
          onChange={(e) => onCsvDataChange(e.target.value)}
          placeholder="Dish, Number Sold, Popularity %&#10;Double Cheese Burger, 175, 10.85&#10;Hot Dog, 158, 9.80"
          className="w-full h-40 px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent resize-none"
        />
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onImport}
            disabled={csvData.importing || !csvData.csvData.trim()}
            className="px-6 py-2 bg-[#29E7CD] hover:bg-[#29E7CD]/80 disabled:bg-gray-600 text-black rounded-lg transition-colors"
          >
            {csvData.importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
