'use client';

import { MapPin, Store, Target, Trash2 } from 'lucide-react';
import { BulkActionButton } from './BulkActionButton';

interface BulkActionsMenuProps {
  selectedCount: number;
  bulkActionLoading: boolean;
  onDelete: () => void;
  onUpdateSupplier: () => void;
  onUpdateStorage: () => void;
  onUpdateWastage: () => void;
  onClose: () => void;
}

/** Dropdown menu for bulk ingredient actions */
export function BulkActionsMenu({
  selectedCount,
  bulkActionLoading,
  onDelete,
  onUpdateSupplier,
  onUpdateStorage,
  onUpdateWastage,
  onClose,
}: BulkActionsMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-[55]" onClick={onClose} aria-hidden />
      <div className="absolute top-full left-0 z-[60] mt-1.5 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="p-1.5">
          <div className="border-b border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--foreground-muted)]">
            {selectedCount} ingredient{selectedCount > 1 ? 's' : ''} selected
          </div>

          <div className="mt-1.5 space-y-0.5">
            <BulkActionButton
              icon={Trash2}
              label="Delete Selected"
              onClick={onDelete}
              disabled={bulkActionLoading}
              variant="danger"
            />
            <BulkActionButton
              icon={Store}
              label="Update Supplier"
              onClick={onUpdateSupplier}
              disabled={bulkActionLoading}
            />
            <BulkActionButton
              icon={MapPin}
              label="Update Storage Location"
              onClick={onUpdateStorage}
              disabled={bulkActionLoading}
            />
            <BulkActionButton
              icon={Target}
              label="Update Wastage %"
              onClick={onUpdateWastage}
              disabled={bulkActionLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
