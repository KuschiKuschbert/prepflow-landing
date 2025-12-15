/**
 * Map CSV row to sales data object.
 */
export function mapCSVRowToSalesData(row: Record<string, any>): any {
  const normalizedRow: Record<string, any> = {};
  Object.keys(row).forEach(key => {
    normalizedRow[key.toLowerCase().trim()] = row[key];
  });

  let dishName = '';
  let numberSold = 0;
  let popularityPercentage = 0;

  Object.keys(normalizedRow).forEach(key => {
    const value = normalizedRow[key];
    if (key.includes('dish') || key.includes('name')) {
      dishName = String(value || '').trim();
    } else if (key.includes('sold') || key.includes('number')) {
      numberSold = parseInt(String(value), 10) || 0;
    } else if (key.includes('popularity')) {
      popularityPercentage = parseFloat(String(value)) || 0;
    }
  });

  return {
    dish_name: dishName,
    number_sold: numberSold,
    popularity_percentage: popularityPercentage,
  };
}
