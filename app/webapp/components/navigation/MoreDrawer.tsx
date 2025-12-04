'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { prefersReducedMotion } from '@/lib/arcadeGuards';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { useNavigationItems } from './nav-items';
import { NavItem } from './NavItem';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSearchClick: () => void;
}

/**
 * More Drawer component for mobile navigation.
 * A floating card expanding from the bottom-right corner containing navigation links.
 * Shows all navigation items organized by category, with a search button.
 */
export const MoreDrawer = memo(function MoreDrawer({
  isOpen,
  onClose,
  onOpen,
  onSearchClick,
}: MoreDrawerProps) {
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
        className="fixed inset-0 z-[65] bg-black/20 backdrop-blur-[1px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden={true}
        style={{
          transitionTimingFunction: 'var(--easing-decelerated)',
        }}
      />

      {/* Floating Menu Card - Animated from button position (bottom-right) */}
      <div className="fixed right-4 bottom-[calc(var(--bottom-navbar-height)+1rem)] z-[70] max-h-[70vh] w-[300px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div
          ref={menuRef}
          className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#1f1f1f]/95"
          style={{
            transformOrigin: 'bottom right',
            animation: isOpen ? 'scale-in-bubble 0.25s var(--easing-spring) forwards' : 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="More navigation"
        >
          <div className="flex h-full flex-col overflow-y-auto p-3">
            {/* Search Button */}
            <button
              onClick={() => {
                onSearchClick();
                onClose();
              }}
              className="mb-3 flex w-full items-center gap-3 rounded-xl bg-[#2a2a2a]/50 p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-[#2a2a2a]/70 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              style={{
                transitionTimingFunction: 'var(--easing-standard)',
              }}
              aria-label="Search"
            >
              <Icon icon={Search} size="md" className="text-[#29E7CD]" aria-hidden={true} />
              <span className="text-sm font-medium text-white">Search</span>
            </button>

            {/* Scrollable Content */}
            <div className="space-y-5 p-3">
              {Object.entries(groupedItems).map(([category, items]) => {
                // Primary items shown directly without category header
                if (category === 'primary') {
                  return (
                    <div key={category} className="space-y-2">
                      {items.map((item, index) => {
                        const reducedMotion = prefersReducedMotion();
                        return (
                          <div
                            key={item.href}
                            style={{
                              animation: reducedMotion
                                ? 'none'
                                : `fadeInUp 0.3s var(--easing-standard) forwards`,
                              animationDelay: reducedMotion ? '0ms' : `${index * 20}ms`,
                              opacity: reducedMotion ? 1 : 0,
                            }}
                          >
                            <NavItem
                              href={item.href}
                              label={item.label}
                              icon={item.icon}
                              color={item.color}
                              isActive={isActive(item.href)}
                              onClick={
                                handleItemClick ? () => handleItemClick(item.href) : undefined
                              }
                              onTrack={trackNavigation}
                              iconSize="sm"
                              showLabel={true}
                              compact={true}
                            />
                          </div>
                        );
                      })}
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
