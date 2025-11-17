'use client';

import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNavigationItems } from './nav-items';

interface BottomNavBarProps {
  onMoreClick: () => void;
  onSearchClick?: () => void;
}

export function BottomNavBar({ onMoreClick, onSearchClick }: BottomNavBarProps) {
  const pathname = usePathname();
  const allItems = useNavigationItems();
  const { direction, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeUp: onSearchClick,
    threshold: 50,
  });

  // Auto-hide on scroll down, show on scroll up or at top
  useEffect(() => {
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop]);

  // Primary items for bottom nav: Dashboard, Recipes, COGS, Performance
  const primaryItems = allItems.filter(
    item =>
      item.href === '/webapp' ||
      item.href === '/webapp/recipes' ||
      item.href === '/webapp/performance',
  );

  // Add COGS manually since it's accessed via hash link
  const cogsItem = {
    href: '/webapp/recipes#calculator',
    label: 'COGS',
    icon: <Icon icon={Calculator} size="sm" className="text-current" aria-hidden={true} />,
    color: 'text-[#29E7CD]',
  };

  const allPrimaryItems = [...primaryItems, cogsItem];

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    if (href === '/webapp/recipes#calculator') {
      return (
        pathname === '/webapp/recipes' &&
        typeof window !== 'undefined' &&
        window.location.hash === '#calculator'
      );
    }
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-[60] border-t border-[#2a2a2a]/30 bg-[#1f1f1f]/70 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-in-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
      }}
      aria-label="Bottom navigation"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={e => onTouchEnd(e)}
    >
      <div className="grid h-14 grid-cols-5">
        {allPrimaryItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
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
          onClick={onMoreClick}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition-colors duration-200 hover:bg-[#2a2a2a]/30"
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
}
