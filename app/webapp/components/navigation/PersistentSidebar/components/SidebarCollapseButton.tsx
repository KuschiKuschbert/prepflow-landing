'use client';

/**
 * Sidebar collapse button component
 */

import { Icon } from '@/components/ui/Icon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarCollapseButtonProps {
  isExpanded: boolean;
  persistentCollapsedState: boolean;
  onToggle: () => void;
}

/**
 * Sidebar collapse button component
 *
 * @param {SidebarCollapseButtonProps} props - Component props
 * @returns {JSX.Element} Collapse button
 */
export function SidebarCollapseButton({
  isExpanded,
  persistentCollapsedState,
  onToggle,
}: SidebarCollapseButtonProps) {
  return (
    <div className={`border-t border-[var(--border)] ${isExpanded ? 'p-2' : 'p-2'}`}>
      <button
        onClick={onToggle}
        className={`flex min-h-[44px] w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-[var(--muted)]/50 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none ${
          isExpanded ? 'justify-start' : 'justify-center'
        }`}
        aria-label={persistentCollapsedState ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!persistentCollapsedState}
        style={{
          transitionTimingFunction: 'var(--easing-standard)',
        }}
      >
        <Icon
          icon={persistentCollapsedState ? ChevronRight : ChevronLeft}
          size="sm"
          className="text-[var(--foreground-muted)] transition-transform duration-200"
          style={{
            transitionTimingFunction: 'var(--easing-standard)',
          }}
          aria-hidden={true}
        />
        {isExpanded && (
          <span className="ml-2 text-xs font-medium text-[var(--foreground-muted)]">
            {persistentCollapsedState ? 'Expand' : 'Collapse'}
          </span>
        )}
      </button>
    </div>
  );
}
