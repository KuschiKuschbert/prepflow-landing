import { MenuItemData } from '../fetchMenuItemData';
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
