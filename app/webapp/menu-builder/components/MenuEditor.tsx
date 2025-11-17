'use client';

import { Icon } from '@/components/ui/Icon';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Dish, Recipe, Menu, MenuItem, MenuStatistics } from '../types';
import CategoryManager from './CategoryManager';
import DishPalette from './DishPalette';
import MenuCategory from './MenuCategory';
import MenuStatisticsPanel from './MenuStatisticsPanel';

import { logger } from '../../lib/logger';
interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

export default function MenuEditor({ menu, onBack, onMenuUpdated }: MenuEditorProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<string[]>(['Uncategorized']);
  const [statistics, setStatistics] = useState<MenuStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');

  const refreshStatistics = async () => {
    const statsResponse = await fetch(`/api/menus/${menu.id}/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success) setStatistics(statsData.statistics);
    }
  };

  const loadMenuData = async () => {
    setLoading(true);
    try {
      const [menuResponse, dishesResponse, recipesResponse, statsResponse] = await Promise.all([
        fetch(`/api/menus/${menu.id}`),
        fetch('/api/dishes?pageSize=1000'),
        fetch('/api/recipes?pageSize=1000'),
        fetch(`/api/menus/${menu.id}/statistics`),
      ]);

      const menuData = await menuResponse.json();
      const dishesData = await dishesResponse.json();
      const recipesData = await recipesResponse.json();
      const statsData = await statsResponse.json();

      if (!menuResponse.ok) {
        logger.error('Failed to load menu:', menuData.error || menuData.message);
        return;
      }

      if (menuData.success) {
        const items = menuData.menu.items || [];
        setMenuItems(items);
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(items.map((item: MenuItem) => item.category || 'Uncategorized')),
        ) as string[];
        setCategories(uniqueCategories.length > 0 ? uniqueCategories : ['Uncategorized']);
      }

      if (dishesData.success) {
        setDishes(dishesData.dishes || []);
      } else {
        logger.warn('Failed to load dishes:', dishesData.error || dishesData.message);
        setDishes([]);
      }

      if (recipesData.success) {
        setRecipes(recipesData.recipes || []);
      } else {
        logger.warn('Failed to load recipes:', recipesData.error || recipesData.message);
        setRecipes([]);
      }

      if (statsData.success) {
        setStatistics(statsData.statistics);
      } else {
        logger.warn('Failed to load statistics:', statsData.error || statsData.message);
      }
    } catch (err) {
      logger.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const { activeId, handleDragStart, handleDragEnd } = useMenuDragDrop({
    menuId: menu.id,
    menuItems,
    setMenuItems,
    onStatisticsUpdate: refreshStatistics,
    onMenuDataReload: loadMenuData,
  });

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.id]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = async (category: string) => {
    if (categories.length === 1) {
      alert('Cannot remove the last category. Menus must have at least one category.');
      return;
    }

    if (
      !confirm(
        `Remove category "${category}"? Items in this category will be moved to "Uncategorized".`,
      )
    ) {
      return;
    }

    // Move items from this category to Uncategorized
    const itemsToMove = menuItems.filter(item => item.category === category);
    if (itemsToMove.length > 0) {
      let hasError = false;
      for (const item of itemsToMove) {
        try {
          const response = await fetch(`/api/menus/${menu.id}/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: 'Uncategorized',
              position: item.position,
            }),
          });

          if (!response.ok) {
            const result = await response.json();
            logger.error('Failed to move item:', result.error || result.message);
            hasError = true;
          }
        } catch (err) {
          logger.error('Failed to move item:', err);
          hasError = true;
        }
      }

      if (hasError) {
        alert('Some items could not be moved. Please try again.');
        return;
      }
    }

    setCategories(categories.filter(c => c !== category));
    await loadMenuData();
  };

  const handleRemoveItem = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    const itemName = item?.dishes?.dish_name || item?.recipes?.name || 'this item';

    if (!confirm(`Remove "${itemName}" from this menu?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/menus/${menu.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        await loadMenuData();
        await refreshStatistics();
      } else {
        alert(`Failed to remove item: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (err) {
      logger.error('Failed to remove item:', err);
      alert('Failed to remove item. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-gray-400">Loading menu...</div>
        <div className="mx-auto h-1 w-32 animate-pulse rounded-full bg-[#29E7CD]/20" />
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-white transition-colors hover:bg-[#3a3a3a]"
          >
            <Icon icon={ArrowLeft} size="sm" />
            Back to Menus
          </button>
          <h2 className="text-2xl font-bold text-white">{menu.menu_name}</h2>
          <div className="w-32" /> {/* Spacer */}
        </div>

        <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
          {/* Left Panel - Dish Palette */}
          <div className="large-desktop:col-span-1">
            <DishPalette dishes={dishes} recipes={recipes} />
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
                    onRemoveItem={handleRemoveItem}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="rounded-lg bg-[#2a2a2a] p-3 shadow-lg">
            {dishes.find(d => d.id === activeId)?.dish_name ||
              recipes.find(r => r.id === activeId)?.name ||
              menuItems.find(item => item.id === activeId)?.dishes?.dish_name ||
              menuItems.find(item => item.id === activeId)?.recipes?.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
