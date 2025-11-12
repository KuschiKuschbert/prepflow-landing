'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { Menu, MenuItem, Dish, MenuStatistics } from '../types';
import DishPalette from './DishPalette';
import MenuCategory from './MenuCategory';
import MenuStatisticsPanel from './MenuStatisticsPanel';
import CategoryManager from './CategoryManager';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';

interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

export default function MenuEditor({ menu, onBack, onMenuUpdated }: MenuEditorProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
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
      const [menuResponse, dishesResponse, statsResponse] = await Promise.all([
        fetch(`/api/menus/${menu.id}`),
        fetch('/api/dishes?pageSize=1000'),
        fetch(`/api/menus/${menu.id}/statistics`),
      ]);

      const menuData = await menuResponse.json();
      const dishesData = await dishesResponse.json();
      const statsData = await statsResponse.json();

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
      }

      if (statsData.success) {
        setStatistics(statsData.statistics);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
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
  }, [menu.id]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = async (category: string) => {
    if (categories.length === 1) {
      alert('Cannot remove the last category');
      return;
    }

    // Move items from this category to Uncategorized
    const itemsToMove = menuItems.filter(item => item.category === category);
    if (itemsToMove.length > 0) {
      for (const item of itemsToMove) {
        await fetch(`/api/menus/${menu.id}/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'Uncategorized',
            position: item.position,
          }),
        });
      }
    }

    setCategories(categories.filter(c => c !== category));
    await loadMenuData();
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menus/${menu.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadMenuData();
        await refreshStatistics();
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Loading menu...</div>;
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left Panel - Dish Palette */}
          <div className="lg:col-span-1">
            <DishPalette dishes={dishes} />
          </div>

          {/* Right Panel - Menu Builder */}
          <div className="lg:col-span-3">
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
              menuItems.find(item => item.id === activeId)?.dishes?.dish_name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
