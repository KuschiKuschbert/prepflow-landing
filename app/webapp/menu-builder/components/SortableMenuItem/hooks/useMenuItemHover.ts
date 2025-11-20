import { useState } from 'react';
import { MenuItem } from '../../../types';

interface UseMenuItemHoverProps {
  item: MenuItem;
  onHoverItem?: (item: MenuItem | null) => void;
  onMouseMove?: (position: { x: number; y: number }) => void;
}

/**
 * Hook for managing menu item hover state and mouse tracking.
 *
 * @param {UseMenuItemHoverProps} props - Hook props
 * @returns {Object} Hover state and handlers
 */
export function useMenuItemHover({ item, onHoverItem, onMouseMove }: UseMenuItemHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverItem?.(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Track mouse position relative to viewport
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    onMouseMove?.({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = (
    e: React.MouseEvent,
    tooltipRef?: React.RefObject<HTMLDivElement | null>,
  ) => {
    // Note: We don't check if mouse is moving to tooltip here because:
    // 1. relatedTarget can be null or invalid in some browsers/events, causing runtime errors
    // 2. The tooltip has its own mouse event handlers (onMouseEnter/onMouseLeave) to keep it visible
    // 3. This approach avoids the "Failed to execute 'contains' on 'Node'" TypeError

    // Simply hide the tooltip - if mouse moves to tooltip, its onMouseEnter will show it again
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
