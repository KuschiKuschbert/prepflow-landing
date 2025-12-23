import type { TemplateVariant } from '../../template-utils';
import { generatePrintTemplate, type PrintTemplateOptions } from '../../print-template';
import { logger } from '@/lib/logger';
import { validateExportHTML, validateVariant } from './validateHTML';

/**
 * Test template generation with different variants
 */
export function testTemplateVariants(
  variants: TemplateVariant[] = [
    'default',
    'kitchen',
    'customer',
    'supplier',
    'compliance',
    'compact',
  ],
) {
  const results: Record<string, { valid: boolean; errors: string[] }> = {};

  variants.forEach(variant => {
    const options: PrintTemplateOptions = {
      title: 'Test Export',
      subtitle: 'Test Subtitle',
      content: '<div>Test Content</div>',
      variant,
    };

    try {
      const html = generatePrintTemplate(options);
      const validation = validateExportHTML(html);
      const variantApplied = validateVariant(html, variant);

      results[variant] = {
        valid: validation.valid && variantApplied,
        errors: [
          ...validation.errors,
          ...(variantApplied ? [] : [`Variant ${variant} not correctly applied`]),
        ],
      };
    } catch (error) {
      logger.error('[test-helpers.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      results[variant] = {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  });

  return results;
}

/**
 * Generate test report for export templates
 */
export function generateTestReport(
  testResults: Record<string, { valid: boolean; errors: string[] }>,
): string {
  let report = '# Export Template Test Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const variants = Object.keys(testResults);
  const passed = variants.filter(v => testResults[v].valid).length;
  const failed = variants.filter(v => !testResults[v].valid).length;

  report += `## Summary\n\n`;
  report += `- Total Variants Tested: ${variants.length}\n`;
  report += `- Passed: ${passed}\n`;
  report += `- Failed: ${failed}\n\n`;

  report += `## Results\n\n`;

  variants.forEach(variant => {
    const result = testResults[variant];
    report += `### ${variant}\n\n`;
    report += `Status: ${result.valid ? '✅ PASS' : '❌ FAIL'}\n\n`;

    if (result.errors.length > 0) {
      report += `Errors:\n`;
      result.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += `\n`;
    }
  });

  return report;
}

