'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { NavItem } from './NavItem';
import type { NavigationItemConfig } from './nav-items';
import { getCategoryLabel } from './CategorySection';

interface ExpandableCategorySectionProps {
  category: string;
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  onItemClick?: (href: string) => void;
  onTrack?: (href: string) => void;
  defaultExpanded?: boolean;
  // Controlled mode props (for desktop sidebar)
  isExpanded?: boolean;
  onToggle?: (category: string) => void;
}

/**
 * Expandable category section component for navigation items.
 * Allows collapsing/expanding grouped navigation items.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.category - Category name
 * @param {Array} props.items - Navigation items in this category
 * @param {Function} props.isActive - Function to check if href is active
 * @param {Function} [props.onItemClick] - Optional click handler
 * @param {Function} [props.onTrack] - Optional tracking callback
 * @param {boolean} [props.defaultExpanded=false] - Whether section is expanded by default
 * @returns {JSX.Element} Expandable category section
 */
export function ExpandableCategorySection({
  category,
  items,
  isActive,
  onItemClick,
  onTrack,
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onToggle,
}: ExpandableCategorySectionProps) {
  // Use controlled mode if props provided, otherwise use uncontrolled
  const isControlled = controlledExpanded !== undefined && onToggle !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);

  // Use controlled or uncontrolled state
  const isExpanded = isControlled ? controlledExpanded : uncontrolledExpanded;

  // Auto-expand if any item in category is active (only for uncontrolled mode)
  useEffect(() => {
    if (isControlled) return; // Skip auto-expand in controlled mode
    const hasActiveItem = items.some(item => isActive(item.href));
    if (hasActiveItem && !uncontrolledExpanded) {
      setUncontrolledExpanded(true);
    }
  }, [items, isActive, uncontrolledExpanded, isControlled]);

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(category);
    } else {
      setUncontrolledExpanded(!uncontrolledExpanded);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleToggle}
        className="mb-1.5 flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase transition-colors hover:bg-[#2a2a2a] hover:text-gray-400"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${getCategoryLabel(category)} section`}
      >
        <span>{getCategoryLabel(category)}</span>
        <Icon
          icon={isExpanded ? ChevronDown : ChevronRight}
          size="xs"
          className="text-gray-500 transition-transform"
          aria-hidden={true}
        />
      </button>
      {isExpanded && (
        <div className="space-y-1">
          {items.map(item => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              color={item.color}
              isActive={isActive(item.href)}
              onClick={onItemClick ? () => onItemClick(item.href) : undefined}
              onTrack={onTrack}
              iconSize="md"
              showLabel={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
