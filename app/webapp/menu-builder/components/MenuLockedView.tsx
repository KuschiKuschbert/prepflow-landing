/**
 * Menu Locked View Component
 * Displays allergen matrix and menu information when menu is locked
 */

'use client';

import { logger } from '@/lib/logger';
import { memo, useState } from 'react';
import { Menu, MenuItem } from '@/lib/types/menu-builder';
import { IngredientPopover } from './IngredientPopover';
import { MenuDisplayView } from './MenuDisplayView';
import { AllergenMatrixTable } from './MenuLockedView/components/AllergenMatrixTable';
import { ExportOptions } from './MenuLockedView/components/ExportOptions';
import { LockedStatusBanner } from './MenuLockedView/components/LockedStatusBanner';
import { RecipeCardsView } from './MenuLockedView/components/RecipeCardsView/RecipeCardsView';
import { useExport } from './MenuLockedView/hooks/useExport';
import { useMenuItemSelection } from './MenuLockedView/hooks/useMenuItemSelection';
import { useMenuItemsWithAllergens } from './MenuLockedView/hooks/useMenuItemsWithAllergens';
import { useRenderTracking } from './MenuLockedView/hooks/useRenderTracking';

interface MenuLockedViewProps {
  menu: Menu;
  menuItems: MenuItem[];
  onUnlock: () => void;
}

function MenuLockedViewComponent({ menu, menuItems, onUnlock }: MenuLockedViewProps) {
  logger.dev('🚨🚨🚨 MENU_LOCKED_VIEW_NEW_CODE_2025_11_21_V3 - CODE IS RUNNING 🚨🚨🚨', {
    menuId: menu.id,
    menuItemsCount: menuItems.length,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });
  logger.dev('🚨🚨🚨 MENU_LOCKED_VIEW_NEW_CODE_2025_11_21_V3 🚨🚨🚨', {
    menuId: menu.id,
    menuItemsCount: menuItems.length,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });

  useRenderTracking(menu, menuItems);
  const menuItemsWithAllergens = useMenuItemsWithAllergens(menuItems, menu.id);
  const { handleExport, exportLoading } = useExport(menu);
  const { selectedMenuItem, handleRowClick, handleRowKeyDown, handleCloseModal } =
    useMenuItemSelection();

  const [activeTab, setActiveTab] = useState<'display' | 'allergens' | 'recipes'>('display');

  return (
    <div className="space-y-6">
      <LockedStatusBanner menu={menu} onUnlock={onUnlock} />
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('display')}
            className={`px-1 pb-2 ${activeTab === 'display' ? 'border-primary border-b-2 text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}
          >
            Menu Display
          </button>
          <button
            onClick={() => setActiveTab('allergens')}
            className={`px-1 pb-2 ${activeTab === 'allergens' ? 'border-primary border-b-2 text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}
          >
            Allergen Matrix
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            onMouseEnter={() => {
              // Prefetch recipe cards when user hovers over tab
              // This starts loading cards before they click, making it feel instant
              fetch(`/api/menus/${menu.id}/recipe-cards`).catch(() => {
                // Silently fail - this is just a prefetch
              });
            }}
            className={`px-1 pb-2 ${activeTab === 'recipes' ? 'border-primary border-b-2 text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}
          >
            Recipe Cards
          </button>
        </div>
        <ExportOptions
          key={`export-${menu.id}-v2.0.1`}
          handleExport={handleExport}
          exportLoading={exportLoading}
        />
      </div>

      {activeTab === 'display' && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Menu Display</h3>
          <MenuDisplayView menu={menu} menuItems={menuItems} />
        </div>
      )}

      {activeTab === 'allergens' && (
        <AllergenMatrixTable
          menuItemsWithAllergens={menuItemsWithAllergens}
          onRowClick={handleRowClick}
          onRowKeyDown={handleRowKeyDown}
        />
      )}

      {activeTab === 'recipes' && <RecipeCardsView menuId={menu.id} />}
      {selectedMenuItem && (
        <IngredientPopover
          isOpen={true}
          menuItemId={selectedMenuItem.id}
          menuItemName={selectedMenuItem.name}
          menuItemType={selectedMenuItem.type}
          mousePosition={selectedMenuItem.mousePosition}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const MenuLockedView = memo(MenuLockedViewComponent, (prevProps, nextProps) => {
  // Only re-render if menu or menuItems actually changed
  const menuChanged =
    prevProps.menu.id !== nextProps.menu.id ||
    prevProps.menu.is_locked !== nextProps.menu.is_locked ||
    prevProps.menu.locked_at !== nextProps.menu.locked_at ||
    prevProps.menu.menu_name !== nextProps.menu.menu_name;

  const menuItemsChanged =
    prevProps.menuItems.length !== nextProps.menuItems.length ||
    prevProps.menuItems !== nextProps.menuItems; // Reference check

  if (menuChanged || menuItemsChanged) {
    logger.dev('[MenuLockedView] memo comparison - Props changed, allowing re-render', {
      menuChanged,
      menuItemsChanged,
      prevMenuId: prevProps.menu.id,
      nextMenuId: nextProps.menu.id,
      prevMenuItemsLength: prevProps.menuItems.length,
      nextMenuItemsLength: nextProps.menuItems.length,
    });
    return false; // Allow re-render
  }

  logger.dev('[MenuLockedView] memo comparison - Props unchanged, preventing re-render');
  return true; // Prevent re-render
});
