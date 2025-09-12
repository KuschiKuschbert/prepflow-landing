'use client';

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkActionsBar({ 
  selectedCount, 
  onBulkDelete, 
  onClearSelection 
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444]/30 p-4 rounded-xl mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">{selectedCount}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {selectedCount} recipe{selectedCount > 1 ? 's' : ''} selected
            </h3>
            <p className="text-gray-400 text-sm">Choose an action for the selected recipes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBulkDelete}
            className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-2 rounded-lg hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            🗑️ Delete Selected
          </button>
          <button
            onClick={onClearSelection}
            className="bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}
