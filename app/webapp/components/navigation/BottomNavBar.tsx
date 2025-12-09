'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { BarChart3, LayoutDashboard, Menu, Search, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';

interface BottomNavBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Bottom navigation bar component for mobile devices.
 * Icon-only design with cyan circle active indicator (Cyber Carrot style).
 * Auto-hides on scroll down, shows on scroll up or at top.
 *
 * @component
 */
export const BottomNavBar = memo(function BottomNavBar({
  onMenuClick,
  onSearchClick,
  menuButtonRef,
}: BottomNavBarProps) {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = menuButtonRef || internalRef;
  const pathname = usePathname();
  const { trackNavigation } = useNavigationTracking();
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

  // Primary items for bottom nav (icon-only): Dashboard, Recipes, Performance
  const primaryItems = [
    {
      href: '/webapp',
      icon: LayoutDashboard,
      label: 'Dashboard',
      color: 'text-[#29E7CD]',
    },
    {
      href: '/webapp/recipes',
      icon: UtensilsCrossed,
      label: 'Recipes',
      color: 'text-[#29E7CD]',
    },
    {
      href: '/webapp/performance',
      icon: BarChart3,
      label: 'Stats',
      color: 'text-[#29E7CD]',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-[60] h-[var(--bottom-navbar-height)] border-t border-[#2a2a2a]/30 bg-[#1f1f1f]/90 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transitionTimingFunction: 'var(--easing-standard)',
      }}
      aria-label="Bottom navigation"
      suppressHydrationWarning
    >
      <div className="flex h-full w-full items-center justify-around px-2">
        {/* Primary navigation items */}
        {primaryItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trackNavigation(item.href)}
              className="group flex min-h-[44px] min-w-[44px] items-center justify-center transition-transform duration-200 focus:outline-none active:scale-95"
              style={{ transitionTimingFunction: 'var(--easing-spring)' }}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Cyan circle indicator for active state */}
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  active
                    ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10'
                    : 'border-transparent group-hover:border-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]/30'
                }`}
                style={{ transitionTimingFunction: 'var(--easing-standard)' }}
              >
                <Icon
                  icon={item.icon}
                  size="sm"
                  className={`transition-colors duration-200 ${active ? item.color : 'text-gray-400 group-hover:text-gray-300'}`}
                  aria-hidden={true}
                />
              </span>
            </Link>
          );
        })}

        {/* Search button */}
        <button
          onClick={onSearchClick}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center transition-transform duration-200 focus:outline-none active:scale-95"
          style={{ transitionTimingFunction: 'var(--easing-spring)' }}
          aria-label="Search"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent transition-all duration-200 group-hover:border-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]/30">
            <Icon
              icon={Search}
              size="sm"
              className="text-gray-400 transition-colors duration-200 group-hover:text-gray-300"
              aria-hidden={true}
            />
          </span>
        </button>

        {/* More menu button */}
        <button
          ref={buttonRef}
          onClick={onMenuClick}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center transition-transform duration-200 focus:outline-none active:scale-95"
          style={{ transitionTimingFunction: 'var(--easing-spring)' }}
          aria-label="Open more menu"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent transition-all duration-200 group-hover:border-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]/30">
            <Icon
              icon={Menu}
              size="sm"
              className="text-gray-400 transition-colors duration-200 group-hover:text-gray-300"
              aria-hidden={true}
            />
          </span>
        </button>
      </div>
    </nav>
  );
});
