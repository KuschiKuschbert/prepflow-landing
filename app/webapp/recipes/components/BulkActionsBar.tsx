'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onBulkDelete,
  onClearSelection,
}: BulkActionsBarProps) {
  // Keyboard shortcut: Esc to clear selection
  useEffect(() => {
    if (selectedCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, onClearSelection]);

  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-[#ef4444]/30 bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
            <span className="text-sm font-bold text-white">{selectedCount}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {selectedCount} recipe{selectedCount > 1 ? 's' : ''} selected
            </h3>
            <p className="text-sm text-gray-400">Choose an action for the selected recipes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 hover:shadow-xl"
          >
            <Icon icon={Trash2} size="sm" className="text-white" aria-hidden={true} />
            Delete Selected
          </button>
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
            title="Press Esc to clear selection"
          >
            <Icon icon={X} size="sm" className="text-gray-300" aria-hidden={true} />
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}
