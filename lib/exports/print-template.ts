/**
 * Unified client-side print template
 * Provides consistent professional formatting for all PrepFlow print operations
 * Uses Cyber Carrot design system and PrepFlow voice
 */

// Removed getLogoBase64 import to prevent fs module leakage to client
import { generateCompactVariant } from './print-template/helpers/generateCompactVariant';
import { generateComplianceVariant } from './print-template/helpers/generateComplianceVariant';
import { generateCustomerVariant } from './print-template/helpers/generateCustomerVariant';
import { generateDefaultVariant } from './print-template/helpers/generateDefaultVariant';
import { generateKitchenVariant } from './print-template/helpers/generateKitchenVariant';
import { generateMenuVariant } from './print-template/helpers/generateMenuVariant';
import { generateRecipeVariant } from './print-template/helpers/generateRecipeVariant';
import { generateSupplierVariant } from './print-template/helpers/generateSupplierVariant';
import { printWithTemplate as printWithTemplateHelper } from './print-template/helpers/printWithTemplate';

export type TemplateVariant =
  | 'default'
  | 'kitchen'
  | 'customer'
  | 'supplier'
  | 'compliance'
  | 'compact'
  | 'menu'
  | 'recipe';

import type { ExportTheme } from './themes';

export interface PrintTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
  variant?: TemplateVariant;
  theme?: ExportTheme;
  logoSrc?: string;
}

/**
 * Generate professional print template with PrepFlow branding
 */
export function generatePrintTemplate({
  title,
  subtitle,
  content,
  totalItems,
  customMeta,
  variant = 'default',
  theme = 'cyber-carrot',
  logoSrc = '/images/prepflow-logo.png',
}: PrintTemplateOptions): string {
  // logoSrc is now passed in or defaults to public URL
  // Server-side callers should pass getLogoBase64() result here

  switch (variant) {
    case 'customer':
      return generateCustomerVariant(title, subtitle, content, totalItems, customMeta, theme);
    case 'supplier':
      return generateSupplierVariant(title, subtitle, content, totalItems, customMeta, theme);
    case 'compliance':
      return generateComplianceVariant(
        title,
        subtitle,
        content,
        totalItems,
        customMeta,
        theme,
        logoSrc,
      );
    case 'compact':
      return generateCompactVariant(title, subtitle, content, theme, logoSrc);
    case 'kitchen':
      return generateKitchenVariant(title, subtitle, content, theme);
    case 'menu':
      return generateMenuVariant(title, subtitle, content, theme);
    case 'recipe':
      return generateRecipeVariant(title, subtitle, content, theme);
    default:
      return generateDefaultVariant(title, subtitle, content, totalItems, customMeta, theme);
  }
}

export { printWithTemplateHelper as printWithTemplate };
