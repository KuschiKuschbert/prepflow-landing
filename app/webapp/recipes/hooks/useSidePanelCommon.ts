'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { updatePanelStyle } from './useSidePanelCommon/helpers/updatePanelStyle';
import { createClickOutsideHandler } from './useSidePanelCommon/helpers/handleClickOutside';
import { createKeyboardHandler } from './useSidePanelCommon/helpers/handleKeyboardShortcuts';
import { manageBodyScroll } from './useSidePanelCommon/helpers/manageBodyScroll';

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
 * Shared hook for common side panel functionality. Handles panel positioning, keyboard shortcuts, body scroll prevention, and mount check.
 */
export function useSidePanelCommon({
  isOpen,
  onClose,
  onEdit,
}: UseSidePanelCommonProps): UseSidePanelCommonReturn {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ position: 'fixed', top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))', height: 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))', right: 0 });

  useEffect(() => {
    const handleResize = () => setPanelStyle(updatePanelStyle());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    previousActiveElement.current = document.activeElement as HTMLElement;
    if (panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
      window.scrollTo(0, scrollY);
    }
    const handleKeyDown = createKeyboardHandler(onClose, onEdit);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, onEdit]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = createClickOutsideHandler(panelRef, onClose);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    return manageBodyScroll(isOpen);
  }, [isOpen]);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  return { panelRef, previousActiveElement, mounted, panelStyle };
}
