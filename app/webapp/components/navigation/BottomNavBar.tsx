'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigationItems } from './nav-items';

interface BottomNavBarProps {
  onMenuClick: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Bottom navigation bar component for mobile devices.
 * Displays primary navigation items (Dashboard, Recipes, Performance, Menu).
 * Auto-hides on scroll down, shows on scroll up or at top.
 * Optimized for landscape mode with compact styling.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onMenuClick - Callback when "Menu" button is clicked
 * @returns {JSX.Element} Bottom navigation bar
 */
export const BottomNavBar = memo(function BottomNavBar({
  onMenuClick,
  menuButtonRef,
}: BottomNavBarProps) {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = menuButtonRef || internalRef;
  const pathname = usePathname();
  const { trackNavigation } = useNavigationTracking();
  const allItems = useNavigationItems();
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

  // Primary items for bottom nav: Dashboard, Recipes, Performance, Prep Lists, Temperature
  const primaryItems = allItems.filter(
    item =>
      item.href === '/webapp' ||
      item.href === '/webapp/recipes' ||
      item.href === '/webapp/performance' ||
      item.href === '/webapp/prep-lists' ||
      item.href === '/webapp/temperature',
  );

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-[60] h-[var(--bottom-navbar-height)] border-t border-[#2a2a2a]/30 bg-[#1f1f1f]/70 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transitionTimingFunction: 'var(--easing-standard)',
      }}
      aria-label="Bottom navigation"
      suppressHydrationWarning
    >
      <div className="flex h-full w-full">
        {primaryItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trackNavigation(item.href)}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none landscape:flex-row landscape:gap-2 ${
                active
                  ? 'border-t-2 border-[#29E7CD] bg-[#29E7CD]/10'
                  : 'hover:scale-[1.05] hover:bg-[#2a2a2a]/30'
              }`}
              style={{
                transitionTimingFunction: 'var(--easing-standard)',
                borderTopWidth: active ? '2px' : '0px',
                transitionProperty: 'background-color, transform, border-top-width',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`${active ? item.color : 'text-gray-400'} flex h-6 w-6 items-center justify-center landscape:h-5 landscape:w-5`}
              >
                {item.icon}
              </span>
              <span
                className={`text-xs font-medium landscape:text-[10px] ${active ? 'text-[#29E7CD]' : 'text-gray-400'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          ref={buttonRef}
          onClick={onMenuClick}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-[1.05] hover:bg-[#2a2a2a]/30 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none landscape:flex-row landscape:gap-2"
          style={{
            transitionTimingFunction: 'var(--easing-standard)',
          }}
          aria-label="Open more menu"
        >
          <span className="flex h-6 w-6 items-center justify-center text-gray-400 landscape:h-5 landscape:w-5">
            <Icon icon={Menu} size="sm" aria-hidden={true} />
          </span>
          <span className="text-xs font-medium text-gray-400 landscape:text-[10px]">More</span>
        </button>
      </div>
    </nav>
  );
});
