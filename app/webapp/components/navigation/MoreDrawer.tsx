'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { getCategoryLabel } from './CategorySection';
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
 * Fixed list of all navigation items organized by category (no expanding).
 * Optimized for one-handed use.
 */
export const MoreDrawer = memo(function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems();

  // Group items by category (excluding primary - they're in bottom nav)
  const groupedItems = useMemo(() => {
    const categoryOrder = ['kitchen', 'team', 'inventory', 'tools'];
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
    // Return in order
    return categoryOrder
      .filter(cat => groups[cat]?.length > 0)
      .map(cat => ({ category: cat, items: groups[cat] }));
  }, [allItems]);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const handleItemClick = () => {
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[65] bg-black/30 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Fixed Menu Card */}
      <div className="fixed right-4 bottom-[calc(var(--bottom-navbar-height)+1rem)] z-[70] max-h-[70vh] w-[280px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div
          ref={menuRef}
          className="flex max-h-[calc(70vh-2px)] flex-col rounded-2xl"
          style={{
            transformOrigin: 'bottom right',
            animation: isOpen ? 'scale-in-bubble 0.2s var(--easing-standard) forwards' : 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Scrollable Navigation List */}
          <div className="overflow-y-auto overscroll-contain">
            {groupedItems.map(({ category, items }, catIndex) => (
              <div
                key={category}
                className={catIndex > 0 ? 'border-t border-[var(--border)]/50' : ''}
              >
                {/* Category Header */}
                <div className="sticky top-0 bg-[var(--surface)] px-4 pt-3 pb-1">
                  <span className="text-[10px] font-semibold tracking-wider text-[var(--foreground-subtle)] uppercase">
                    {getCategoryLabel(category)}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-0.5 px-2 pb-2">
                  {items.map(item => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      color={item.color}
                      isActive={isActive(item.href)}
                      onClick={handleItemClick}
                      onTrack={trackNavigation}
                      iconSize="sm"
                      showLabel={true}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
