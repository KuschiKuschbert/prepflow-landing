/**
 * CSS styles for prep list printing
 * Prep-list-specific styles that extend the unified template styles
 */

import { getAllTemplateStyles } from '@/lib/exports/template-styles/index';

export function getPrintStyles(variant: 'default' | 'kitchen' = 'default'): string {
  // Get all styles from the centralized system
  // The 'kitchen' variant in getAllTemplateStyles now includes all the modernized prep list styles
  return getAllTemplateStyles('kitchen');
}
