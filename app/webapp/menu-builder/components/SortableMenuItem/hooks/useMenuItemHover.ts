import { useState } from 'react';
import type { MenuItem } from '../../../types';
import { isWithinReorderExclusionZone } from './useMenuItemHover/helpers/isWithinReorderExclusionZone';

interface UseMenuItemHoverProps {
  item: MenuItem;
  onHoverItem?: (item: MenuItem | null) => void;
  onMouseMove?: (position: { x: number; y: number }) => void;
  reorderButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Hook for managing menu item hover state and mouse tracking.
 *
 * @param {UseMenuItemHoverProps} props - Hook props
 * @returns {Object} Hover state and handlers
 */
export function useMenuItemHover({
  item,
  onHoverItem,
  onMouseMove,
  reorderButtonRef,
}: UseMenuItemHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverItem?.(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const isInExclusionZone = isWithinReorderExclusionZone(e.clientX, e.clientY, reorderButtonRef);
    if (isInExclusionZone) {
      if (isHovered) {
        setIsHovered(false);
        onHoverItem?.(null);
        setMousePosition(undefined);
      }
      return;
    }

    setMousePosition({ x: e.clientX, y: e.clientY });
    onMouseMove?.({ x: e.clientX, y: e.clientY });
    if (!isHovered) {
      setIsHovered(true);
      onHoverItem?.(item);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition(undefined);
    onHoverItem?.(null);
  };

  return {
    isHovered,
    setIsHovered,
    mousePosition,
    setMousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };
}
