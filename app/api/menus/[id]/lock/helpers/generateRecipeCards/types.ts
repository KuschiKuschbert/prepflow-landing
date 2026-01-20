import { MenuItemData } from '../types';
import { MenuItem } from './fetchMenuItems';

export interface ItemToGenerate {
  menuItem: MenuItem;
  menuItemData: MenuItemData;
  signature: string;
  existingCardId?: string;
}

export interface CheckResult {
  itemsToGenerate: ItemToGenerate[];
  itemsToLink: Array<{ menuItemId: string; cardId: string }>;
  reusedCount: number;
  linkedCount: number;
}
