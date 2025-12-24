'use client';

import { usePathname } from 'next/navigation';
import { MobileMenuButton } from './SettingsNavigation/components/MobileMenuButton';
import { NavigationSidebar } from './SettingsNavigation/components/NavigationSidebar';
import { useKeyboardNavigation } from './SettingsNavigation/hooks/useKeyboardNavigation';
import { useSettingsNavigation } from './SettingsNavigation/hooks/useSettingsNavigation';
import { categories as allCategories } from './SettingsNavigation/navItems';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useMemo } from 'react';

export default function SettingsNavigation() {
  const pathname = usePathname();
  const { isAdmin } = useIsAdmin();

  // Filter admin-only items if user is not admin
  const categories = useMemo(() => {
    if (isAdmin) {
      return allCategories;
    }
    return allCategories
      .map(category => ({
        ...category,
        items: category.items.filter(item => !item.adminOnly),
      }))
      .filter(category => category.items.length > 0);
  }, [isAdmin]);

  const {
    sidebarOpen,
    setSidebarOpen,
    activeHash,
    expandedCategories,
    setExpandedCategories,
    focusedIndex,
    setFocusedIndex,
    navRefs,
    handleNavClick,
    toggleCategory,
  } = useSettingsNavigation();

  const { handleKeyDown } = useKeyboardNavigation({
    handleNavClick,
    setFocusedIndex,
    setExpandedCategories,
    navRefs,
  });

  // Handle Escape key to close sidebar
  const handleKeyDownWithEscape = (
    e: React.KeyboardEvent,
    categoryId: string,
    itemIndex: number,
    itemHash: string,
  ) => {
    if (e.key === 'Escape') {
      setSidebarOpen(false);
      return;
    }
    handleKeyDown(e, categoryId, itemIndex, itemHash);
  };

  return (
    <>
      {/* Mobile menu button */}
      <MobileMenuButton isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <div
        className={`desktop:translate-x-0 fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : 'desktop:translate-x-0 -translate-x-full'
        }`}
      >
        <NavigationSidebar
          categories={categories}
          activeHash={activeHash}
          expandedCategories={expandedCategories}
          focusedIndex={focusedIndex}
          navRefs={navRefs}
          onNavClick={handleNavClick}
          onToggleCategory={toggleCategory}
          onKeyDown={handleKeyDownWithEscape}
        />
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="desktop:hidden fixed inset-0 z-30 bg-black/60 transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden={true}
        />
      )}
    </>
  );
}
