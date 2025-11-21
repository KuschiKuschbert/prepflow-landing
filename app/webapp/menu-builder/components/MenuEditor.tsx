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
import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Menu, MenuItem } from '../types';
import CategoryManager from './CategoryManager';
import CategorySelectorModal from './CategorySelectorModal';
import DishPalette from './DishPalette';
import { MenuCategoriesList } from './MenuCategoriesList';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
import { MenuLockButton } from './MenuLockButton';
import { MenuLockedView } from './MenuLockedView';
import { MenuUnlockChangesDialog } from './MenuUnlockChangesDialog';
import MenuStatisticsPanel from './MenuStatisticsPanel';
import { DragOverlayContent } from './drag/DragOverlayContent';
import { createCenterOnCursorModifier } from './drag/centerOnCursorModifier';
import { useCategoryOperations } from './hooks/useCategoryOperations';
import { useMenuData } from './hooks/useMenuData';
import { useMenuEditorUI } from './hooks/useMenuEditorUI';
import { useMenuItemOperations } from './hooks/useMenuItemOperations';
import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

function MenuEditorComponent({ menu, onMenuUpdated }: MenuEditorProps) {
  // CRITICAL: This log MUST appear if new code is running
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
  const [unlockChanges, setUnlockChanges] = useState<MenuChangeTracking[] | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const justUpdatedLockRef = useRef(false);
  const menuIdRef = useRef(menu.id);
  const prevMenuRef = useRef(menu);
  const renderCountRef = useRef(0);

  // Track component renders
  renderCountRef.current += 1;
  const renderId = renderCountRef.current;

  // Log render with what changed
  useEffect(() => {
    const prevMenu = prevMenuRef.current;
    const changes: string[] = [];

    if (prevMenu.id !== menu.id) changes.push(`menu.id: ${prevMenu.id} → ${menu.id}`);
    if (prevMenu.is_locked !== menu.is_locked)
      changes.push(`menu.is_locked: ${prevMenu.is_locked} → ${menu.is_locked}`);
    if (prevMenu.locked_at !== menu.locked_at) changes.push(`menu.locked_at changed`);
    if (prevMenu.menu_name !== menu.menu_name) changes.push(`menu.menu_name changed`);
    if (prevMenu.updated_at !== menu.updated_at) changes.push(`menu.updated_at changed`);

    if (changes.length > 0) {
      logger.dev(`[MenuEditor] Render #${renderId} - Props changed:`, {
        changes,
        menuId: menu.id,
        isLocked: menu.is_locked,
      });
    } else {
      logger.dev(`[MenuEditor] Render #${renderId} - No prop changes detected`, {
        menuId: menu.id,
        isLocked: menu.is_locked,
      });
    }

    prevMenuRef.current = menu;
  }, [menu, renderId]);
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

  // Track menuItems reference changes to understand re-render causes
  const prevRawMenuItemsRef = useRef<MenuItem[]>(rawMenuItems);
  const prevItemIdsRef = useRef<string>('');

  // Memoize menuItems with stable reference - only create new array when content actually changes
  const menuItems = useMemo(() => {
    const currentItemIds = rawMenuItems.map(i => i.id).join(',');
    const prevItemIds = prevItemIdsRef.current;
    const referenceChanged = prevRawMenuItemsRef.current !== rawMenuItems;
    const contentChanged = prevItemIds !== currentItemIds;

    logger.dev('[MenuEditor] menuItems useMemo recalculating', {
      menuId: menu.id,
      itemCount: rawMenuItems.length,
      referenceChanged,
      contentChanged,
      prevItemIds,
      newItemIds: currentItemIds,
    });

    // If content hasn't changed, return previous reference to maintain stability
    if (!contentChanged && prevRawMenuItemsRef.current.length === rawMenuItems.length) {
      logger.dev('[MenuEditor] menuItems content unchanged - returning previous reference');
      return prevRawMenuItemsRef.current;
    }

    // Content changed, update refs and return new array
    prevRawMenuItemsRef.current = rawMenuItems;
    prevItemIdsRef.current = currentItemIds;

    return rawMenuItems;
  }, [rawMenuItems, menu.id]);

  // Log when menuItems reference changes
  const prevMenuItemsRef = useRef(rawMenuItems);
  useEffect(() => {
    if (prevMenuItemsRef.current !== rawMenuItems) {
      const prevIds = prevMenuItemsRef.current.map(i => i.id).join(',');
      const newIds = rawMenuItems.map(i => i.id).join(',');
      const contentChanged = prevIds !== newIds;
      logger.dev('[MenuEditor] menuItems reference changed', {
        menuId: menu.id,
        renderId,
        contentChanged,
        prevCount: prevMenuItemsRef.current.length,
        newCount: rawMenuItems.length,
        prevIds,
        newIds,
      });
      prevMenuItemsRef.current = rawMenuItems;
    }
  }, [rawMenuItems, menu.id, renderId]);

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
  // Update menuIdRef when menu.id changes
  useEffect(() => {
    if (menuIdRef.current !== menu.id) {
      logger.dev(`[MenuEditor] menuIdRef updated: ${menuIdRef.current} → ${menu.id}`);
      menuIdRef.current = menu.id;
    }
  }, [menu.id]);

  const fetchMenuLockStatus = useCallback(async () => {
    // Skip if we just updated the lock status (we already have the correct status)
    if (justUpdatedLockRef.current) {
      logger.dev('[MenuEditor] fetchMenuLockStatus SKIPPED - justUpdatedLockRef is true');
      return;
    }

    logger.dev(`[MenuEditor] fetchMenuLockStatus CALLED for menu ${menuIdRef.current}`);
    try {
      const response = await fetch(`/api/menus/${menuIdRef.current}`);
      const data = await response.json();
      if (data.success && data.menu) {
        const newStatus = {
          is_locked: data.menu.is_locked || false,
          locked_at: data.menu.locked_at,
          locked_by: data.menu.locked_by,
        };
        logger.dev(`[MenuEditor] fetchMenuLockStatus SUCCESS - Setting lock status:`, newStatus);
        setMenuLockStatus(prevStatus => {
          // Only update if status actually changed to prevent unnecessary re-renders
          if (
            prevStatus.is_locked !== newStatus.is_locked ||
            prevStatus.locked_at !== newStatus.locked_at ||
            prevStatus.locked_by !== newStatus.locked_by
          ) {
            logger.dev('[MenuEditor] fetchMenuLockStatus - Status changed, updating');
            return newStatus;
          }
          logger.dev('[MenuEditor] fetchMenuLockStatus - Status unchanged, keeping previous');
          return prevStatus;
        });
      }
    } catch (err) {
      logger.error('[MenuEditor] Error fetching menu lock status:', err);
    }
  }, []);

  // Track previous menu.is_locked to detect actual prop changes
  const prevMenuIsLockedRef = useRef(menu.is_locked);

  useEffect(() => {
    logger.dev(`[MenuEditor] useEffect [menu.id, menu.is_locked] triggered`, {
      menuId: menu.id,
      menuIsLocked: menu.is_locked,
      prevMenuIsLocked: prevMenuIsLockedRef.current,
      currentLockStatus: menuLockStatus.is_locked,
      justUpdatedLock: justUpdatedLockRef.current,
    });

    // Guard: skip if we just updated the lock status (we already have the correct status)
    if (justUpdatedLockRef.current) {
      logger.dev('[MenuEditor] useEffect SKIPPED - justUpdatedLockRef is true');
      prevMenuIsLockedRef.current = menu.is_locked;
      return;
    }

    // Only fetch if menu.is_locked prop actually changed (not just our local state)
    if (prevMenuIsLockedRef.current !== menu.is_locked) {
      logger.dev('[MenuEditor] useEffect - Menu lock status prop changed, fetching...', {
        prevMenuIsLocked: prevMenuIsLockedRef.current,
        newMenuIsLocked: menu.is_locked,
        currentLockStatus: menuLockStatus.is_locked,
      });
      prevMenuIsLockedRef.current = menu.is_locked;
      fetchMenuLockStatus();
    } else {
      logger.dev('[MenuEditor] useEffect - Menu lock status prop unchanged, skipping fetch');
    }
  }, [menu.id, menu.is_locked, menuLockStatus.is_locked, fetchMenuLockStatus]);
  const handleLockToggle = useCallback(
    async (lock: boolean) => {
      logger.dev(`[MenuEditor] handleLockToggle CALLED - lock=${lock} for menu ${menu.id}`);
      setLockLoading(true);
      try {
        const response = await fetch(`/api/menus/${menu.id}/lock`, {
          method: lock ? 'POST' : 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.error(`[MenuEditor] ${lock ? 'Lock' : 'Unlock'} menu failed:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });

          // Handle authentication errors specifically
          if (response.status === 401) {
            const errorMsg = 'Your session has expired. Please sign in again to continue.';
            showError(errorMsg);
            // Optionally redirect to login after a delay
            setTimeout(() => {
              window.location.href = '/api/auth/signin';
            }, 2000);
            return;
          }

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
          const newStatus = lock
            ? { is_locked: true, locked_at: data.menu.locked_at, locked_by: data.menu.locked_by }
            : { is_locked: false, locked_at: undefined, locked_by: undefined };

          logger.dev(`[MenuEditor] handleLockToggle SUCCESS - Setting lock status:`, newStatus);
          setMenuLockStatus(newStatus);

          // If unlocking and changes detected, show dialog
          if (!lock && data.hasChanges && data.changes && data.changes.length > 0) {
            logger.dev('[MenuEditor] Changes detected on unlock:', {
              changeCount: data.changes.length,
            });
            setUnlockChanges(data.changes);
            setShowUnlockDialog(true);
          } else {
            showSuccess(`Menu ${lock ? 'locked' : 'unlocked'} successfully`);
          }

          // Set flag to prevent fetchMenuLockStatus from running immediately after update
          logger.dev('[MenuEditor] handleLockToggle - Setting justUpdatedLockRef = true');
          justUpdatedLockRef.current = true;

          // Reset flag after 500ms to allow normal fetching to resume
          setTimeout(() => {
            logger.dev(
              '[MenuEditor] handleLockToggle - Resetting justUpdatedLockRef = false (500ms timeout)',
            );
            justUpdatedLockRef.current = false;
          }, 500);

          logger.dev('[MenuEditor] handleLockToggle - Calling onMenuUpdated()');
          onMenuUpdated();

          // Force immediate re-render by updating menu prop if possible
          // The onMenuUpdated should trigger fetchMenus which will update selectedMenu
          // But we also ensure local state is updated immediately
          if (lock) {
            // Immediately show locked view
            logger.dev('[MenuEditor] handleLockToggle - Menu locked, should show MenuLockedView');
          }
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

  const handleRecalculatePrices = useCallback(async () => {
    try {
      const response = await fetch(`/api/menus/${menu.id}/refresh-prices`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to refresh prices');
      }

      // Mark changes as handled
      await fetch(`/api/menus/${menu.id}/changes/handle`, {
        method: 'POST',
      });

      // Refresh menu data
      onMenuUpdated();
    } catch (err) {
      logger.error('[MenuEditor] Error recalculating prices:', err);
      throw err;
    }
  }, [menu.id, onMenuUpdated]);

  const handleDismissChanges = useCallback(() => {
    setUnlockChanges(null);
    setShowUnlockDialog(false);
  }, []);

  const handleCloseUnlockDialog = useCallback(() => {
    setShowUnlockDialog(false);
    // Don't clear changes here - they'll be cleared when handled or on next unlock
  }, []);

  if (loading) return <PageSkeleton />;

  // Check both local state and menu prop for lock status
  const isLocked = menuLockStatus.is_locked || menu.is_locked || false;

  if (isLocked) {
    // Use menu prop with updated lock status if available, otherwise use local state
    const lockedMenu: Menu = {
      ...menu,
      is_locked: true,
      locked_at: menu.locked_at || menuLockStatus.locked_at,
      locked_by: menu.locked_by || menuLockStatus.locked_by,
    };

    return (
      <div>
        <MenuLockedView menu={lockedMenu} menuItems={menuItems} onUnlock={handleUnlockMenu} />
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
      {unlockChanges && (
        <MenuUnlockChangesDialog
          isOpen={showUnlockDialog}
          menuId={menu.id}
          changes={unlockChanges}
          onRecalculatePrices={handleRecalculatePrices}
          onDismiss={handleDismissChanges}
          onClose={handleCloseUnlockDialog}
        />
      )}
    </DndContext>
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
