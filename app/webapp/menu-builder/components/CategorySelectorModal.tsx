'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CategorySelectorModalProps {
  isOpen: boolean;
  categories: string[];
  itemName: string;
  anchorElement: HTMLElement | null;
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}

export default function CategorySelectorModal({
  isOpen,
  categories,
  itemName,
  anchorElement,
  onSelectCategory,
  onClose,
}: CategorySelectorModalProps) {
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen || !anchorElement) {
      setPopoverPosition(null);
      return;
    }

    // Use requestAnimationFrame to ensure layout is stable before calculating position
    requestAnimationFrame(() => {
      // Get fresh bounding rect when modal opens
      const rect = anchorElement.getBoundingClientRect();

      // Calculate popover position, ensuring it stays within viewport
      const popoverWidth = 280; // Fixed width for compact dropdown
      const itemHeight = 48; // Approximate height per category item
      const headerHeight = 60; // Header + padding
      const maxHeight = 320; // Max height before scrolling
      const popoverHeight = Math.min(headerHeight + categories.length * itemHeight, maxHeight);
      const gap = 8;

      // Align popover's left edge with item's left edge
      let left = rect.left;
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
  }, [isOpen, anchorElement, categories.length]);

  if (!isOpen || !anchorElement || !popoverPosition) return null;

  const popoverContent = (
    <>
      {/* Backdrop - lighter, clickable to close */}
      <div className="fixed inset-0 z-[75] bg-black/20" onClick={onClose} aria-hidden="true" />
      {/* Popover positioned near the item */}
      <div
        className="fixed z-[80] w-[280px] rounded-xl bg-gradient-to-r from-[#29E7CD]/30 via-[#D925C7]/30 to-[#29E7CD]/30 p-[1px] shadow-2xl"
        style={{
          left: `${popoverPosition.left}px`,
          top: `${popoverPosition.top}px`,
          maxHeight: `320px`,
        }}
      >
        <div className="rounded-xl bg-[#1f1f1f]/95" style={{ maxHeight: `320px` }}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
            <p className="text-sm font-medium text-gray-300">Add to category</p>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Close"
            >
              <Icon icon={X} size="sm" />
            </button>
          </div>
          {/* Categories list */}
          <div className="max-h-[260px] overflow-y-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  onSelectCategory(category);
                  onClose();
                }}
                className="w-full border-b border-[#2a2a2a]/50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#2a2a2a]/50 hover:text-[#29E7CD]"
              >
                <span className="text-sm font-medium text-white">{category}</span>
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
