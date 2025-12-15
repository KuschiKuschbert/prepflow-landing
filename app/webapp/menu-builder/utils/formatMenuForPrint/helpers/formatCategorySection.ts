/**
 * Format a category section with its menu items.
 */
import { escapeHtml } from '@/lib/exports/template-utils';
import { formatMenuItem } from './formatMenuItem';
import type { MenuItem } from '../../../types';

export function formatCategorySection(category: string, categoryItems: MenuItem[]): string {
  categoryItems.sort((a, b) => a.position - b.position);
  return `
    <div class="menu-category">
      <h2>${escapeHtml(category)}</h2>
      ${categoryItems.map(item => formatMenuItem(item)).join('')}
    </div>
  `;
}
