import { PerformanceFilters, PerformanceItem } from '../types';

export function filterPerformanceItems(
  items: PerformanceItem[],
  filters: PerformanceFilters,
): PerformanceItem[] {
  return items.filter(item => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

    // Menu item class filter
    const matchesClass =
      !filters.menuItemClass ||
      filters.menuItemClass.length === 0 ||
      filters.menuItemClass.includes(item.menu_item_class);

    return matchesSearch && matchesClass;
  });
}

