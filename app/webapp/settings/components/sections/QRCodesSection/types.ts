export interface QRCodeEntity {
  id: string;
  name: string;
  type: 'recipe' | 'cleaning-area' | 'employee' | 'supplier' | 'storage-area';
  subtitle?: string;
  destinationUrl: string;
  createdAt?: string;
}

import type { LucideIcon } from 'lucide-react';

export interface TypeConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  order: number;
}
