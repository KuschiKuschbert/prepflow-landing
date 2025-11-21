import { useState } from 'react';
import { MenuItem } from '../../../types';

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

  /**
   * Check if mouse is within exclusion zone (20px) of reorder button.
   */
  const isWithinReorderExclusionZone = (mouseX: number, mouseY: number): boolean => {
    if (!reorderButtonRef?.current) return false;

    const buttonRect = reorderButtonRef.current.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Calculate distance from mouse to button center
    const distanceX = Math.abs(mouseX - buttonCenterX);
    const distanceY = Math.abs(mouseY - buttonCenterY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Exclude if within 20 pixels
    return distance < 20;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverItem?.(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Check if mouse is within exclusion zone of reorder button
    const isInExclusionZone = isWithinReorderExclusionZone(e.clientX, e.clientY);

    if (isInExclusionZone) {
      // Hide tooltip if within exclusion zone
      if (isHovered) {
        setIsHovered(false);
        onHoverItem?.(null);
        setMousePosition(undefined);
      }
      return;
    }

    // Track mouse position relative to viewport
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    onMouseMove?.({ x: e.clientX, y: e.clientY });

    // Show tooltip if not already shown and not in exclusion zone
    if (!isHovered) {
      setIsHovered(true);
      onHoverItem?.(item);
    }
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
