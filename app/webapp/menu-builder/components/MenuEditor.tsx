'use client';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { memo } from 'react';
import { Menu } from '../types';
import CategoryManager from './CategoryManager';
import DishPalette from './DishPalette';
import { useCategoryOperations } from './hooks/useCategoryOperations';
import { useMenuData } from './hooks/useMenuData';
import { useMenuEditorUI } from './hooks/useMenuEditorUI';
import { useMenuItemOperations } from './hooks/useMenuItemOperations';
import { MenuCategoriesList } from './MenuCategoriesList';
import { LockedMenuView } from './MenuEditor/components/LockedMenuView';
import { MenuEditorModals } from './MenuEditor/components/MenuEditorModals';
import { useMenuLockManagement } from './MenuEditor/hooks/useMenuLockManagement';
import { usePriceRecalculation } from './MenuEditor/hooks/usePriceRecalculation';
import { useRenderTracking } from './MenuEditor/hooks/useRenderTracking';
import { useStableMenuItems } from './MenuEditor/hooks/useStableMenuItems';
import { MenuLockButton } from './MenuLockButton';
import MenuStatisticsPanel from './MenuStatisticsPanel';

interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

function MenuEditorComponent({ menu, onMenuUpdated }: MenuEditorProps) {
  logger.dev('🚨🚨🚨 MENU_EDITOR_NEW_CODE_2025_11_21_V3 - CODE IS RUNNING 🚨🚨🚨', {
    menuId: menu.id,
    isLocked: menu.is_locked,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });
  logger.dev('🚨🚨🚨 MENU_EDITOR_NEW_CODE_2025_11_21_V3 🚨🚨🚨', {
    menuId: menu.id,
    isLocked: menu.is_locked,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });

  const { showError, showSuccess, showWarning } = useNotification();
  useRenderTracking(menu);
  const {
    menuItems: rawMenuItems,
    dishes,
    recipes,
    categories,
    statistics,
    loading,
    loadMenuData,
    refreshStatistics,
    setMenuItems,
    setCategories,
  } = useMenuData({
    menuId: menu.id,
    onError: showError,
  });

  const menuItems = useStableMenuItems(rawMenuItems, menu.id);

  const {
    handleAddCategory: handleAddCategoryBase,
    handleRemoveCategory: handleRemoveCategoryBase,
    performRemoveCategory,
    handleRenameCategory,
  } = useCategoryOperations({
    menuId: menu.id,
    menuItems,
    categories,
    setMenuItems,
    setCategories,
    refreshStatistics,
    showError,
    showSuccess,
    showWarning,
  });
  const {
    handleCategorySelect,
    handleRemoveItem: handleRemoveItemBase,
    performRemoveItem,
    handleMoveUp,
    handleMoveDown,
    handleMoveToCategory,
    handleUpdateActualPrice,
  } = useMenuItemOperations({
    menuId: menu.id,
    menuItems,
    dishes,
    recipes,
    categories,
    setMenuItems,
    setCategories,
    refreshStatistics,
    loadMenuData,
    showError,
    showSuccess,
  });
  const {
    newCategory,
    setNewCategory,
    selectedItem,
    setSelectedItem,
    showCategoryModal,
    setShowCategoryModal,
    anchorElement,
    setAnchorElement,
    selectedItemForStats,
    setSelectedItemForStats,
    confirmDialog,
    setConfirmDialog,
    handleAddCategory,
    handleRemoveCategory,
    handleRemoveItem,
    handleItemTap,
    handleCategorySelectWrapper,
  } = useMenuEditorUI({
    handleAddCategoryBase,
    handleRemoveCategoryBase,
    performRemoveCategory,
    handleRemoveItemBase,
    performRemoveItem,
    handleCategorySelect,
    menuItems,
  });

  const {
    menuLockStatus,
    lockLoading,
    unlockChanges,
    showUnlockDialog,
    handleLockMenu,
    handleUnlockMenu,
    handleDismissChanges,
    handleCloseUnlockDialog,
    setUnlockChanges,
    setShowUnlockDialog,
  } = useMenuLockManagement(menu, onMenuUpdated);

  const { handleRecalculatePrices } = usePriceRecalculation(menu.id, onMenuUpdated);

  if (loading) return <PageSkeleton />;

  // Prioritize menuLockStatus over menu prop for immediate UI updates
  // menuLockStatus is updated immediately when lock/unlock happens
  // menu prop will be updated after onMenuUpdated() refreshes data
  // Use nullish coalescing to prefer menuLockStatus when it's explicitly set
  const isLocked =
    menuLockStatus.is_locked !== undefined ? menuLockStatus.is_locked : (menu.is_locked ?? false);

  if (isLocked) {
    return (
      <LockedMenuView
        menu={menu}
        menuLockStatus={menuLockStatus}
        menuItems={menuItems}
        onUnlock={handleUnlockMenu}
      />
    );
  }
  return (
    <div>
      <MenuLockButton lockLoading={lockLoading} onLock={handleLockMenu} />
      <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
        {/* Desktop: DishPalette in sidebar */}
        <div className="large-desktop:col-span-1 large-desktop:order-1 order-4">
          <DishPalette dishes={dishes} recipes={recipes} onItemTap={handleItemTap} />
        </div>
        {/* Main content area */}
        <div className="large-desktop:col-span-3 large-desktop:order-2 order-1 space-y-6">
          {/* Statistics - only show if there are menu items */}
          {menuItems.length > 0 && <MenuStatisticsPanel statistics={statistics} />}
          {/* CategoryManager - create categories first */}
          <CategoryManager
            categories={categories}
            newCategory={newCategory}
            onNewCategoryChange={setNewCategory}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
          />
          {/* MenuCategoriesList - view categories and assigned items */}
          <MenuCategoriesList
            categories={categories}
            menuItems={menuItems}
            menuId={menu.id}
            onRemoveItem={handleRemoveItem}
            onRenameCategory={handleRenameCategory}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onMoveToCategory={handleMoveToCategory}
            onUpdateActualPrice={handleUpdateActualPrice}
            onShowStatistics={item => setSelectedItemForStats(item)}
          />
        </div>
      </div>
      <MenuEditorModals
        showCategoryModal={showCategoryModal}
        categories={categories}
        selectedItem={selectedItem}
        anchorElement={anchorElement}
        handleCategorySelectWrapper={handleCategorySelectWrapper}
        setShowCategoryModal={setShowCategoryModal}
        setSelectedItem={setSelectedItem}
        setAnchorElement={setAnchorElement}
        selectedItemForStats={selectedItemForStats}
        setSelectedItemForStats={setSelectedItemForStats}
        menuId={menu.id}
        handleUpdateActualPrice={handleUpdateActualPrice}
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        unlockChanges={unlockChanges}
        showUnlockDialog={showUnlockDialog}
        handleRecalculatePrices={handleRecalculatePrices}
        handleDismissChanges={handleDismissChanges}
        handleCloseUnlockDialog={handleCloseUnlockDialog}
      />
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export default memo(MenuEditorComponent, (prevProps, nextProps) => {
  // Only re-render if menu id or lock status actually changed
  const menuChanged =
    prevProps.menu.id !== nextProps.menu.id ||
    prevProps.menu.is_locked !== nextProps.menu.is_locked ||
    prevProps.menu.locked_at !== nextProps.menu.locked_at ||
    prevProps.menu.locked_by !== nextProps.menu.locked_by ||
    prevProps.menu.menu_name !== nextProps.menu.menu_name ||
    prevProps.menu.updated_at !== nextProps.menu.updated_at;

  if (menuChanged) {
    logger.dev('[MenuEditor] memo comparison - Menu changed, allowing re-render', {
      prevMenuId: prevProps.menu.id,
      nextMenuId: nextProps.menu.id,
      prevIsLocked: prevProps.menu.is_locked,
      nextIsLocked: nextProps.menu.is_locked,
    });
    return false; // Allow re-render
  }

  logger.dev('[MenuEditor] memo comparison - Menu unchanged, preventing re-render');
  return true; // Prevent re-render
});
