/**
 * Normalize order list data with nested ingredient_name.
 *
 * @param {Array} data - Raw order list data from database
 * @returns {Array} Normalized order list data
 */
export function normalizeOrderListData(data: any[]) {
  return (data || []).map((ol: any) => ({
    ...ol,
    suppliers: ol.suppliers
      ? { ...ol.suppliers, supplier_name: ol.suppliers.supplier_name || ol.suppliers.name }
      : null,
    order_list_items: (ol.order_list_items || []).map((it: any) => ({
      ...it,
      ingredients: it.ingredients
        ? {
            ...it.ingredients,
            ingredient_name: it.ingredients.ingredient_name || it.ingredients.name,
          }
        : null,
    })),
  }));
}
