/**
 * Menu Unlock Changes Dialog Component
 * Shows detailed change information when unlocking a menu that has tracked changes
 */

'use client';

import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { useRef } from 'react';
import { calculateSummary } from './MenuUnlockChangesDialog/utils/calculateSummary';
import { ChangesList } from './MenuUnlockChangesDialog/components/ChangesList';
import { DialogHeader } from './MenuUnlockChangesDialog/components/DialogHeader';
import { DialogActions } from './MenuUnlockChangesDialog/components/DialogActions';
import { useDialogFocusTrap } from './MenuUnlockChangesDialog/hooks/useDialogFocusTrap';
import { useDialogActions } from './MenuUnlockChangesDialog/hooks/useDialogActions';

interface MenuUnlockChangesDialogProps {
  isOpen: boolean;
  menuId: string;
  changes: MenuChangeTracking[];
  onRecalculatePrices: () => Promise<void>;
  onReviewChanges?: () => void;
  onDismiss: () => void;
  onClose: () => void;
}

export function MenuUnlockChangesDialog({
  isOpen,
  menuId,
  changes,
  onRecalculatePrices,
  onReviewChanges,
  onDismiss,
  onClose,
}: MenuUnlockChangesDialogProps) {
  const dismissButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogFocusTrap({
    isOpen,
    onClose,
    dismissButtonRef,
  });

  const { recalculating, handleRecalculatePrices, handleDismiss } = useDialogActions({
    menuId,
    onRecalculatePrices,
    onDismiss,
    onClose,
  });

  if (!isOpen) return null;

  const summary = calculateSummary(changes);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[#29E7CD]/30 via-[#D925C7]/30 to-[#29E7CD]/30 p-[1px] shadow-2xl">
        <div
          ref={dialogRef}
          className="desktop:p-8 rounded-3xl bg-[#1f1f1f]/95 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogHeader summary={summary} onClose={onClose} />
          <ChangesList changes={changes} />
          <DialogActions
            recalculating={recalculating}
            onRecalculatePrices={handleRecalculatePrices}
            onReviewChanges={onReviewChanges}
            onDismiss={handleDismiss}
            dismissButtonRef={dismissButtonRef}
          />
        </div>
      </div>
    </div>
  );
}


