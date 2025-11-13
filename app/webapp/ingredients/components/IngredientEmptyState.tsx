'use client';

import { Icon } from '@/components/ui/Icon';
import { Plus, Upload, Download } from 'lucide-react';

interface IngredientEmptyStateProps {
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  onAddIngredient?: () => void;
  onImportCSV?: () => void;
  onExportCSV?: () => void;
}

export function IngredientEmptyState({
  searchTerm,
  supplierFilter,
  storageFilter,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
}: IngredientEmptyStateProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      {/* Empty State Header */}
      <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Ingredients (0)</h2>
          {/* Action Buttons */}
          {onAddIngredient && (
            <div className="flex items-center gap-2">
              <button
                onClick={onAddIngredient}
                className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
              >
                + Add
              </button>
              {onImportCSV && (
                <button
                  onClick={onImportCSV}
                  className="rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
                >
                  📁 Import
                </button>
              )}
              {onExportCSV && (
                <button
                  onClick={onExportCSV}
                  className="rounded-lg bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
                >
                  📤 Export
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-12 text-center">
        <div className="mb-4 text-gray-400">
          <svg className="mx-auto mb-4 h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mb-2 text-xl font-semibold text-white">No Ingredients Found</h3>
          <p className="text-gray-400">
            {searchTerm || supplierFilter || storageFilter
              ? 'Try adjusting your filters to see more results.'
              : 'Start by adding your first ingredient to get started.'}
          </p>
        </div>
      </div>
    </div>
  );
}
