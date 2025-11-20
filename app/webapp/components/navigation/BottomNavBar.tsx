'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useWorkflowPreference } from '@/lib/workflow/preferences';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState, useRef } from 'react';
import { useNavigationItems } from './nav-items';

interface BottomNavBarProps {
  onMoreClick: () => void;
  moreButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Bottom navigation bar component for mobile devices.
 * Displays primary navigation items (Dashboard, Recipes, Performance, More).
 * Auto-hides on scroll down, shows on scroll up or at top.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onMoreClick - Callback when "More" button is clicked
 * @returns {JSX.Element} Bottom navigation bar
 *
 * @example
 * ```tsx
 * <BottomNavBar
 *   onMoreClick={() => setIsPopoverOpen(true)}
 * />
 * ```
 */
export const BottomNavBar = memo(function BottomNavBar({
  onMoreClick,
  moreButtonRef,
}: BottomNavBarProps) {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = moreButtonRef || internalRef;
  const pathname = usePathname();
  const { workflow } = useWorkflowPreference();
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems(workflow);
  const { direction, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-hide on scroll down, show on scroll up or at top
  useEffect(() => {
    if (!mounted) return;
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop, mounted]);

  // Primary items for bottom nav: Dashboard, Recipes, Performance
  const primaryItems = allItems.filter(
    item =>
      item.href === '/webapp' ||
      item.href === '/webapp/recipes' ||
      item.href === '/webapp/performance',
  );

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-[60] border-t border-[#2a2a2a]/30 bg-[#1f1f1f]/70 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-in-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
      }}
      aria-label="Bottom navigation"
      suppressHydrationWarning
    >
      <div className="flex h-14 w-full">
        {primaryItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trackNavigation(item.href)}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none ${
                active ? 'border-t-2 border-[#29E7CD] bg-[#29E7CD]/10' : 'hover:bg-[#2a2a2a]/30'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`${active ? item.color : 'text-gray-400'} flex h-5 w-5 items-center justify-center`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${active ? 'text-[#29E7CD]' : 'text-gray-400'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          ref={buttonRef}
          onClick={onMoreClick}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 hover:bg-[#2a2a2a]/30 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
          aria-label="More navigation options"
        >
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
          <span className="text-[10px] font-medium text-gray-400">More</span>
        </button>
      </div>
    </nav>
  );
});
