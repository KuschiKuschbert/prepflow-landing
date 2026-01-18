import { ChefHat, Sparkles, Refrigerator, User, Truck, QrCode } from 'lucide-react';
import type { TypeConfig } from './types';

export const typeConfig: Record<string, TypeConfig> = {
  recipe: { icon: ChefHat, label: 'Recipes', color: '#3B82F6', order: 1 },
  'cleaning-area': { icon: Sparkles, label: 'Cleaning Areas', color: '#29E7CD', order: 2 },
  'storage-area': { icon: Refrigerator, label: 'Storage Areas', color: '#8B5CF6', order: 3 },
  employee: { icon: User, label: 'Employees', color: '#D925C7', order: 4 },
  supplier: { icon: Truck, label: 'Suppliers', color: '#F59E0B', order: 5 },
};

export const defaultTypeConfig: TypeConfig = {
  icon: QrCode,
  label: 'Unknown',
  color: '#888',
  order: 99,
};
