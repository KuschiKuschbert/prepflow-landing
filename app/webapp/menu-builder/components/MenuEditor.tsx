'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Menu, MenuItem } from '../types';
import CategoryManager from './CategoryManager';
import CategorySelectorModal from './CategorySelectorModal';
import DishPalette from './DishPalette';
import MenuCategory from './MenuCategory';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
import MenuStatisticsPanel from './MenuStatisticsPanel';
import { DragOverlayContent } from './drag/DragOverlayContent';
import { createCenterOnCursorModifier } from './drag/centerOnCursorModifier';
import { useCategoryOperations } from './hooks/useCategoryOperations';
import { useMenuData } from './hooks/useMenuData';
import { useMenuItemOperations } from './hooks/useMenuItemOperations';
import { useMenuEditorUI } from './hooks/useMenuEditorUI';
import { useNotification } from '@/contexts/NotificationContext';

interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

export default function MenuEditor({ menu, onBack, onMenuUpdated }: MenuEditorProps) {
  const { showError, showSuccess, showWarning } = useNotification();

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

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
          {/* Left Panel - Dish Palette */}
          <div className="large-desktop:col-span-1">
            <DishPalette dishes={dishes} recipes={recipes} onItemTap={handleItemTap} />
          </div>

          {/* Right Panel - Menu Builder */}
          <div className="large-desktop:col-span-3">
            {/* Statistics */}
            {statistics && <MenuStatisticsPanel statistics={statistics} />}

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
