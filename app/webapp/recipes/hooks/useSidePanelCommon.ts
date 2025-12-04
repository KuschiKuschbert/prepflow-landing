'use client';

import { RefObject, useEffect, useRef, useState } from 'react';

interface UseSidePanelCommonProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

interface UseSidePanelCommonReturn {
  panelRef: RefObject<HTMLDivElement | null>;
  previousActiveElement: RefObject<HTMLElement | null>;
  mounted: boolean;
  panelStyle: React.CSSProperties;
}

/**
 * Shared hook for common side panel functionality.
 * Extracts duplicate logic from DishSidePanel and RecipeSidePanel.
 *
 * Handles:
 * - Panel positioning based on screen size
 * - Keyboard shortcuts (Escape to close, E to edit)
 * - Body scroll prevention on mobile
 * - Mount check for portal rendering
 *
 * @param {UseSidePanelCommonProps} props - Hook props
 * @returns {UseSidePanelCommonReturn} Panel refs, mounted state, and panel style
 */
export function useSidePanelCommon({
  isOpen,
  onClose,
  onEdit,
}: UseSidePanelCommonProps): UseSidePanelCommonReturn {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
    height: 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
    right: 0,
  });

  // Update panel position based on screen size
  useEffect(() => {
    const updatePanelStyle = () => {
      const isDesktop = window.innerWidth >= 1024;
      setPanelStyle({
        position: 'fixed',
        top: isDesktop
          ? 'calc(var(--header-height-desktop) + var(--safe-area-inset-top))'
          : 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        height: isDesktop
          ? 'calc(100vh - var(--header-height-desktop) - var(--safe-area-inset-top))'
          : 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
        right: 0,
      });
    };

    updatePanelStyle();
    window.addEventListener('resize', updatePanelStyle);
    return () => window.removeEventListener('resize', updatePanelStyle);
  }, []);

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position
    const scrollY = window.scrollY;
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus panel without scrolling
    if (panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
      // Restore scroll position immediately in case focus caused any scroll
      window.scrollTo(0, scrollY);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey && onEdit) {
        // Press E to edit (only if not in an input field)
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onEdit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus without scrolling
      if (previousActiveElement.current) {
        previousActiveElement.current.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, onEdit]);

  // Click outside to close (desktop)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;

      // Don't close if clicking inside the panel
      if (panelRef.current?.contains(target)) {
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

      // Close the panel
      onClose();
    };

    // Use mousedown instead of click to catch clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open on mobile
  // Also prevent scroll restoration when panel opens
  useEffect(() => {
    if (isOpen) {
      // Store scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      // Prevent scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Restore scroll position if it changed
      requestAnimationFrame(() => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(0, scrollY);
        }
      });
    } else {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [isOpen]);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    panelRef,
    previousActiveElement,
    mounted,
    panelStyle,
  };
}
