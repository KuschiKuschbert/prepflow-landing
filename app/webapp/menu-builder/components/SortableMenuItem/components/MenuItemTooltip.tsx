'use client';

import { MenuItem } from '../../../types';
import { MenuItemHoverStatistics } from '../../MenuItemHoverStatistics';

interface MenuItemTooltipProps {
  item: MenuItem;
  menuId: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number } | undefined;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  anchorElement?: HTMLElement | null; // Menu item element for positioning
  setIsHovered: (hovered: boolean) => void;
  setMousePosition: (position: { x: number; y: number } | undefined) => void;
  onHoverItem?: (item: MenuItem | null) => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

/**
 * Menu item hover tooltip component.
 *
 * @component
 * @param {MenuItemTooltipProps} props - Component props
 * @returns {JSX.Element | null} Tooltip element or null
 */
export function MenuItemTooltip({
  item,
  menuId,
  isHovered,
  mousePosition,
  tooltipRef,
  anchorElement,
  setIsHovered,
  setMousePosition,
  onHoverItem,
  onMouseMove,
}: MenuItemTooltipProps) {
  // Tooltip is rendered in portal at document.body level, so we don't need a wrapper div
  // The tooltip component handles its own mouse events for keeping it visible
  // Key prop ensures component remounts when item changes, preventing stale data
  return (
    <MenuItemHoverStatistics
      key={`${menuId}-${item.id}`}
      item={item}
      menuId={menuId}
      isVisible={isHovered}
      position="top"
      mousePosition={mousePosition}
      anchorElement={anchorElement}
    />
  );
}
