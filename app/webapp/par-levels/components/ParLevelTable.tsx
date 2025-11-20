'use client';

import { ParLevelTableRow } from './ParLevelTableRow';
import type { ParLevel } from '../types';

interface ParLevelTableProps {
  parLevels: ParLevel[];
  selectedParLevels: Set<string>;
  totalFiltered?: number;
  onSelectParLevel: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (parLevel: ParLevel) => void;
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
  isSelectionMode: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function ParLevelTable({
  parLevels,
  selectedParLevels,
  totalFiltered,
  onSelectParLevel,
  onSelectAll,
  onEdit,
  onDelete,
  deletingId,
  isSelectionMode,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: ParLevelTableProps) {
  return (
    <div className="desktop:block hidden overflow-x-auto">
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => {
                    const allSelected =
                      totalFiltered !== undefined
                        ? selectedParLevels.size === totalFiltered && totalFiltered > 0
                        : selectedParLevels.size === parLevels.length && parLevels.length > 0;
                    onSelectAll(!allSelected);
                    if (!allSelected && onEnterSelectionMode) {
                      onEnterSelectionMode();
                    }
                  }}
                  className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                  aria-label={
                    totalFiltered !== undefined &&
                    selectedParLevels.size === totalFiltered &&
                    totalFiltered > 0
                      ? 'Deselect all'
                      : 'Select all'
                  }
                >
                  {(
                    totalFiltered !== undefined
                      ? selectedParLevels.size === totalFiltered && totalFiltered > 0
                      : selectedParLevels.size === parLevels.length && parLevels.length > 0
                  ) ? (
                    <svg
                      className="h-4 w-4 text-[#29E7CD]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Ingredient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Par Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Reorder Point
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {parLevels.map(parLevel => (
              <ParLevelTableRow
                key={parLevel.id}
                parLevel={parLevel}
                selectedParLevels={selectedParLevels}
                onSelectParLevel={onSelectParLevel}
                onEdit={onEdit}
                onDelete={onDelete}
                deletingId={deletingId}
                isSelectionMode={isSelectionMode}
                onStartLongPress={onStartLongPress}
                onCancelLongPress={onCancelLongPress}
                onEnterSelectionMode={onEnterSelectionMode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
