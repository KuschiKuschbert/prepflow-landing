'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { memo, useEffect, useRef, useState } from 'react';
import { useCategorySort, type SortOption } from '../hooks/useCategorySort';
import { MenuItem } from '../types';
import { CategoryHeader } from './CategoryHeader';
import { MenuItemPriceEditPopup } from './MenuItemPriceEditPopup';
import { SortableMenuItem } from './SortableMenuItem';

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  menuId: string;
  onRemoveItem: (itemId: string) => void;
  onRenameCategory?: (oldName: string, newName: string) => Promise<void>;
  canRename?: boolean;
  onMoveUp?: (itemId: string) => void;
  onMoveDown?: (itemId: string) => void;
  onMoveToCategory?: (itemId: string, targetCategory: string) => void;
  onUpdateActualPrice?: (itemId: string, price: number | null) => void;
  onShowStatistics?: (item: MenuItem) => void;
  availableCategories?: string[];
}

function MenuCategoryComponent({
  category,
  items,
  menuId,
  onRemoveItem,
  onRenameCategory,
  canRename = true,
  onMoveUp,
  onMoveDown,
  onMoveToCategory,
  onUpdateActualPrice,
  onShowStatistics,
  availableCategories = [],
}: MenuCategoryProps) {
  const { showError } = useNotification();
  const { sortBy, setSortBy, sortedItems } = useCategorySort({ items, defaultSort: 'position' });

  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [clickedItemForPrice, setClickedItemForPrice] = useState<MenuItem | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const prevItemsRef = useRef<MenuItem[]>(items);
  const prevSortedItemsRef = useRef<MenuItem[]>(sortedItems);

  // Log when items prop changes
  useEffect(() => {
    const itemsReferenceChanged = prevItemsRef.current !== items;

    if (itemsReferenceChanged) {
      // Find items that changed
      const changedItems: Array<{
        id: string;
        prevPrice: number | null | undefined;
        newPrice: number | null | undefined;
        prevReference: MenuItem | undefined;
        newReference: MenuItem | undefined;
      }> = [];

      items.forEach(item => {
        const prevItem = prevItemsRef.current.find(i => i.id === item.id);
        if (prevItem) {
          if (prevItem.actual_selling_price !== item.actual_selling_price || prevItem !== item) {
            changedItems.push({
              id: item.id,
              prevPrice: prevItem.actual_selling_price,
              newPrice: item.actual_selling_price,
              prevReference: prevItem,
              newReference: item,
            });
          }
        }
      });

      logger.dev('[MenuCategory] items prop changed', {
        category,
        menuId,
        itemsReferenceChanged,
        itemsArrayReferenceBefore: prevItemsRef.current,
        itemsArrayReferenceAfter: items,
        itemsArraysEqual: prevItemsRef.current === items,
        itemsLength: items.length,
        prevItemsLength: prevItemsRef.current.length,
        changedItemsCount: changedItems.length,
        changedItems: changedItems.map(ci => ({
          id: ci.id,
          prevPrice: ci.prevPrice,
          prevPriceType: typeof ci.prevPrice,
          newPrice: ci.newPrice,
          newPriceType: typeof ci.newPrice,
          referencesEqual: ci.prevReference === ci.newReference,
        })),
      });

      prevItemsRef.current = items;
    }
  }, [items, category, menuId]);

  // Log when sortedItems changes
  useEffect(() => {
    const sortedItemsReferenceChanged = prevSortedItemsRef.current !== sortedItems;

    if (sortedItemsReferenceChanged) {
      // Find items that changed in sortedItems
      const changedItems: Array<{
        id: string;
        prevPrice: number | null | undefined;
        newPrice: number | null | undefined;
        prevReference: MenuItem | undefined;
        newReference: MenuItem | undefined;
      }> = [];

      sortedItems.forEach(item => {
        const prevItem = prevSortedItemsRef.current.find(i => i.id === item.id);
        if (prevItem) {
          if (prevItem.actual_selling_price !== item.actual_selling_price || prevItem !== item) {
            changedItems.push({
              id: item.id,
              prevPrice: prevItem.actual_selling_price,
              newPrice: item.actual_selling_price,
              prevReference: prevItem,
              newReference: item,
            });
          }
        }
      });

      logger.dev('[MenuCategory] sortedItems changed', {
        category,
        menuId,
        sortedItemsReferenceChanged,
        sortedItemsArrayReferenceBefore: prevSortedItemsRef.current,
        sortedItemsArrayReferenceAfter: sortedItems,
        sortedItemsArraysEqual: prevSortedItemsRef.current === sortedItems,
        sortedItemsLength: sortedItems.length,
        prevSortedItemsLength: prevSortedItemsRef.current.length,
        changedItemsCount: changedItems.length,
        changedItems: changedItems.map(ci => ({
          id: ci.id,
          prevPrice: ci.prevPrice,
          prevPriceType: typeof ci.prevPrice,
          newPrice: ci.newPrice,
          newPriceType: typeof ci.newPrice,
          referencesEqual: ci.prevReference === ci.newReference,
        })),
      });

      prevSortedItemsRef.current = sortedItems;
    }
  }, [sortedItems, category, menuId]);

  // Sync clickedItemForPrice with updated items prop
  // This ensures the price edit popup always shows the latest item data
  useEffect(() => {
    if (clickedItemForPrice) {
      // Find the updated item from items prop
      const updatedItem = items.find(item => item.id === clickedItemForPrice.id);
      if (updatedItem && updatedItem !== clickedItemForPrice) {
        // Update clickedItemForPrice with fresh reference
        setClickedItemForPrice(updatedItem);
      }
    }
  }, [items, clickedItemForPrice]);

  return (
    <div
      ref={categoryRef}
      className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-4 transition-colors"
    >
      {/* Category Header */}
      <CategoryHeader
        category={category}
        canRename={canRename}
        onRename={onRenameCategory || (async () => {})}
        onError={showError}
        sortBy={sortBy}
        onSortChange={(sort: SortOption) => setSortBy(sort)}
        itemCount={items.length}
      />

      <div className="space-y-2">
        {sortedItems.length === 0 ? (
          <div className="py-8 text-center text-sm text-[var(--foreground-muted)]">
            Add dishes or recipes from the palette to this category
          </div>
        ) : (
          sortedItems.map((item, index) => (
            <SortableMenuItem
              key={`${item.id}-${item.actual_selling_price ?? 'null'}-${item.category}-${item.position}`}
              item={item}
              menuId={menuId}
              onRemove={() => onRemoveItem(item.id)}
              onMoveUp={onMoveUp ? () => onMoveUp(item.id) : undefined}
              onMoveDown={onMoveDown ? () => onMoveDown(item.id) : undefined}
              onMoveToCategory={
                onMoveToCategory
                  ? (targetCategory: string) => onMoveToCategory(item.id, targetCategory)
                  : undefined
              }
              onUpdateActualPrice={onUpdateActualPrice}
              onShowStatistics={onShowStatistics}
              availableCategories={availableCategories}
              currentCategory={category}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onHoverItem={setHoveredItem}
              onClickItem={setClickedItemForPrice}
            />
          ))
        )}
      </div>

      {/* Price Edit Popup */}
      <MenuItemPriceEditPopup
        item={clickedItemForPrice}
        isOpen={clickedItemForPrice !== null}
        onClose={() => setClickedItemForPrice(null)}
        onSave={(itemId, price) => {
          onUpdateActualPrice?.(itemId, price);
          setClickedItemForPrice(null);
        }}
      />
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export default memo(MenuCategoryComponent, (prevProps, nextProps) => {
  // Only re-render if relevant props actually changed
  return (
    prevProps.category === nextProps.category &&
    prevProps.items === nextProps.items &&
    prevProps.menuId === nextProps.menuId
  );
});
