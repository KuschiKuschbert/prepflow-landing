'use client';

import { MenuItem } from '../../../types';
import { MenuItemHoverStatistics } from '../../MenuItemHoverStatistics';

interface MenuItemTooltipProps {
  item: MenuItem;
  menuId: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number } | undefined;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
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
  setIsHovered,
  setMousePosition,
  onHoverItem,
  onMouseMove,
}: MenuItemTooltipProps) {
  if (!isHovered) return null;

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition(undefined);
        onHoverItem?.(null);
      }}
    >
      <MenuItemHoverStatistics
        item={item}
        menuId={menuId}
        isVisible={isHovered}
        position="top"
        mousePosition={mousePosition}
      />
    </div>
  );
}
