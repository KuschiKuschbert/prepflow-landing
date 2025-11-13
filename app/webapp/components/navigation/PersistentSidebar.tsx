'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '../LogoutButton';
import { CategorySection } from './CategorySection';
import { useNavigationItems } from './nav-items';
import { NewButton } from './NewButton';

export function PersistentSidebar() {
  const pathname = usePathname();

  const allItems = useNavigationItems();

  // Group items by category
  const groupedItems = allItems.reduce(
    (acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof allItems>,
  );

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed top-[var(--header-height-desktop)] bottom-0 left-0 z-40 w-72 md:w-80 lg:w-96 border-r border-[#2a2a2a] bg-[#1f1f1f] transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* New Button - positioned at top like Google Drive */}
        <div className="border-b border-[#2a2a2a] p-3 md:p-4 lg:p-5">
          <NewButton />
        </div>

        {/* Collapsible content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5">
          {Object.entries(groupedItems).map(([category, items]) => (
            <CategorySection key={category} category={category} items={items} isActive={isActive} />
          ))}
        </div>

        {/* Footer with settings */}
        <div className="border-t border-[#2a2a2a] p-3 md:p-4 lg:p-5">
          <div>
            <div className="mb-2 text-xs tracking-wider text-gray-400 uppercase">Settings</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Account</span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
