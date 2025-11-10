'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useNavigationItems } from './nav-items';
import { CategorySection } from './CategorySection';
import { SearchModal } from './SearchModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LogoutButton } from '../LogoutButton';
import { useDrawerSwipe } from '@/hooks/useDrawerSwipe';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: () => void;
}

export function MoreDrawer({ isOpen, onClose, onSearchClick }: MoreDrawerProps) {
  const pathname = usePathname();
  const allItems = useNavigationItems();

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchStart={e => {
          // Only close on backdrop, not when touching drawer
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{
          opacity: isDragging ? Math.max(0.3, 1 - dragY / 500) : 1,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-x-0 bottom-0 z-[65] max-h-[90vh] rounded-t-3xl border-t border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl"
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
          className="flex cursor-grab items-center justify-center pt-3 pb-2 select-none active:cursor-grabbing"
          onTouchStart={handleHandleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <div className="h-1 w-12 rounded-full bg-gray-600" />
        </div>

        {/* Header - also draggable when content is at top */}
        <div
          className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3 select-none"
          onTouchStart={e => {
            // Allow dragging from header area when content is at top
            handleContentTouchStart(e);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className="text-lg font-semibold text-white">Navigation</h2>
          <button
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-[#2a2a2a]/50"
            aria-label="Close navigation"
          >
            <svg
              className="h-5 w-5 text-gray-400"
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
        <div className="border-b border-[#2a2a2a] p-4">
          <button
            onClick={onSearchClick}
            className="flex w-full items-center space-x-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50"
          >
            <svg
              className="h-5 w-5 text-gray-400"
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
            <span className="text-sm text-gray-400">Search... (⌘K)</span>
          </button>
        </div>

        {/* Navigation items */}
        <div
          ref={contentRef}
          className="overflow-y-auto px-4 py-4"
          style={{
            maxHeight: 'calc(90vh - 200px)',
            touchAction: isDragging && canDrag ? 'none' : 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={e => {
            // Check if we should start dragging or allow scrolling
            handleContentTouchStart(e);
          }}
          onTouchMove={e => {
            // If dragging, handle drag; otherwise allow scroll
            if (isDragging && canDrag) {
              handleTouchMove(e);
            }
          }}
          onTouchEnd={handleTouchEnd}
        >
          {Object.entries(groupedItems).map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              isActive={isActive}
              onItemClick={onClose}
            />
          ))}
        </div>

        {/* Footer with settings */}
        <div className="border-t border-[#2a2a2a] p-4">
          <div className="mb-2 text-xs tracking-wider text-gray-400 uppercase">Settings</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Language</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Account</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
