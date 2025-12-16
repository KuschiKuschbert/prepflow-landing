'use client';
import { createPortal } from 'react-dom';
import { MenuItem } from '../types';
import { MenuItemTooltipContent } from './MenuItemTooltipContent';
import { useStatisticsLoading } from './MenuItemHoverStatistics/hooks/useStatisticsLoading';
import { useTooltipPosition } from './MenuItemHoverStatistics/hooks/useTooltipPosition';

interface MenuItemHoverStatisticsProps {
  item: MenuItem;
  menuId: string;
  isVisible: boolean;
  position: 'top' | 'bottom';
  mousePosition?: { x: number; y: number };
  anchorElement?: HTMLElement | null;
}

/**
 * Menu item hover statistics tooltip component.
 *
 * @component
 * @param {MenuItemHoverStatisticsProps} props - Component props
 * @returns {JSX.Element | null} Tooltip element or null
 */
export function MenuItemHoverStatistics({
  item,
  menuId,
  isVisible,
  mousePosition,
  anchorElement,
}: MenuItemHoverStatisticsProps) {
  const { statistics, loading, error } = useStatisticsLoading(menuId, item, isVisible);
  const { tooltipPosition, tooltipRef } = useTooltipPosition({
    isVisible,
    mousePosition,
    anchorElement,
  });

  if (!isVisible) return null;

  const hasValidPosition = tooltipPosition.left !== undefined && tooltipPosition.top !== undefined;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-[60] w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
      style={{
        left: tooltipPosition.left !== undefined ? `${tooltipPosition.left}px` : undefined,
        top: tooltipPosition.top !== undefined ? `${tooltipPosition.top}px` : undefined,
        animation: hasValidPosition ? 'fadeInUp 0.2s ease-out forwards' : undefined,
        visibility: hasValidPosition ? 'visible' : 'hidden',
      }}
      role="tooltip"
    >
      <MenuItemTooltipContent statistics={statistics} loading={loading} error={error} />
    </div>
  );
  if (typeof window !== 'undefined') {
    return createPortal(tooltipContent, document.body);
  }
  return null;
}

// Export grid components for use in MenuItemTooltipContent
export { StatisticsGrid } from './MenuItemHoverStatistics/components/StatisticsGrid';
export { RecommendedPriceGrid } from './MenuItemHoverStatistics/components/RecommendedPriceGrid';
