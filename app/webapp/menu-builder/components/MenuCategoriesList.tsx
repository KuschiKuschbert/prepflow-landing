'use client';
import MenuCategory from './MenuCategory';
import { MenuItem } from '../types';

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
  return (
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
