'use client';
import { logger } from '@/lib/logger';
import { useMemo, useRef } from 'react';
import { MenuItem } from '../types';
import MenuCategory from './MenuCategory';

interface MenuCategoriesListProps {
  categories: string[];
  menuItems: MenuItem[];
  menuId: string;
  onRemoveItem: (itemId: string) => void;
  onRenameCategory: (oldName: string, newName: string) => Promise<void>;
  onMoveUp: (itemId: string) => void;
  onMoveDown: (itemId: string) => void;
  onMoveToCategory: (itemId: string, newCategory: string) => void;
  onUpdateActualPrice: (itemId: string, newPrice: number | null) => void;
  onShowStatistics: (item: MenuItem) => void;
}

export function MenuCategoriesList({
  categories,
  menuItems,
  menuId,
  onRemoveItem,
  onRenameCategory,
  onMoveUp,
  onMoveDown,
  onMoveToCategory,
  onUpdateActualPrice,
  onShowStatistics,
}: MenuCategoriesListProps) {
  const prevMenuItemsRef = useRef<MenuItem[]>(menuItems);
  const prevCategoryItemsMapRef = useRef<Map<string, MenuItem[]>>(new Map());

  // Memoize category items to ensure React detects when item objects change
  const categoryItemsMap = useMemo(() => {
    const menuItemsReferenceChanged = prevMenuItemsRef.current !== menuItems;

    // Log when useMemo recalculates
    logger.dev('[MenuCategoriesList] useMemo recalculating', {
      menuId,
      menuItemsReferenceChanged,
      menuItemsArrayReferenceBefore: prevMenuItemsRef.current,
      menuItemsArrayReferenceAfter: menuItems,
      menuItemsArraysEqual: prevMenuItemsRef.current === menuItems,
      menuItemsLength: menuItems.length,
      prevMenuItemsLength: prevMenuItemsRef.current.length,
    });

    const map = new Map<string, MenuItem[]>();
    categories.forEach(category => {
      const items = menuItems
        .filter(item => item.category === category)
        .sort((a, b) => a.position - b.position);
      map.set(category, items);
    });

    // Log updated items in categoryItemsMap
    const allItemsInMap: MenuItem[] = [];
    map.forEach(items => {
      allItemsInMap.push(...items);
    });

    // Find items that changed by comparing with previous map
    const changedItems: Array<{
      id: string;
      category: string;
      prevPrice: number | null | undefined;
      newPrice: number | null | undefined;
      prevReference: MenuItem | undefined;
      newReference: MenuItem | undefined;
    }> = [];

    allItemsInMap.forEach(item => {
      const prevItem = prevCategoryItemsMapRef.current
        .get(item.category)
        ?.find(i => i.id === item.id);
      if (prevItem) {
        if (prevItem.actual_selling_price !== item.actual_selling_price || prevItem !== item) {
          changedItems.push({
            id: item.id,
            category: item.category,
            prevPrice: prevItem.actual_selling_price,
            newPrice: item.actual_selling_price,
            prevReference: prevItem,
            newReference: item,
          });
        }
      }
    });

    logger.dev('[MenuCategoriesList] categoryItemsMap created', {
      menuId,
      categoriesCount: categories.length,
      totalItemsInMap: allItemsInMap.length,
      changedItemsCount: changedItems.length,
      changedItems: changedItems.map(ci => ({
        id: ci.id,
        category: ci.category,
        prevPrice: ci.prevPrice,
        prevPriceType: typeof ci.prevPrice,
        newPrice: ci.newPrice,
        newPriceType: typeof ci.newPrice,
        referencesEqual: ci.prevReference === ci.newReference,
      })),
      categoryItemsMapReference: map,
      prevCategoryItemsMapReference: prevCategoryItemsMapRef.current,
      mapsEqual: prevCategoryItemsMapRef.current === map,
    });

    prevMenuItemsRef.current = menuItems;
    prevCategoryItemsMapRef.current = map;

    return map;
  }, [menuItems, categories, menuId]);

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryItems = categoryItemsMap.get(category) || [];
        return (
          <MenuCategory
            key={category}
            category={category}
            items={categoryItems}
            menuId={menuId}
            onRemoveItem={onRemoveItem}
            onRenameCategory={onRenameCategory}
            canRename={true}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onMoveToCategory={onMoveToCategory}
            onUpdateActualPrice={onUpdateActualPrice}
            onShowStatistics={onShowStatistics}
            availableCategories={categories}
          />
        );
      })}
    </div>
  );
}
