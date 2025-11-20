'use client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback, useEffect, useState } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Menu } from '../types';
import CategoryManager from './CategoryManager';
import CategorySelectorModal from './CategorySelectorModal';
import DishPalette from './DishPalette';
import { MenuCategoriesList } from './MenuCategoriesList';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
import { MenuLockButton } from './MenuLockButton';
import { MenuLockedView } from './MenuLockedView';
import MenuStatisticsPanel from './MenuStatisticsPanel';
import { DragOverlayContent } from './drag/DragOverlayContent';
import { createCenterOnCursorModifier } from './drag/centerOnCursorModifier';
import { useCategoryOperations } from './hooks/useCategoryOperations';
import { useMenuData } from './hooks/useMenuData';
import { useMenuEditorUI } from './hooks/useMenuEditorUI';
import { useMenuItemOperations } from './hooks/useMenuItemOperations';
interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

export default function MenuEditor({ menu, onMenuUpdated }: MenuEditorProps) {
  const { showError, showSuccess, showWarning } = useNotification();
  const [menuLockStatus, setMenuLockStatus] = useState<{
    is_locked: boolean;
    locked_at?: string;
    locked_by?: string;
  }>({
    is_locked: menu.is_locked || false,
    locked_at: menu.locked_at,
    locked_by: menu.locked_by,
  });
  const [lockLoading, setLockLoading] = useState(false);
  const {
    menuItems,
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
  const { activeId, initialOffset, initialCursorPosition, handleDragStart, handleDragEnd } =
    useMenuDragDrop({
      menuId: menu.id,
      menuItems,
      setMenuItems,
      onStatisticsUpdate: refreshStatistics,
      onMenuDataReload: loadMenuData,
      dishes,
      recipes,
      notifications: { showError, showSuccess },
    });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );
  const centerOnCursor = createCenterOnCursorModifier({
    initialOffset,
    initialCursorPosition,
  });
  const fetchMenuLockStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/menus/${menu.id}`);
      const data = await response.json();
      if (data.success && data.menu) {
        setMenuLockStatus({
          is_locked: data.menu.is_locked || false,
          locked_at: data.menu.locked_at,
          locked_by: data.menu.locked_by,
        });
      }
    } catch (err) {
      logger.error('[MenuEditor] Error fetching menu lock status:', err);
    }
  }, [menu.id]);
  useEffect(() => {
    fetchMenuLockStatus();
  }, [fetchMenuLockStatus]);
  useEffect(() => {
    if (menuLockStatus.is_locked) loadMenuData();
  }, [menuLockStatus.is_locked, loadMenuData]);
  const handleLockToggle = useCallback(
    async (lock: boolean) => {
      setLockLoading(true);
      try {
        const response = await fetch(`/api/menus/${menu.id}/lock`, {
          method: lock ? 'POST' : 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.error(`[MenuEditor] ${lock ? 'Lock' : 'Unlock'} menu failed:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          const errorMsg =
            response.status === 404
              ? `Menu ${lock ? 'lock' : 'unlock'} endpoint not found. ${lock ? 'This may be a Next.js routing issue. Please restart the dev server and try again.' : 'Please refresh the page and try again.'}`
              : errorData.error ||
                errorData.message ||
                `Failed to ${lock ? 'lock' : 'unlock'} menu`;
          showError(errorMsg);
          return;
        }
        const data = await response.json();
        if (data.success) {
          setMenuLockStatus(
            lock
              ? { is_locked: true, locked_at: data.menu.locked_at, locked_by: data.menu.locked_by }
              : { is_locked: false, locked_at: undefined, locked_by: undefined },
          );
          showSuccess(`Menu ${lock ? 'locked' : 'unlocked'} successfully`);
          onMenuUpdated();
        } else {
          logger.error(
            `[MenuEditor] ${lock ? 'Lock' : 'Unlock'} API returned success=false:`,
            data,
          );
          showError(data.error || data.message || `Failed to ${lock ? 'lock' : 'unlock'} menu`);
        }
      } catch (err) {
        logger.error(`[MenuEditor] Error ${lock ? 'locking' : 'unlocking'} menu:`, err);
        showError(
          `Failed to ${lock ? 'lock' : 'unlock'} menu. Please check your connection and try again.`,
        );
      } finally {
        setLockLoading(false);
      }
    },
    [menu.id, showSuccess, showError, onMenuUpdated],
  );
  const handleLockMenu = useCallback(() => handleLockToggle(true), [handleLockToggle]);
  const handleUnlockMenu = useCallback(() => handleLockToggle(false), [handleLockToggle]);

  if (loading) return <PageSkeleton />;
  if (menuLockStatus.is_locked) {
    return (
      <div>
        <MenuLockedView menu={menu} menuItems={menuItems} onUnlock={handleUnlockMenu} />
      </div>
    );
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <MenuLockButton lockLoading={lockLoading} onLock={handleLockMenu} />
        <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
          <div className="large-desktop:col-span-1">
            <DishPalette dishes={dishes} recipes={recipes} onItemTap={handleItemTap} />
          </div>
          <div className="large-desktop:col-span-3">
            <MenuStatisticsPanel statistics={statistics} />
            <CategoryManager
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={setNewCategory}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />
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
      </div>
      <DragOverlay dropAnimation={null} modifiers={[centerOnCursor]}>
        {activeId &&
          (() => {
            const menuItem = menuItems.find(item => item.id === activeId);
            return menuItem ? <DragOverlayContent menuItem={menuItem} /> : null;
          })()}
      </DragOverlay>
      <CategorySelectorModal
        isOpen={showCategoryModal}
        categories={categories}
        itemName={selectedItem?.name || ''}
        anchorElement={anchorElement}
        onSelectCategory={handleCategorySelectWrapper}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedItem(null);
          setAnchorElement(null);
        }}
      />
      <MenuItemStatisticsModal
        isOpen={selectedItemForStats !== null}
        item={selectedItemForStats}
        menuId={menu.id}
        onClose={() => setSelectedItemForStats(null)}
        onUpdatePrice={handleUpdateActualPrice}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant={confirmDialog.variant}
      />
    </DndContext>
  );
}
