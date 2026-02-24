'use client';

import type { AppFunction } from '@/app/api/functions/helpers/schemas';
import { useEffect, useState } from 'react';
import type { RunsheetItemWithRelations } from '../components/runsheet-types';
import { useMenuPricePerPerson } from './useMenuPricePerPerson';
import { useRunsheetMutations } from './useRunsheetMutations';
import { useRunsheetOptions } from './useRunsheetOptions';

interface UseRunsheetPanelParams {
  func: AppFunction;
  initialItems: RunsheetItemWithRelations[];
  functionId: string;
}

export function useRunsheetPanel({ func, initialItems, functionId }: UseRunsheetPanelParams) {
  const [items, setItems] = useState<RunsheetItemWithRelations[]>(initialItems);
  const [activeDay, setActiveDay] = useState(1);

  const { menus, dishes, recipes, fetchMenus } = useRunsheetOptions();
  const menuPricePerPerson = useMenuPricePerPerson(items);

  const dayItems = items
    .filter(item => item.day_number === activeDay)
    .sort((a, b) => a.position - b.position);

  const { handleAddItem, handleDeleteItem, handleUpdateItem, handleMenuClick } =
    useRunsheetMutations({
      functionId,
      items,
      setItems,
      menus,
      dishes,
      recipes,
      dayItemsLength: dayItems.length,
    });

  const isMultiDay = func.start_date && func.end_date && func.start_date !== func.end_date;
  const totalDays = isMultiDay
    ? Math.max(
        1,
        Math.round(
          (new Date(func.end_date!).getTime() - new Date(func.start_date).getTime()) / 86400000,
        ) + 1,
      )
    : 1;

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    activeDay,
    setActiveDay,
    menus,
    dishes,
    recipes,
    menuPricePerPerson,
    dayItems,
    totalDays,
    isMultiDay,
    fetchMenus,
    handleAddItem,
    handleDeleteItem,
    handleUpdateItem,
    handleMenuClick,
  };
}
