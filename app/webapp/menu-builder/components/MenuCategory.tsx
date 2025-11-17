'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowUpDown,
  Check,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Edit2,
  Filter,
  Move,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCategorySort } from '../hooks/useCategorySort';
import { MenuItem } from '../types';
import { MenuItemHoverStatistics } from './MenuItemHoverStatistics';
import { MenuItemPriceEditPopup } from './MenuItemPriceEditPopup';

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

function SortableMenuItem({
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

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showReorderDropdown, setShowReorderDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );
  const itemRef = useRef<HTMLDivElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const reorderDropdownRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        reorderDropdownRef.current &&
        !reorderDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReorderDropdown(false);
      }
    };

    if (showCategoryDropdown || showReorderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategoryDropdown, showReorderDropdown]);

  // Don't apply transform when dragging - let DragOverlay handle the visual representation
  const style = {
    transform: isDragging ? 'none' : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const isRecipe = !!item.recipe_id;
  const isDish = !!item.dish_id;

  const handleMoveToCategory = (targetCategory: string) => {
    if (onMoveToCategory && targetCategory !== currentCategory) {
      onMoveToCategory(targetCategory);
    }
    setShowCategoryDropdown(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverItem?.(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Track mouse position relative to viewport
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    onMouseMove?.({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving to the tooltip
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && tooltipRef.current?.contains(relatedTarget)) {
      return; // Don't hide if moving to tooltip
    }
    setIsHovered(false);
    setMousePosition(undefined);
    onHoverItem?.(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or dropdowns
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[role="menu"]') ||
      (e.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      return;
    }
    onClickItem?.(item);
  };

  return (
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
      onMouseLeave={handleMouseLeave}
      className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#29E7CD]/50"
    >
      <div className="flex flex-1 items-center gap-2">
        {isDish ? (
          <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
        ) : isRecipe ? (
          <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
        ) : null}
        <div className="flex-1">
          {isDish ? (
            <>
              <div className="font-medium text-white">
                {item.dishes?.dish_name || 'Unknown Dish'}
              </div>
              <div className="flex items-baseline gap-2">
                {item.recommended_selling_price != null && (
                  <div className="text-xs text-gray-500">
                    Recommended: ${item.recommended_selling_price.toFixed(2)}
                  </div>
                )}
                <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                  {item.actual_selling_price != null ? (
                    <>${item.actual_selling_price.toFixed(2)}</>
                  ) : (
                    item.dishes?.selling_price != null && (
                      <>${item.dishes.selling_price.toFixed(2)}</>
                    )
                  )}
                </div>
              </div>
            </>
          ) : isRecipe ? (
            <>
              <div className="font-medium text-white">
                {item.recipes?.recipe_name || 'Unknown Recipe'}
              </div>
              <div className="flex items-baseline gap-2">
                {item.recommended_selling_price != null && (
                  <div className="text-xs text-gray-500">
                    Recommended: ${item.recommended_selling_price.toFixed(2)}
                  </div>
                )}
                <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                  {item.actual_selling_price != null ? (
                    <>${item.actual_selling_price.toFixed(2)}</>
                  ) : (
                    item.recommended_selling_price != null && (
                      <>${item.recommended_selling_price.toFixed(2)}</>
                    )
                  )}
                </div>
                {item.recommended_selling_price != null && (
                  <div className="text-xs text-gray-400">per serve</div>
                )}
              </div>
            </>
          ) : (
            <div className="font-medium text-white">Unknown Item</div>
          )}
        </div>
      </div>
      <div className="desktop:opacity-0 desktop:group-hover:opacity-100 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Reorder Dropdown Menu */}
        {(onMoveUp || onMoveDown) && (
          <div ref={reorderDropdownRef} className="relative">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowReorderDropdown(!showReorderDropdown);
              }}
              onMouseDown={e => e.stopPropagation()}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
              aria-label="Reorder options"
            >
              <Icon icon={ArrowUpDown} size="sm" />
            </button>
            {showReorderDropdown && (
              <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
                <div className="p-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Reorder
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {onMoveUp && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onMoveUp();
                        setShowReorderDropdown(false);
                      }}
                      disabled={isFirst}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <Icon icon={ChevronUp} size="sm" />
                      <span>Move Up</span>
                    </button>
                  )}
                  {onMoveDown && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onMoveDown();
                        setShowReorderDropdown(false);
                      }}
                      disabled={isLast}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <Icon icon={ChevronDown} size="sm" />
                      <span>Move Down</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Move to Category Dropdown */}
        {onMoveToCategory && availableCategories.length > 1 && (
          <div ref={categoryDropdownRef} className="relative">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowCategoryDropdown(!showCategoryDropdown);
              }}
              onMouseDown={e => e.stopPropagation()}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
              aria-label="Move to category"
            >
              <Icon icon={Move} size="sm" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
                <div className="p-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Move to Category
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {availableCategories
                    .filter(cat => cat !== currentCategory)
                    .map(cat => (
                      <button
                        key={cat}
                        onClick={e => {
                          e.stopPropagation();
                          handleMoveToCategory(cat);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                      >
                        {cat}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
          aria-label="Remove item"
        >
          <Icon icon={Trash2} size="sm" />
        </button>
      </div>

      {/* Hover Statistics Tooltip */}
      {isHovered && (
        <div
          ref={tooltipRef}
          className="pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePosition(undefined);
            onHoverItem?.(null);
          }}
        >
          <MenuItemHoverStatistics
            item={item}
            menuId={menuId}
            isVisible={isHovered}
            position="top"
            mousePosition={mousePosition}
          />
        </div>
      )}
    </div>
  );
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

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(category);
  const [isSaving, setIsSaving] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [clickedItemForPrice, setClickedItemForPrice] = useState<MenuItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(category);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditValue(category);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const trimmedValue = editValue.trim();

    // Don't allow empty category names
    if (!trimmedValue) {
      setEditValue(category);
      setIsEditing(false);
      return;
    }

    // Don't save if unchanged
    if (trimmedValue === category) {
      setIsEditing(false);
      return;
    }

    if (onRenameCategory) {
      setIsSaving(true);
      try {
        await onRenameCategory(category, trimmedValue);
        setIsEditing(false);
      } catch (error) {
        showError(
          `Failed to rename category: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        setEditValue(category);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

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
      {/* Editable Category Header */}
      <div className="mb-3 flex items-center gap-2">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-[#29E7CD] bg-[#1f1f1f] px-3 py-1.5 text-lg font-semibold text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="rounded-lg bg-[#29E7CD] p-1.5 text-black transition-colors hover:bg-[#29E7CD]/80 disabled:opacity-50"
              aria-label="Save category name"
            >
              <Icon icon={Check} size="sm" />
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="rounded-lg bg-[#2a2a2a] p-1.5 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white disabled:opacity-50"
              aria-label="Cancel editing"
            >
              <Icon icon={X} size="sm" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="flex-1 text-lg font-semibold text-white">{category}</h3>
            {/* Sort Dropdown */}
            {items.length > 1 && (
              <div ref={sortDropdownRef} className="relative">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className={`rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                    sortBy !== 'position' ? 'text-[#29E7CD]' : ''
                  }`}
                  aria-label="Sort items"
                  title="Sort items"
                >
                  <Icon icon={Filter} size="sm" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
                    <div className="p-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                      Sort By
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSortBy('position');
                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                          sortBy === 'position' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                        }`}
                      >
                        <Icon icon={ArrowUpDown} size="sm" />
                        <span>Position</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSortBy('name-asc');
                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                          sortBy === 'name-asc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                        }`}
                      >
                        <Icon icon={ChevronUp} size="sm" />
                        <span>Name (A-Z)</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSortBy('name-desc');
                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                          sortBy === 'name-desc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                        }`}
                      >
                        <Icon icon={ChevronDown} size="sm" />
                        <span>Name (Z-A)</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSortBy('price-asc');
                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                          sortBy === 'price-asc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                        }`}
                      >
                        <Icon icon={ChevronUp} size="sm" />
                        <span>Price (Low-High)</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSortBy('price-desc');
                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                          sortBy === 'price-desc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                        }`}
                      >
                        <Icon icon={ChevronDown} size="sm" />
                        <span>Price (High-Low)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {canRename && (
              <button
                onClick={handleStartEdit}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                aria-label={`Rename category "${category}"`}
                title="Click to rename category"
              >
                <Icon icon={Edit2} size="sm" />
              </button>
            )}
          </>
        )}
      </div>

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
