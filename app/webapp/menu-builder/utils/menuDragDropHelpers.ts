import { arrayMove } from '@dnd-kit/sortable';
import { MenuItem } from '../types';

export async function addDishToMenu(
  menuId: string,
  dishId: string,
  category: string,
  onMenuDataReload: () => Promise<void>,
  onStatisticsUpdate: () => void,
) {
  try {
    const response = await fetch(`/api/menus/${menuId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dish_id: dishId,
        category,
      }),
    });

    if (response.ok) {
      await onMenuDataReload();
      onStatisticsUpdate();
    }
  } catch (err) {
    console.error('Failed to add dish to menu:', err);
  }
}

export async function reorderMenuItems(
  menuId: string,
  menuItems: MenuItem[],
  activeItem: MenuItem,
  activeId: string,
  overId: string,
  setMenuItems: (items: MenuItem[]) => void,
  onStatisticsUpdate: () => void,
) {
  const categoryItems = menuItems
    .filter(item => item.category === activeItem.category)
    .sort((a, b) => a.position - b.position);

  const oldIndex = categoryItems.findIndex(item => item.id === activeId);
  const newIndex = categoryItems.findIndex(item => item.id === overId);

  if (oldIndex === -1 || newIndex === -1) return;

  const reordered = arrayMove(categoryItems, oldIndex, newIndex);
  const updatedItems = reordered.map((item, index) => ({
    ...item,
    position: index,
  }));

  try {
    const response = await fetch(`/api/menus/${menuId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: updatedItems.map(item => ({
          id: item.id,
          category: item.category,
          position: item.position,
        })),
      }),
    });

    if (response.ok) {
      const otherItems = menuItems.filter(item => item.category !== activeItem.category);
      setMenuItems([...otherItems, ...updatedItems]);
      onStatisticsUpdate();
    }
  } catch (err) {
    console.error('Failed to reorder items:', err);
  }
}
