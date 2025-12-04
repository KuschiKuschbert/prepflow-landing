'use client';

import { useSession } from 'next-auth/react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useNavigationItems } from './nav-items';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { NavItem } from './NavItem';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Mobile Navigation Menu (Chrome-style Popup).
 * A floating card expanding from the bottom-right corner containing navigation links.
 * Replaces the full-height side drawer for a lighter interaction.
 */
export const MobileNavigationDrawer = memo(function MobileNavigationDrawer({
  isOpen,
  onClose,
  menuButtonRef,
}: MobileNavigationDrawerProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const hasAutoExpandedRef = useRef(false);

  // Group items by category
  const groupedItems = useMemo(
    () =>
      allItems.reduce(
        (acc, item) => {
          const category = item.category || 'other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, typeof allItems>,
      ),
    [allItems],
  );

  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  // Auto-expand category if it contains active item (only when drawer first opens)
  useEffect(() => {
    if (!isOpen) {
      hasAutoExpandedRef.current = false;
      return;
    }
    // Only auto-expand once when drawer opens
    if (hasAutoExpandedRef.current) return;

    const activeCategory = Object.entries(groupedItems).find(([category, items]) => {
      if (category === 'primary') return false;
      return items.some(item => isActive(item.href));
    })?.[0];
    if (activeCategory) {
      setExpandedCategory(activeCategory);
      hasAutoExpandedRef.current = true;
    }
  }, [pathname, isOpen, groupedItems, isActive]);

  // Handle category toggle - collapse others when opening new one
  const handleCategoryToggle = (category: string) => {
    setExpandedCategory(prev => (prev === category ? null : category));
  };

  // Handle item click - close menu
  const handleItemClick = (href: string) => {
    onClose();
  };

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
      {/* Backdrop - Subtle dimming */}
      <div
        className="fixed inset-0 z-[65] bg-black/20 backdrop-blur-[1px] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Floating Menu Card - Animated from button position (bottom-right) */}
      <div className="fixed right-4 bottom-[calc(var(--bottom-navbar-height)+1rem)] z-[70] max-h-[70vh] w-[300px] overflow-hidden rounded-xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div
          ref={menuRef}
          className="flex h-full flex-col overflow-hidden rounded-xl bg-[#1f1f1f]/95"
          style={{
            transformOrigin: 'bottom right',
            animation: isOpen
              ? 'scale-in-bubble 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              : 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          {/* Header - Optional Title? Or just list? Chrome has no header usually. */}
          {/* Let's keep it clean list only, maybe just a small drag handle visual or nothing. */}

          <div className="flex h-full flex-col overflow-y-auto p-3">
            {/* Scrollable Content */}
            <div className="space-y-5 p-3">
              {Object.entries(groupedItems).map(([category, items]) => {
                // Primary items shown directly without category header
                if (category === 'primary') {
                  return (
                    <div key={category} className="space-y-2">
                      {items.map(item => (
                        <NavItem
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          color={item.color}
                          isActive={isActive(item.href)}
                          onClick={handleItemClick ? () => handleItemClick(item.href) : undefined}
                          onTrack={trackNavigation}
                          iconSize="sm"
                          showLabel={true}
                          compact={true}
                        />
                      ))}
                    </div>
                  );
                }
                // Secondary groups shown as expandable sections (controlled mode - only one open at a time)
                return (
                  <ExpandableCategorySection
                    key={category}
                    category={category}
                    items={items}
                    isActive={isActive}
                    onItemClick={handleItemClick}
                    onTrack={trackNavigation}
                    isExpanded={expandedCategory === category}
                    onToggle={handleCategoryToggle}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
