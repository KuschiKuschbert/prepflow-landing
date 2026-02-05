/**
 * Print utilities for prep lists
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { getSavedExportTheme } from '@/lib/exports/utils/themeUtils';
import type { PrepList, SectionData } from '@/lib/types/prep-lists';
import { formatGeneratedPrepListForPrint } from './formatGeneratedPrepList';
import { formatPrepListForPrint } from './formatPrepList';
import { getPrintStyles } from './prepListPrintStyles';

interface ExportOptions {
  sections?: string[];
  includeInstructions?: boolean;
  variant?: 'default' | 'kitchen';
}

export function printPrepList(
  prepList: PrepList,
  variant: 'default' | 'kitchen' = 'default',
): void {
  const html = formatPrepListForPrint(prepList, variant);
  const styles = getPrintStyles(variant);
  const theme = getSavedExportTheme();

  // Use unified print template with variant support
  printWithTemplate({
    title: prepList.name,
    subtitle: 'Prep List',
    content: `<style>${styles}</style>${html}`,
    variant: variant === 'kitchen' ? 'kitchen' : 'default',
    theme,
  });
}

export function printGeneratedPrepList(
  sections: SectionData[],
  menuName: string,
  options?: ExportOptions,
): void {
  const variant = options?.variant || 'default';
  const html = formatGeneratedPrepListForPrint(sections, menuName, options);
  const styles = getPrintStyles(variant);
  const theme = getSavedExportTheme();

  // Use unified print template with variant support
  printWithTemplate({
    title: `${menuName} - Prep List`,
    subtitle: 'Generated Prep List',
    content: `<style>${styles}</style>${html}`,
    totalItems: sections.reduce(
      (sum, section) =>
        sum + (section.aggregatedIngredients?.length || 0) + (section.recipeGrouped?.length || 0),
      0,
    ),
    variant: variant === 'kitchen' ? 'kitchen' : 'default',
    theme,
  });
}
