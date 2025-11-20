'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
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
import { Lock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Menu } from '../types';
import CategoryManager from './CategoryManager';
import CategorySelectorModal from './CategorySelectorModal';
import DishPalette from './DishPalette';
import MenuCategory from './MenuCategory';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
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

export default function MenuEditor({ menu, onBack, onMenuUpdated }: MenuEditorProps) {
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

  // Menu data management
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
    setStatistics,
  } = useMenuData({
    menuId: menu.id,
    onError: showError,
  });

  // Category operations
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

  // Item operations
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

  // UI state and handlers
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

  // Drag and drop
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

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  // Create drag modifier
  const centerOnCursor = createCenterOnCursorModifier({
    initialOffset,
    initialCursorPosition,
  });

  // Fetch menu lock status
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

  // Refresh menu data when lock status changes
  useEffect(() => {
    if (menuLockStatus.is_locked) {
      loadMenuData();
    }
  }, [menuLockStatus.is_locked, loadMenuData]);

  // Handle lock/unlock
  const handleLockMenu = useCallback(async () => {
    setLockLoading(true);
    try {
      const response = await fetch(`/api/menus/${menu.id}/lock`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('[MenuEditor] Lock menu failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        showError(
          response.status === 404
            ? 'Menu lock endpoint not found. This may be a Next.js routing issue. Please restart the dev server and try again.'
            : errorData.error || errorData.message || 'Failed to lock menu',
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMenuLockStatus({
          is_locked: true,
          locked_at: data.menu.locked_at,
          locked_by: data.menu.locked_by,
        });
        showSuccess('Menu locked successfully');
        onMenuUpdated();
      } else {
        logger.error('[MenuEditor] Lock API returned success=false:', data);
        showError(data.error || data.message || 'Failed to lock menu');
      }
    } catch (err) {
      logger.error('[MenuEditor] Error locking menu:', err);
      showError('Failed to lock menu. Please check your connection and try again.');
    } finally {
      setLockLoading(false);
    }
  }, [menu.id, showSuccess, showError, onMenuUpdated]);

  const handleUnlockMenu = useCallback(async () => {
    setLockLoading(true);
    try {
      const response = await fetch(`/api/menus/${menu.id}/lock`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('[MenuEditor] Unlock menu failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        showError(
          response.status === 404
            ? 'Menu unlock endpoint not found. Please refresh the page and try again.'
            : errorData.error || errorData.message || 'Failed to unlock menu',
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMenuLockStatus({
          is_locked: false,
          locked_at: undefined,
          locked_by: undefined,
        });
        showSuccess('Menu unlocked successfully');
        onMenuUpdated();
      } else {
        showError(data.error || data.message || 'Failed to unlock menu');
      }
    } catch (err) {
      logger.error('[MenuEditor] Error unlocking menu:', err);
      showError('Failed to unlock menu. Please check your connection and try again.');
    } finally {
      setLockLoading(false);
    }
  }, [menu.id, showSuccess, showError, onMenuUpdated]);

  if (loading) {
    return <PageSkeleton />;
  }

  // Show locked view if menu is locked
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
        {/* Lock Button */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleLockMenu();
            }}
            disabled={lockLoading}
            className="flex items-center gap-2 rounded-lg border border-[#29E7CD]/50 bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-all hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Lock menu to finalize and show allergen matrix"
          >
            <Icon icon={Lock} size="sm" aria-hidden={true} />
            <span>{lockLoading ? 'Locking...' : 'Lock Menu'}</span>
          </button>
        </div>

        <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
          {/* Left Panel - Dish Palette */}
          <div className="large-desktop:col-span-1">
            <DishPalette dishes={dishes} recipes={recipes} onItemTap={handleItemTap} />
          </div>

          {/* Right Panel - Menu Builder */}
          <div className="large-desktop:col-span-3">
            {/* Statistics */}
            <MenuStatisticsPanel statistics={statistics} />

            {/* Category Management */}
            <CategoryManager
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={setNewCategory}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />

            {/* Categories */}
            <div className="space-y-6">
              {categories.map(category => {
                const categoryItems = menuItems
                  .filter(item => item.category === category)
                  .sort((a, b) => a.position - b.position);

                return (
                  <MenuCategory
                    key={category}
                    category={category}
                    items={categoryItems}
                    menuId={menu.id}
                    onRemoveItem={handleRemoveItem}
                    onRenameCategory={handleRenameCategory}
                    canRename={true}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onMoveToCategory={handleMoveToCategory}
                    onUpdateActualPrice={handleUpdateActualPrice}
                    onShowStatistics={item => setSelectedItemForStats(item)}
                    availableCategories={categories}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null} modifiers={[centerOnCursor]}>
        {activeId
          ? (() => {
              // Only handle menu items for rearranging
              const menuItem = menuItems.find(item => item.id === activeId);
              if (!menuItem) return null;
              return <DragOverlayContent menuItem={menuItem} />;
            })()
          : null}
      </DragOverlay>

      {/* Category Selector Modal */}
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

      {/* Item Statistics Modal */}
      <MenuItemStatisticsModal
        isOpen={selectedItemForStats !== null}
        item={selectedItemForStats}
        menuId={menu.id}
        onClose={() => setSelectedItemForStats(null)}
        onUpdatePrice={handleUpdateActualPrice}
      />

      {/* Confirm Dialog */}
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
