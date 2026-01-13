import { logger } from '@/lib/logger';
import type { PrintTemplateOptions } from '../../print-template';
import { generateCompactVariant } from './generateCompactVariant';
import { generateComplianceVariant } from './generateComplianceVariant';
import { generateCustomerVariant } from './generateCustomerVariant';
import { generateDefaultVariant } from './generateDefaultVariant';
import { generateKitchenVariant } from './generateKitchenVariant';
import { generateSupplierVariant } from './generateSupplierVariant';

/**
 * Generate print template HTML (duplicated to avoid circular import)
 */
function generatePrintTemplate(options: PrintTemplateOptions): string {
  const { title, subtitle, content, totalItems, customMeta, variant = 'default' } = options;
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

/**
 * Print content using unified template
 */
export function printWithTemplate(options: PrintTemplateOptions): void {
  const html = generatePrintTemplate(options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    logger.warn('[Print Template] Failed to open print window - popup blocked?');
    return;
  }

  printWindow.document.write(html); // auditor:ignore
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}
