'use client';

import { Icon } from '@/components/ui/Icon';
import { MapPin, Sparkles, Store, Target, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';

interface IngredientBulkActionsMenuProps {
  selectedCount: number;
  bulkActionLoading: boolean;
  onBulkDelete: () => void;
  onBulkUpdateSupplier: () => void;
  onBulkUpdateStorage: () => void;
  onBulkUpdateWastage: () => void;
  onBulkAutoCategorize?: () => void;
  showBulkMenu: boolean;
  onToggleBulkMenu: () => void;
  variant?: 'desktop' | 'mobile';
}

export function IngredientBulkActionsMenu({
  selectedCount,
  bulkActionLoading,
  onBulkDelete,
  onBulkUpdateSupplier,
  onBulkUpdateStorage,
  onBulkUpdateWastage,
  onBulkAutoCategorize,
  showBulkMenu,
  onToggleBulkMenu,
  variant = 'desktop',
}: IngredientBulkActionsMenuProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`relative z-[60] ${variant === 'desktop' ? 'large-desktop:block hidden' : 'large-desktop:hidden'}`}
    >
      <button
        onClick={onToggleBulkMenu}
        disabled={bulkActionLoading}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl disabled:opacity-50"
      >
        <Icon icon={Zap} size="xs" className="text-current" aria-hidden={true} />
        <span>{variant === 'desktop' ? `Bulk Actions (${selectedCount})` : 'Actions'}</span>
      </button>

      {showBulkMenu && (
        <>
          <div className="fixed inset-0 z-[55]" onClick={onToggleBulkMenu} aria-hidden={true} />
          <div
            className={`absolute top-full ${variant === 'desktop' ? 'left-0' : 'right-0'} z-[60] mt-1.5 w-64 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl`}
          >
            <div className="p-1.5">
              <div className="border-b border-[#2a2a2a] px-2.5 py-1.5 text-xs text-gray-400">
                {selectedCount} ingredient{selectedCount > 1 ? 's' : ''} selected
              </div>

              <div className="mt-1.5 space-y-0.5">
                <button
                  onClick={onBulkDelete}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Icon icon={Trash2} size="xs" className="text-red-400" aria-hidden={true} />
                  <span>Delete Selected</span>
                </button>

                <button
                  onClick={onBulkUpdateSupplier}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                >
                  <Icon icon={Store} size="xs" className="text-current" aria-hidden={true} />
                  <span>Update Supplier</span>
                </button>

                <button
                  onClick={onBulkUpdateStorage}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                >
                  <Icon icon={MapPin} size="xs" className="text-current" aria-hidden={true} />
                  <span>Update Storage Location</span>
                </button>

                <button
                  onClick={onBulkUpdateWastage}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
                >
                  <Icon icon={Target} size="xs" className="text-current" aria-hidden={true} />
                  <span>Update Wastage %</span>
                </button>

                {onBulkAutoCategorize && (
                  <button
                    onClick={onBulkAutoCategorize}
                    disabled={bulkActionLoading}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10 disabled:opacity-50"
                  >
                    <Icon icon={Sparkles} size="xs" className="text-[#29E7CD]" aria-hidden={true} />
                    <span>Auto-categorize</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
