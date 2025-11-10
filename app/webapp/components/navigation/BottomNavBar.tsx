'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useNavigationItems } from './nav-items';

interface BottomNavBarProps {
  onMoreClick: () => void;
}

export function BottomNavBar({ onMoreClick }: BottomNavBarProps) {
  const pathname = usePathname();
  const allItems = useNavigationItems();

  // Primary items for bottom nav: Dashboard, Ingredients, Recipes, COGS
  const primaryItems = allItems.filter(
    item =>
      item.href === '/webapp' ||
      item.href === '/webapp/ingredients' ||
      item.href === '/webapp/recipes' ||
      item.href === '/webapp/cogs',
  );

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-[60] border-t border-[#2a2a2a]/50 bg-[#1f1f1f]/95 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl"
      aria-label="Bottom navigation"
    >
      <div className="grid h-14 grid-cols-5">
        {primaryItems.map(item => {
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
