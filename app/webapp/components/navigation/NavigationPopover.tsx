'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useWorkflowPreference } from '@/lib/workflow/preferences';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef } from 'react';
import { CategorySection } from './CategorySection';
import { useNavigationItems } from './nav-items';

interface NavigationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | HTMLButtonElement | null>;
}

/**
 * Navigation popover component for mobile devices.
 * Displays grouped navigation items in a Material 3 floating menu.
 * Positioned above bottom navigation bar, anchored to "More" button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the popover
 * @param {Function} props.onClose - Callback to close the popover
 * @param {RefObject} props.triggerRef - Ref to the trigger button element
 * @returns {JSX.Element | null} The rendered navigation popover or null if not open
 *
 * @example
 * ```tsx
 * <NavigationPopover
 *   isOpen={isPopoverOpen}
 *   onClose={() => setIsPopoverOpen(false)}
 *   triggerRef={moreButtonRef}
 * />
 * ```
 */
export const NavigationPopover = memo(function NavigationPopover({
  isOpen,
  onClose,
  triggerRef,
}: NavigationPopoverProps) {
  const pathname = usePathname();
  const { workflow } = useWorkflowPreference();
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems(workflow);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Group items by category
  const groupedItems = allItems.reduce(
    (acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof allItems>,
  );

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  // Handle item click - close popover, let Link handle navigation
  const handleItemClick = (href: string) => {
    onClose();
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      // Store trigger element for focus return
      triggerElementRef.current = document.activeElement as HTMLElement;

      // Get all focusable elements within the popover
      const getFocusableElements = (): HTMLElement[] => {
        if (!popoverRef.current) return [];
        return Array.from(
          popoverRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element if available
      if (firstElement) {
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

      document.addEventListener('keydown', handleTab);

      return () => {
        document.removeEventListener('keydown', handleTab);
        // Return focus to trigger element when popover closes
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Popover */}
      <div
        ref={popoverRef}
        className="fixed right-4 bottom-20 z-[60] max-h-[60vh] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
      >
        {/* Content */}
        <div
          className="overflow-y-auto px-3 py-3"
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {Object.entries(groupedItems).map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              isActive={isActive}
              onItemClick={handleItemClick}
              onTrack={trackNavigation}
              compact={true}
              workflow={workflow}
            />
          ))}
        </div>
      </div>
    </>
  );
});
