import { useState } from 'react';

interface SelectedMenuItem {
  id: string;
  name: string;
  type: 'dish' | 'recipe';
  mousePosition: { x: number; y: number };
}

export function useMenuItemSelection() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<SelectedMenuItem | null>(null);

  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    setSelectedMenuItem({
      id: menuItemId,
      name: menuItemName,
      type: menuItemType,
      mousePosition: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectedMenuItem({
        id: menuItemId,
        name: menuItemName,
        type: menuItemType,
        mousePosition: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedMenuItem(null);
  };

  return {
    selectedMenuItem,
    handleRowClick,
    handleRowKeyDown,
    handleCloseModal,
  };
}



