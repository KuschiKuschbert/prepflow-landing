'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
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

export default function MenuCategory({
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
  const { setNodeRef, isOver } = useDroppable({
    id: `category-${category}`,
    data: {
      type: 'category',
      category,
    },
  });

  const { sortBy, setSortBy, sortedItems } = useCategorySort({ items, defaultSort: 'position' });

  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [clickedItemForPrice, setClickedItemForPrice] = useState<MenuItem | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  // Debug logging for isOver state changes
  useEffect(() => {
    if (isOver && categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect();
      logger.dev('[DragOverlay Debug] Category is now a valid drop target', {
        category,
        categoryRect: {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        },
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      });
    } else if (!isOver) {
      logger.dev('[DragOverlay Debug] Category is no longer a valid drop target', {
        category,
      });
    }
  }, [isOver, category]);

  // Combine refs to track both the droppable node and the category element
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    categoryRef.current = node;
  };

  return (
    <div
      ref={combinedRef}
      className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
        isOver ? 'border-[#29E7CD] bg-[#29E7CD]/10' : 'border-[#2a2a2a] bg-[#2a2a2a]/30'
      }`}
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

      <SortableContext
        items={sortedItems.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortedItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              Add dishes or recipes from the palette to this category
            </div>
          ) : (
            sortedItems.map((item, index) => (
              <SortableMenuItem
                key={item.id}
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
      </SortableContext>

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
