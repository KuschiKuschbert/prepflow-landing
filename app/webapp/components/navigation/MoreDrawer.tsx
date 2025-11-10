'use client';

import { useDrawerAutoClose } from '@/hooks/useDrawerAutoClose';
import { useDrawerSwipe } from '@/hooks/useDrawerSwipe';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DrawerContent } from './DrawerContent';
import { DrawerFooter } from './DrawerFooter';
import { DrawerHandle } from './DrawerHandle';
import { DrawerHeader } from './DrawerHeader';
import { DrawerSearchButton } from './DrawerSearchButton';
import { SwipeIndicator } from './SwipeIndicator';
import { useNavigationItems } from './nav-items';

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
    isAtTop,
    upwardMovement,
    dragProgress,
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

  // Auto-close on scroll to top
  useDrawerAutoClose({ isOpen, contentRef, onClose });

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
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchStart={e => {
          // Only close on backdrop, not when touching drawer
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{
          opacity: isDragging ? Math.max(0.1, 1 - dragY / 500) : 1,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-x-0 bottom-0 z-[65] h-[75vh] max-h-[75vh] rounded-t-2xl border-t border-[#2a2a2a]/30 bg-[#1f1f1f]/70 shadow-2xl backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
        style={{
          transform: `translateY(${Math.max(0, dragY)}px)`,
          transition:
            isDragging && canDrag ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: upwardMovement > 0 ? Math.max(0.7, 1 - upwardMovement / 50) : 1,
        }}
        onTouchStart={handleDrawerTouchStart}
      >
        {/* Flex container for proper layout */}
        <div className="flex h-full flex-col">
          {/* Swipe indicator overlay */}
          <SwipeIndicator
            isAtTop={isAtTop}
            dragProgress={dragProgress}
            upwardMovement={upwardMovement}
            isDragging={isDragging}
            direction={isAtTop ? 'both' : 'down'}
          />

          {/* Handle bar - drag target */}
          <DrawerHandle
            onTouchStart={handleHandleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            dragProgress={dragProgress}
            isDragging={isDragging}
          />

          <DrawerHeader
            onClose={onClose}
            onContentTouchStart={handleContentTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            isAtTop={isAtTop}
            upwardMovement={upwardMovement}
          />

          <DrawerSearchButton onSearchClick={onSearchClick} />

          <DrawerContent
            contentRef={contentRef}
            groupedItems={groupedItems}
            isActive={isActive}
            onItemClick={handleItemClick}
            isDragging={isDragging}
            canDrag={canDrag}
            onContentTouchStart={handleContentTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          <DrawerFooter userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </>
  );
}
