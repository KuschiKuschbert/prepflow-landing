import { PerformanceItem } from '../types';

export function sortPerformanceItems(
  items: PerformanceItem[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
): PerformanceItem[] {
  return [...items].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'number_sold':
        aValue = a.number_sold;
        bValue = b.number_sold;
        break;
      case 'popularity_percentage':
        aValue = a.popularity_percentage;
        bValue = b.popularity_percentage;
        break;
      case 'total_revenue':
        aValue = (a.selling_price * a.number_sold) / 1.1;
        bValue = (b.selling_price * b.number_sold) / 1.1;
        break;
      case 'total_cost':
        aValue = a.food_cost * a.number_sold;
        bValue = b.food_cost * b.number_sold;
        break;
      case 'total_profit':
        aValue = a.gross_profit * a.number_sold;
        bValue = b.gross_profit * b.number_sold;
        break;
      case 'gross_profit_percentage':
        aValue = a.gross_profit_percentage;
        bValue = b.gross_profit_percentage;
        break;
      case 'profit_category':
        aValue = a.profit_category;
        bValue = b.profit_category;
        break;
      case 'popularity_category':
        aValue = a.popularity_category;
        bValue = b.popularity_category;
        break;
      case 'menu_item_class':
        aValue = a.menu_item_class;
        bValue = b.menu_item_class;
        break;
      default:
        aValue = a.gross_profit_percentage;
        bValue = b.gross_profit_percentage;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

