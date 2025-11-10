'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useDrawerSwipe } from '@/hooks/useDrawerSwipe';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LogoutButton } from '../LogoutButton';
import { CategorySection } from './CategorySection';
import { useNavigationItems } from './nav-items';
import { useSession } from 'next-auth/react';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: () => void;
}

export function MoreDrawer({ isOpen, onClose, onSearchClick }: MoreDrawerProps) {
  const pathname = usePathname();
  const allItems = useNavigationItems();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];

  // Swipe gesture hook
  const {
    dragY,
    isDragging,
    canDrag,
    drawerRef,
    contentRef,
    handleHandleTouchStart,
    handleContentTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDrawerTouchStart,
  } = useDrawerSwipe({ isOpen, onClose });

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
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

  // Handle item click - close drawer, let Link handle navigation
  const handleItemClick = (href: string) => {
    // Close drawer - Link will handle navigation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchStart={e => {
          // Only close on backdrop, not when touching drawer
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{
          opacity: isDragging ? Math.max(0.2, 1 - dragY / 500) : 1,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-x-0 bottom-0 z-[65] max-h-[75vh] rounded-t-2xl border-t border-[#2a2a2a]/50 bg-[#1f1f1f]/95 shadow-2xl backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
        style={{
          transform: `translateY(${Math.max(0, dragY)}px)`,
          transition:
            isDragging && canDrag ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleDrawerTouchStart}
      >
        {/* Handle bar - drag target */}
        <div
          className="flex cursor-grab items-center justify-center pt-2 pb-1.5 select-none active:cursor-grabbing"
          onTouchStart={handleHandleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <div className="h-1 w-10 rounded-full bg-gray-500/60" />
        </div>

        {/* Header - also draggable when content is at top */}
        <div
          className="flex items-center justify-between border-b border-[#2a2a2a]/30 px-3 py-2 select-none"
          onTouchStart={e => {
            // Allow dragging from header area when content is at top
            handleContentTouchStart(e);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className="text-base font-semibold text-white/90">Navigation</h2>
          <button
            onClick={onClose}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg transition-colors hover:bg-[#2a2a2a]/30"
            aria-label="Close navigation"
          >
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search button */}
        <div className="border-b border-[#2a2a2a]/30 px-3 py-2">
          <button
            onClick={onSearchClick}
            className="flex w-full items-center space-x-2 rounded-lg border border-[#2a2a2a]/30 bg-[#2a2a2a]/20 px-3 py-2 text-left transition-colors hover:bg-[#2a2a2a]/40"
          >
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs text-gray-400">Search...</span>
          </button>
        </div>

        {/* Navigation items */}
        <div
          ref={contentRef}
          className="overflow-y-auto px-3 py-2"
          style={{
            maxHeight: 'calc(75vh - 160px)',
            touchAction: isDragging && canDrag ? 'none' : 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={e => {
            // Don't interfere with Link clicks - check if target is a link
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link) {
              // Allow link to handle its own touch event - don't interfere with navigation
              // Stop event propagation to prevent drag handlers from interfering
              e.stopPropagation();
              return;
            }
            // Check if we should start dragging or allow scrolling
            handleContentTouchStart(e);
          }}
          onTouchMove={e => {
            // Don't interfere with link touches
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link) {
              e.stopPropagation();
              return;
            }
            // If dragging, handle drag; otherwise allow scroll
            if (isDragging && canDrag) {
              handleTouchMove(e);
            }
          }}
          onTouchEnd={e => {
            // Don't interfere with link touches
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link) {
              e.stopPropagation();
              return;
            }
            handleTouchEnd();
          }}
        >
          {Object.entries(groupedItems).map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              isActive={isActive}
              onItemClick={handleItemClick}
              compact={true}
            />
          ))}
        </div>

        {/* Footer with settings */}
        <div className="border-t border-[#2a2a2a]/30 px-3 py-2">
          {userName && (
            <div className="mb-2 rounded-lg bg-[#2a2a2a]/20 px-2 py-1.5">
              <div className="text-[10px] text-gray-500">Logged in as</div>
              <div
                className="text-xs font-medium text-white/90"
                title={userEmail || 'Logged in user'}
              >
                {userName}
              </div>
            </div>
          )}
          <div className="mb-1.5 text-[10px] tracking-wider text-gray-500 uppercase">Settings</div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Language</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Account</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
