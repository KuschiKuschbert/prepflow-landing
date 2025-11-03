/**
 * CSV utility functions for performance data
 */

export function exportPerformanceDataToCSV(performanceItems: any[]): void {
  const csvContent = [
    'Dish,Number Sold,Popularity %,Total Revenue ex GST,Total Cost,Total Profit ex GST,Gross Profit %,Profit Cat,Popularity Cat,Menu Item Class',
    ...performanceItems.map(item =>
      [
        item.name,
        item.number_sold,
        item.popularity_percentage.toFixed(2),
        ((item.selling_price * item.number_sold) / 1.1).toFixed(2),
        (item.food_cost * item.number_sold).toFixed(2),
        (item.gross_profit * item.number_sold).toFixed(2),
        item.gross_profit_percentage.toFixed(2),
        item.profit_category,
        item.popularity_category,
        item.menu_item_class,
      ].join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-data-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function parseCSVSalesData(csvData: string) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  if (headers.length < 3) {
    throw new Error('CSV must have at least 3 columns: Dish, Number Sold, Popularity %');
  }
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return {
      dish_name: values[0],
      number_sold: parseInt(values[1]) || 0,
      popularity_percentage: parseFloat(values[2]) || 0,
    };
  });
}
