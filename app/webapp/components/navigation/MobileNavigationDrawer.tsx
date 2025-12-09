'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCategoryLabel } from './CategorySection';
import { useNavigationItems } from './nav-items';
import { NavItem } from './NavItem';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Mobile Navigation Drawer - Scrollable Burger Menu.
 * Full-height scrollable drawer with categorized navigation items.
 * Instagram/Gmail style with smooth animations.
 */
export const MobileNavigationDrawer = memo(function MobileNavigationDrawer({
  isOpen,
  onClose,
}: MobileNavigationDrawerProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems();
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Group items by category (excluding primary as they're in bottom nav)
  const groupedItems = useMemo(
    () =>
      allItems.reduce(
        (acc, item) => {
          const category = item.category || 'other';
          if (category === 'primary') return acc; // Skip primary items
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, typeof allItems>,
      ),
    [allItems],
  );

  // Categories in display order
  const categoryOrder = ['kitchen', 'team', 'inventory', 'tools'];

  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  // Handle item click - close drawer
  const handleItemClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Swipe down to close (on header)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY;
      if (deltaY > 50) {
        onClose();
      }
      setTouchStartY(null);
    },
    [touchStartY, onClose],
  );

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
        className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden={true}
        style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 z-[70] flex w-[85%] max-w-[320px] flex-col bg-[#1f1f1f] shadow-2xl"
        style={{
          animation: 'slideInRight 0.3s var(--easing-standard) forwards',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div
          className="flex flex-shrink-0 items-center justify-between border-b border-[#2a2a2a] px-4 py-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#2a2a2a]/50 active:scale-95"
            aria-label="Close menu"
          >
            <Icon icon={X} size="sm" className="text-gray-400" aria-hidden={true} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            paddingBottom:
              'calc(var(--bottom-navbar-height) + var(--safe-area-inset-bottom) + 1rem)',
          }}
        >
          {categoryOrder.map(category => {
            const items = groupedItems[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category} className="border-b border-[#2a2a2a]/50">
                {/* Category Header */}
                <div className="px-4 pt-4 pb-2">
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {getCategoryLabel(category)}
                  </span>
                </div>

                {/* Category Items */}
                <div className="space-y-1 px-2 pb-3">
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
            );
          })}
        </div>
      </div>
    </>
  );
});
