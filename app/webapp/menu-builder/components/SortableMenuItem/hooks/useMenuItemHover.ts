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
export function useMenuItemHover({
  item,
  onHoverItem,
  onMouseMove,
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
    // Check if mouse is moving to the tooltip
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && tooltipRef?.current?.contains(relatedTarget)) {
      return; // Don't hide if moving to tooltip
    }
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
