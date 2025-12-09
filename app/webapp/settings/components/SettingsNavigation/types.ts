import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  hash: string;
  label: string;
  icon: LucideIcon;
  ariaLabel: string;
  category: string;
  description: string;
}

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export interface FocusedIndex {
  categoryId: string;
  itemIndex: number;
}
