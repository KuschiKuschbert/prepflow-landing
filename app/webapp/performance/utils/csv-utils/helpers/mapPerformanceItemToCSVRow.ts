import { PerformanceItem } from '@/lib/types/performance';

/**
 * Map performance item to CSV row format.
 */
export function mapPerformanceItemToCSVRow(item: PerformanceItem): Record<string, string | number> {
  return {
    Dish: item.name || '',
    'Number Sold': item.number_sold || 0,
    'Popularity %': item.popularity_percentage?.toFixed(2) || '0.00',
    'Total Revenue ex GST': ((item.selling_price * item.number_sold) / 1.1).toFixed(2),
    'Total Cost': (item.food_cost * item.number_sold).toFixed(2),
    'Total Profit ex GST': (item.gross_profit * item.number_sold).toFixed(2),
    'Gross Profit %': item.gross_profit_percentage?.toFixed(2) || '0.00',
    'Profit Cat': item.profit_category || '',
    'Popularity Cat': item.popularity_category || '',
    'Menu Item Class': item.menu_item_class || '',
  };
}
