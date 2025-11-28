'use client';

import { logger } from '@/lib/logger';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import { MenuItem } from '../types';
import { MenuItemActions } from './SortableMenuItem/components/MenuItemActions';
import { MenuItemContent } from './SortableMenuItem/components/MenuItemContent';
import { MenuItemTooltip } from './SortableMenuItem/components/MenuItemTooltip';
import { useMenuItemDropdowns } from './SortableMenuItem/hooks/useMenuItemDropdowns';
import { useMenuItemHover } from './SortableMenuItem/hooks/useMenuItemHover';

interface SortableMenuItemProps {
  item: MenuItem;
  menuId: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveToCategory?: (targetCategory: string) => void;
  onUpdateActualPrice?: (itemId: string, price: number | null) => void;
  onShowStatistics?: (item: MenuItem) => void;
  availableCategories?: string[];
  currentCategory: string;
  isFirst: boolean;
  isLast: boolean;
  onHoverItem?: (item: MenuItem | null) => void;
  onClickItem?: (item: MenuItem) => void;
  onMouseMove?: (position: { x: number; y: number }) => void;
}

export function SortableMenuItem({
  item,
  menuId,
  onRemove,
  onMoveUp,
  onMoveDown,
  onMoveToCategory,
  onUpdateActualPrice,
  onShowStatistics,
  availableCategories = [],
  currentCategory,
  isFirst,
  isLast,
  onHoverItem,
  onClickItem,
  onMouseMove,
}: SortableMenuItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: 'menu-item',
      item,
    },
  });

  const itemRef = useRef<HTMLDivElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const reorderButtonRef = useRef<HTMLButtonElement>(null);

  const {
    showCategoryDropdown,
    setShowCategoryDropdown,
    showReorderDropdown,
    setShowReorderDropdown,
    categoryDropdownRef,
    reorderDropdownRef,
    handleMoveToCategory,
  } = useMenuItemDropdowns({
    onMoveToCategory,
    currentCategory,
    availableCategories,
  });

  const {
    isHovered,
    setIsHovered,
    mousePosition,
    setMousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  } = useMenuItemHover({
    item,
    onHoverItem,
    onMouseMove,
    reorderButtonRef,
  });

  // Don't apply transform when dragging - let DragOverlay handle the visual representation
  const style = {
    transform: isDragging ? 'none' : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or dropdowns
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[role="menu"]') ||
      (e.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      logger.dev('[SortableMenuItem] Click ignored (button/dropdown)', {
        itemId: item.id,
        target: (e.target as HTMLElement).tagName,
      });
      return;
    }
    logger.dev('[SortableMenuItem] Item clicked, opening price edit popup', {
      itemId: item.id,
      itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
      hasOnClickItem: !!onClickItem,
    });
    onClickItem?.(item);
  };

  return (
    <div className="relative">
      {/* Vertical divider on top */}
      <div className="absolute top-0 right-4 left-4 z-10 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

      <div
        ref={node => {
          setNodeRef(node);
          itemRef.current = node;
        }}
        data-sortable-id={item.id}
        style={style}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={e => handleMouseLeave(e, tooltipRef)}
        className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#29E7CD]/50"
      >
        <MenuItemContent item={item} menuId={menuId} />

        <MenuItemActions
          onRemove={onRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMoveToCategory={onMoveToCategory}
          availableCategories={availableCategories}
          currentCategory={currentCategory}
          isFirst={isFirst}
          isLast={isLast}
          showReorderDropdown={showReorderDropdown}
          setShowReorderDropdown={setShowReorderDropdown}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          handleMoveToCategory={handleMoveToCategory}
          reorderDropdownRef={reorderDropdownRef}
          categoryDropdownRef={categoryDropdownRef}
          reorderButtonRef={reorderButtonRef}
        />

        <MenuItemTooltip
          item={item}
          menuId={menuId}
          isHovered={isHovered}
          mousePosition={mousePosition}
          tooltipRef={tooltipRef}
          anchorElement={itemRef.current}
          setIsHovered={setIsHovered}
          setMousePosition={setMousePosition}
          onHoverItem={onHoverItem}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
}
