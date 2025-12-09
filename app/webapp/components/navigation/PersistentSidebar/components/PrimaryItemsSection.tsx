/**
 * Primary items section component for PersistentSidebar
 */

import { prefersReducedMotion } from '@/lib/arcadeGuards';
import { NavItem } from '../../NavItem';
import type { NavigationItemConfig } from '../../nav-items';

interface PrimaryItemsSectionProps {
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  isExpanded: boolean;
  onTrack: (href: string) => void;
}

/**
 * Primary items section component
 *
 * @param {PrimaryItemsSectionProps} props - Component props
 * @returns {JSX.Element} Primary items section
 */
export function PrimaryItemsSection({
  items,
  isActive,
  isExpanded,
  onTrack,
}: PrimaryItemsSectionProps) {
  return (
    <div className="mb-4 space-y-0.5">
      {items.map((item, index) => {
        const reducedMotion = prefersReducedMotion();
        return (
          <div
            key={item.href}
            style={{
              animationName: isExpanded && !reducedMotion ? 'fadeInUp' : 'none',
              animationDuration: isExpanded && !reducedMotion ? '0.3s' : '0s',
              animationTimingFunction:
                isExpanded && !reducedMotion ? 'var(--easing-standard)' : 'ease',
              animationFillMode: isExpanded && !reducedMotion ? 'forwards' : 'none',
              animationDelay: isExpanded && !reducedMotion ? `${index * 20}ms` : '0ms',
              opacity: isExpanded && !reducedMotion ? 0 : 1,
            }}
          >
            <NavItem
              href={item.href}
              label={item.label}
              icon={item.icon}
              color={item.color}
              isActive={isActive(item.href)}
              onTrack={onTrack}
              iconSize="md"
              showLabel={isExpanded}
            />
          </div>
        );
      })}
    </div>
  );
}
