import { Beef, Fish, Leaf, Milk, Truck, Wheat, Wine, type LucideIcon } from 'lucide-react';

/**
 * Returns a Lucide icon for the supplier based on name keywords.
 */
export function getSupplierIcon(supplierName: string | null | undefined): LucideIcon {
  if (!supplierName || typeof supplierName !== 'string') {
    return Truck;
  }

  const name = supplierName.toLowerCase();
  if (name.includes('meat') || name.includes('butcher')) return Beef;
  if (name.includes('fish') || name.includes('seafood')) return Fish;
  if (name.includes('vegetable') || name.includes('produce')) return Leaf;
  if (name.includes('dairy') || name.includes('milk')) return Milk;
  if (name.includes('bakery') || name.includes('bread')) return Wheat;
  if (name.includes('wine') || name.includes('beverage')) return Wine;
  return Truck;
}
