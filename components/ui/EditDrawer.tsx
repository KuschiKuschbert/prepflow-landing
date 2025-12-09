'use client';

import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  preventClose?: boolean; // Prevent closing if form has unsaved changes
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export function EditDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  onSave,
  saving = false,
  maxWidth = 'xl',
  preventClose = false,
}: EditDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)'); // desktop: breakpoint is 1025px
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  // Click outside to close (matching recipe side panel behavior)
  useEffect(() => {
    if (!isOpen || preventClose) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;

      // Don't close if clicking inside the drawer
      if (drawerRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on modals or dialogs
      if (target.closest('[role="dialog"]') || target.closest('[aria-modal="true"]')) {
        return;
      }

      // Don't close if clicking on dropdowns or menus
      if (target.closest('[role="menu"]') || target.closest('[role="listbox"]')) {
        return;
      }

      // Close the drawer
      onClose();
    };

    // Use mousedown instead of click to catch clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, preventClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventClose]);

  // Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isOpen && onSave) {
        e.preventDefault();
        onSave();
      }
    };
    document.addEventListener('keydown', handleSave);
    return () => document.removeEventListener('keydown', handleSave);
  }, [isOpen, onSave]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTranslateX(0);
      setIsSwiping(false);
      setSwipeStartX(null);
      setSwipeStartY(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus first input when drawer opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Small delay to ensure drawer animation has started
      setTimeout(() => {
        const firstInput = contentRef.current?.querySelector(
          'input:not([type="hidden"]), textarea, select',
        ) as HTMLElement;
        if (firstInput) {
          firstInput.focus();
          // Scroll input into view on mobile
          if (isMobile) {
            firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  // Swipe-to-close gesture (right-side drawer, swipe right to close)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setSwipeStartX(e.touches[0].clientX);
    setSwipeStartY(e.touches[0].clientY);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isSwiping || swipeStartX === null || swipeStartY === null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - swipeStartX;
    const deltaY = Math.abs(currentY - swipeStartY);

    // Only allow swipe if it's primarily horizontal (swipe right to close)
    // And prevent if scrolling vertically
    if (deltaX > 0 && deltaX > deltaY * 1.5) {
      e.preventDefault();
      setTranslateX(Math.min(deltaX, 400)); // Cap at 400px
    } else if (deltaY > deltaX) {
      // Vertical scroll detected, cancel swipe
      setIsSwiping(false);
      setTranslateX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isSwiping) return;

    const minSwipeDistance = 100;
    if (translateX > minSwipeDistance && !preventClose) {
      onClose();
    } else {
      // Snap back
      setTranslateX(0);
    }

    setIsSwiping(false);
    setSwipeStartX(null);
    setSwipeStartY(null);
  };

  if (!isOpen) return null;

  const widthClass = isMobile ? 'w-full' : maxWidthClasses[maxWidth] || maxWidthClasses.xl;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={preventClose ? undefined : onClose}
        aria-hidden={true}
        style={{
          opacity: isSwiping ? Math.max(0.3, 1 - translateX / 400) : 1,
        }}
      />

      {/* Drawer with gradient border */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[75] h-full ${widthClass} transform rounded-l-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-drawer-title"
        style={{
          transform: `translateX(${isSwiping ? translateX : 0}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex h-full flex-col rounded-l-3xl bg-[#1f1f1f]">
          {/* Header */}
          <div
            className="desktop:px-6 desktop:py-4 sticky top-0 z-10 flex items-center justify-between border-b border-[#2a2a2a] bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a]/50 px-4 py-3 backdrop-blur-sm"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <h2 id="edit-drawer-title" className="desktop:text-xl text-lg font-bold text-white">
              {title}
            </h2>
            <button
              onClick={preventClose ? undefined : onClose}
              disabled={preventClose}
              className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close drawer"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            ref={contentRef}
            className="desktop:px-6 desktop:py-6 flex-1 overflow-y-auto px-4 py-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="desktop:px-6 desktop:py-4 sticky bottom-0 border-t border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
