/**
 * Order list export utilities
 * Provides print and CSV export functionality for order lists
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { formatOrderListForPrint, type OrderListData } from './formatOrderListForPrint';
import { getOrderListPrintStyles } from './orderListPrintStyles';
import { exportToCSV } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';

/**
 * Print order list using unified template
 *
 * @param {OrderListData} data - Order list data
 * @param {string} variant - Template variant ('default' | 'supplier')
 * @returns {void} Opens print dialog
 */
export function printOrderList(
  data: OrderListData,
  variant: 'default' | 'supplier' = 'default',
): void {
  try {
    // Format order list content as HTML
    const contentHtml = formatOrderListForPrint(data, variant);

    // Get order list-specific styles
    const orderListStyles = getOrderListPrintStyles(variant);

    // Count total ingredients
    const totalItems = Object.values(data.groupedIngredients).reduce(
      (sum, ingredients) => sum + ingredients.length,
      0,
    );

    // Use unified print template
    printWithTemplate({
      title: variant === 'supplier' ? 'Purchase Order' : 'Order List',
      subtitle: data.menuName,
      content: `<style>${orderListStyles}</style>${contentHtml}`,
      totalItems,
      customMeta:
        variant === 'supplier'
          ? data.purchaseOrderNumber
            ? `PO: ${data.purchaseOrderNumber}`
            : undefined
          : `Sorted by: ${data.sortBy}`,
      variant: variant === 'supplier' ? 'supplier' : 'default',
    });
  } catch (err) {
    logger.error('[Order List Export] Print error:', err);
    throw err;
  }
}

/**
 * Export order list to CSV
 *
 * @param {OrderListData} data - Order list data
 * @returns {void} Downloads CSV file
 */
export function exportOrderListToCSV(data: OrderListData): void {
  try {
    // Flatten grouped ingredients into single array
    const allIngredients = Object.values(data.groupedIngredients).flat();

    // Prepare CSV data
    const csvData = allIngredients.map(ingredient => ({
      'Item Name': ingredient.ingredient_name,
      Brand: ingredient.brand || '',
      'Pack Size': ingredient.pack_size || '',
      'Pack Size Unit': ingredient.pack_size_unit || '',
      'Price Per Pack': ingredient.pack_price || 0,
      'Cost Per Unit': ingredient.cost_per_unit,
      Unit: ingredient.unit || '',
      Storage: ingredient.storage || '',
      Category: ingredient.category || '',
      'Par Level': ingredient.par_level || '',
      'Par Unit': ingredient.par_unit || '',
      'Reorder Point': ingredient.reorder_point || '',
    }));

    const headers = [
      'Item Name',
      'Brand',
      'Pack Size',
      'Pack Size Unit',
      'Price Per Pack',
      'Cost Per Unit',
      'Unit',
      'Storage',
      'Category',
      'Par Level',
      'Par Unit',
      'Reorder Point',
    ];

    // Generate filename with menu name and date
    const dateStr = new Date().toISOString().split('T')[0];
    const menuNameSafe = data.menuName.replace(/[^a-z0-9]/gi, '_');
    const filename = `order_list_${menuNameSafe}_${dateStr}.csv`;

    // Export CSV
    exportToCSV(csvData, headers, filename);
  } catch (err) {
    logger.error('[Order List Export] CSV export error:', err);
    throw err;
  }
}
