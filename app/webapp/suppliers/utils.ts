export function getSupplierIcon(supplierName: string): string {
  const name = supplierName.toLowerCase();
  if (name.includes('meat') || name.includes('butcher')) return '🥩';
  if (name.includes('fish') || name.includes('seafood')) return '🐟';
  if (name.includes('vegetable') || name.includes('produce')) return '🥬';
  if (name.includes('dairy') || name.includes('milk')) return '🥛';
  if (name.includes('bakery') || name.includes('bread')) return '🍞';
  if (name.includes('wine') || name.includes('beverage')) return '🍷';
  return '🚚';
}
