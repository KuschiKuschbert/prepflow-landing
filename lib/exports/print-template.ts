/**
 * Unified client-side print template
 * Provides consistent professional formatting for all PrepFlow print operations
 * Uses Cyber Carrot design system and PrepFlow voice
 */

import type { TemplateVariant } from './template-utils';
import { generateCustomerVariant } from './print-template/helpers/generateCustomerVariant';
import { generateSupplierVariant } from './print-template/helpers/generateSupplierVariant';
import { generateComplianceVariant } from './print-template/helpers/generateComplianceVariant';
import { generateCompactVariant } from './print-template/helpers/generateCompactVariant';
import { generateKitchenVariant } from './print-template/helpers/generateKitchenVariant';
import { generateDefaultVariant } from './print-template/helpers/generateDefaultVariant';
import { printWithTemplate as printWithTemplateHelper } from './print-template/helpers/printWithTemplate';

export type { TemplateVariant };

export interface PrintTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
  variant?: TemplateVariant;
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
}: PrintTemplateOptions): string {
  switch (variant) {
    case 'customer':
      return generateCustomerVariant(title, subtitle, content, totalItems, customMeta);
    case 'supplier':
      return generateSupplierVariant(title, subtitle, content, totalItems, customMeta);
    case 'compliance':
      return generateComplianceVariant(title, subtitle, content, totalItems, customMeta);
    case 'compact':
      return generateCompactVariant(title, subtitle, content);
    case 'kitchen':
      return generateKitchenVariant(title, subtitle, content);
    default:
      return generateDefaultVariant(title, subtitle, content, totalItems, customMeta);
  }
}

export { printWithTemplateHelper as printWithTemplate };
