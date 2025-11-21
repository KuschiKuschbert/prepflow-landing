/**
 * Menu Unlock Changes Dialog Component
 * Shows detailed change information when unlocking a menu that has tracked changes
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { AlertCircle, Calculator, Eye, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MenuUnlockChangesDialogProps {
  isOpen: boolean;
  menuId: string;
  changes: MenuChangeTracking[];
  onRecalculatePrices: () => Promise<void>;
  onReviewChanges?: () => void;
  onDismiss: () => void;
  onClose: () => void;
}

/**
 * Format change details for display
 */
function formatChangeDetails(change: MenuChangeTracking): string {
  const details = change.change_details;
  if (!details || typeof details !== 'object') {
    return change.change_type.replace(/_/g, ' ');
  }

  const parts: string[] = [];

  // Price changes
  if (details.price) {
    const { before, after, change: changeType } = details.price;
    if (before !== undefined && after !== undefined) {
      parts.push(`Price ${changeType} from $${before.toFixed(2)} to $${after.toFixed(2)}`);
    } else {
      parts.push('Price changed');
    }
  }

  // Yield changes
  if (details.yield) {
    const { before, after, change: changeType } = details.yield;
    if (before !== undefined && after !== undefined) {
      parts.push(`Yield ${changeType} from ${before} to ${after}`);
    } else {
      parts.push('Yield changed');
    }
  }

  // Ingredients changes
  if (details.ingredients) {
    parts.push('Ingredients updated');
  }

  // Recipes changes
  if (details.recipes) {
    parts.push('Recipes updated');
  }

  // Cost changes (for ingredients)
  if (
    details.cost_per_unit ||
    details.cost_per_unit_as_purchased ||
    details.cost_per_unit_incl_trim
  ) {
    parts.push('Cost updated');
  }

  // Instructions changes
  if (details.instructions) {
    parts.push('Instructions updated');
  }

  // Description changes
  if (details.description) {
    parts.push('Description updated');
  }

  if (parts.length === 0) {
    return change.change_type.replace(/_/g, ' ');
  }

  return parts.join(', ');
}

/**
 * Group changes by entity type
 */
function groupChangesByType(changes: MenuChangeTracking[]) {
  const grouped: Record<string, MenuChangeTracking[]> = {
    dish: [],
    recipe: [],
    ingredient: [],
  };

  for (const change of changes) {
    if (grouped[change.entity_type]) {
      grouped[change.entity_type].push(change);
    }
  }

  return grouped;
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
  const { showSuccess, showError } = useNotification();
  const [recalculating, setRecalculating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Store trigger element
      triggerRef.current = document.activeElement as HTMLElement;

      // Get all focusable elements within the dialog
      const getFocusableElements = (): HTMLElement[] => {
        if (!dialogRef.current) return [];
        return Array.from(
          dialogRef.current.querySelectorAll(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element
      if (dismissButtonRef.current) {
        dismissButtonRef.current.focus();
      } else if (firstElement) {
        firstElement.focus();
      }

      // Handle Tab key to trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        // Return focus to trigger element when dialog closes
        if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  const handleRecalculatePrices = async () => {
    setRecalculating(true);
    try {
      await onRecalculatePrices();
      showSuccess('Prices recalculated successfully');
      onClose();
    } catch (err) {
      logger.error('[MenuUnlockChangesDialog] Error recalculating prices:', err);
      showError('Failed to recalculate prices. Please try again.');
    } finally {
      setRecalculating(false);
    }
  };

  const handleDismiss = async () => {
    try {
      // Mark changes as handled
      const response = await fetch(`/api/menus/${menuId}/changes/handle`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark changes as handled');
      }

      onDismiss();
      onClose();
    } catch (err) {
      logger.error('[MenuUnlockChangesDialog] Error dismissing changes:', err);
      showError('Failed to dismiss changes. Please try again.');
    }
  };

  if (!isOpen) return null;

  const groupedChanges = groupChangesByType(changes);
  const dishCount = groupedChanges.dish.length;
  const recipeCount = groupedChanges.recipe.length;
  const ingredientCount = groupedChanges.ingredient.length;

  const summaryParts: string[] = [];
  if (dishCount > 0) summaryParts.push(`${dishCount} dish${dishCount !== 1 ? 'es' : ''}`);
  if (recipeCount > 0) summaryParts.push(`${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}`);
  if (ingredientCount > 0)
    summaryParts.push(`${ingredientCount} ingredient${ingredientCount !== 1 ? 's' : ''}`);

  const summary = summaryParts.join(', ');

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="desktop:p-8 relative z-50 w-full max-w-2xl rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={AlertCircle} size="xl" className="text-yellow-400" aria-hidden={true} />
            <div>
              <h2 id="dialog-title" className="text-fluid-xl font-bold text-white">
                Changes Detected While Menu Was Locked
              </h2>
              <p id="dialog-description" className="mt-1 text-sm text-gray-400">
                {summary} changed while this menu was locked. Prices need to be recalculated.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            aria-label="Close dialog"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        {/* Changes List */}
        <div className="mb-6 max-h-96 space-y-4 overflow-y-auto">
          {/* Dishes */}
          {groupedChanges.dish.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                Dishes ({groupedChanges.dish.length})
              </h3>
              <div className="space-y-2">
                {groupedChanges.dish.map(change => (
                  <div
                    key={change.id}
                    className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
                  >
                    <div className="font-medium text-white">{change.entity_name}</div>
                    <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recipes */}
          {groupedChanges.recipe.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                Recipes ({groupedChanges.recipe.length})
              </h3>
              <div className="space-y-2">
                {groupedChanges.recipe.map(change => (
                  <div
                    key={change.id}
                    className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
                  >
                    <div className="font-medium text-white">{change.entity_name}</div>
                    <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {groupedChanges.ingredient.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                Ingredients ({groupedChanges.ingredient.length})
              </h3>
              <div className="space-y-2">
                {groupedChanges.ingredient.map(change => (
                  <div
                    key={change.id}
                    className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
                  >
                    <div className="font-medium text-white">{change.entity_name}</div>
                    <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="desktop:flex-row flex flex-col gap-3">
          <button
            onClick={handleRecalculatePrices}
            disabled={recalculating}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={Calculator} size="sm" aria-hidden={true} />
            <span>{recalculating ? 'Recalculating...' : 'Recalculate All Prices'}</span>
          </button>
          {onReviewChanges && (
            <button
              onClick={onReviewChanges}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            >
              <Icon icon={Eye} size="sm" aria-hidden={true} />
              <span>Review Changes</span>
            </button>
          )}
          <button
            ref={dismissButtonRef}
            onClick={handleDismiss}
            className="flex flex-1 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
