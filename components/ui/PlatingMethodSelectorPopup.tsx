'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type PlatingMethodOption = 'landscape' | 'classic' | 'stacking' | 'deconstructed';

interface PlatingMethodSelectorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (selectedMethods: PlatingMethodOption[]) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const platingMethodLabels: Record<PlatingMethodOption, string> = {
  classic: 'Classic Plating',
  stacking: 'Stacking',
  landscape: 'Landscape Plating',
  deconstructed: 'Deconstructive Plating',
};

const platingMethodDescriptions: Record<PlatingMethodOption, string> = {
  classic: 'Traditional clock method with balanced symmetry',
  stacking: 'Vertical tower with layered ingredients',
  landscape: 'Horizontal flow mimicking natural landscapes',
  deconstructed: 'Components separated for individual experience',
};

// Ordered array for consistent display order
const platingMethodOrder: PlatingMethodOption[] = [
  'classic',
  'stacking',
  'landscape',
  'deconstructed',
];

/**
 * Popup component for selecting plating methods before image generation
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {Function} props.onClose - Callback when popup is closed
 * @param {Function} props.onGenerate - Callback when generate is clicked (receives selected methods)
 * @param {React.RefObject} [props.triggerRef] - Reference to the trigger button for positioning
 * @returns {JSX.Element | null} Rendered popup or null if not open
 */
export function PlatingMethodSelectorPopup({
  isOpen,
  onClose,
  onGenerate,
  triggerRef,
}: PlatingMethodSelectorPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(
    null,
  );

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Calculate position relative to trigger button
  useEffect(() => {
    if (!isOpen || !triggerRef?.current) {
      setPopoverPosition(null);
      return;
    }

    // Use requestAnimationFrame to ensure layout is stable before calculating position
    requestAnimationFrame(() => {
      if (!triggerRef?.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 200;
      const itemHeight = 40; // Approximate height per plating option (more compact)
      const headerHeight = 48; // Header + padding (more compact)
      const maxHeight = 240; // Max height before scrolling (more compact)
      const popoverHeight = Math.min(headerHeight + 4 * itemHeight, maxHeight);
      const gap = 8;

      // Position below button, centered horizontally
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      let top = rect.bottom + gap;

      // Keep popover within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position to stay in viewport
      if (left < 16) {
        left = 16;
      } else if (left + popoverWidth > viewportWidth - 16) {
        left = viewportWidth - popoverWidth - 16;
      }

      // Adjust vertical position - prefer below, but flip above if needed
      if (top + popoverHeight > viewportHeight - 16) {
        top = rect.top - popoverHeight - gap;
        // If still doesn't fit, position at top of viewport
        if (top < 16) {
          top = 16;
        }
      }

      setPopoverPosition({ left, top });
    });
  }, [isOpen, triggerRef]);

  const handleSelectMethod = (method: PlatingMethodOption) => {
    onGenerate([method]);
    onClose();
  };

  if (!isOpen || !triggerRef?.current || !popoverPosition) return null;

  const popoverContent = (
    <>
      {/* Light backdrop - clickable to close */}
      <div className="fixed inset-0 z-[75] bg-black/20" onClick={onClose} aria-hidden={true} />
      {/* Popover positioned near the button */}
      <div
        ref={popupRef}
        className="fixed z-[80] w-[200px] rounded-xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl"
        style={{
          left: `${popoverPosition.left}px`,
          top: `${popoverPosition.top}px`,
          maxHeight: '240px',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plating-popup-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-xl bg-[var(--surface)]/95" style={{ maxHeight: '240px' }}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
            <p
              id="plating-popup-title"
              className="text-xs font-medium text-[var(--foreground-secondary)]"
            >
              Select Plating Style
            </p>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Icon icon={X} size="xs" />
            </button>
          </div>
          {/* Plating Options - Simple List */}
          <div className="max-h-[192px] overflow-y-auto">
            {platingMethodOrder.map(method => (
              <button
                key={method}
                onClick={() => handleSelectMethod(method)}
                className="w-full border-b border-[var(--border)]/50 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-[var(--muted)]/50 hover:text-[var(--primary)]"
              >
                <div className="text-xs font-medium text-[var(--foreground)]">
                  {platingMethodLabels[method]}
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--foreground-muted)]">
                  {platingMethodDescriptions[method]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Render in portal to ensure proper positioning context
  return typeof window !== 'undefined' ? createPortal(popoverContent, document.body) : null;
}
