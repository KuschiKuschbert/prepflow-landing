'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { useNavigationItems } from './nav-items';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSearchClick: () => void;
}

/**
 * More Drawer component for mobile navigation.
 * Fixed list of all navigation items organized by category (no expanding).
 * Optimized for one-handed use.
 */
export const MoreDrawer = memo(function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group items by category (excluding primary - they're in bottom nav)
  const groupedItems = useMemo(() => {
    const groups = allItems.reduce(
      (acc, item) => {
        const category = item.category || 'other';
        if (category === 'primary') return acc; // Skip primary items
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, typeof allItems>,
    );
    return groups;
  }, [allItems]);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const handleItemClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCategoryToggle = useCallback((category: string) => {
    setExpandedCategory(prev => (prev === category ? null : category));
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[65] bg-black/30 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Fixed Menu Card - Matches desktop sidebar styling */}
      <div className="fixed right-4 bottom-[calc(var(--bottom-navbar-height)+1rem)] z-[70] max-h-[70vh] w-[280px] rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div
          ref={menuRef}
          className="glass-panel flex max-h-[calc(70vh-2px)] flex-col rounded-2xl"
          style={{
            transformOrigin: 'bottom right',
            animation: isOpen ? 'scale-in-bubble 0.2s var(--easing-standard) forwards' : 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Scrollable Navigation List */}
          <div className="overflow-y-auto overscroll-contain p-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <ExpandableCategorySection
                key={category}
                category={category}
                items={items}
                isActive={isActive}
                onItemClick={handleItemClick}
                onTrack={trackNavigation}
                isExpanded={expandedCategory === category}
                onToggle={handleCategoryToggle}
                defaultExpanded={false}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
