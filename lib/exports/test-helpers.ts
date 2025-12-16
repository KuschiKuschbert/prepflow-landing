/**
 * Test helpers for export template system
 * Provides utilities for testing exports, templates, and variants
 */

import type { TemplateVariant } from './template-utils';
import { generatePrintTemplate, type PrintTemplateOptions } from './print-template';

/**
 * Mock data for testing exports
 */
export const mockExportData = {
  orderList: {
    menuName: 'Test Menu',
    groupedIngredients: {
      Vegetables: [
        {
          id: '1',
          ingredient_name: 'Tomatoes',
          brand: 'Fresh Farm',
          pack_size: '5',
          pack_size_unit: 'kg',
          pack_price: 25.99,
          cost_per_unit: 5.198,
          unit: 'kg',
          storage: 'Dry Store',
          category: 'Vegetables',
          par_level: 10,
          par_unit: 'kg',
        },
      ],
    },
    sortBy: 'name',
  },
  temperatureLogs: [
    {
      id: 1,
      log_date: '2025-01-15',
      log_time: '10:30:00',
      temperature_celsius: 3.5,
      location: 'Main Fridge',
      temperature_type: 'cold',
      logged_by: 'Test User',
      notes: 'Test note',
      created_at: '2025-01-15T10:30:00Z',
    },
  ],
  cleaningTasks: [
    {
      id: 1,
      task_name: 'Clean Prep Area',
      cleaning_areas: { area_name: 'Prep Station' },
      frequency_type: 'daily',
      completions: [],
    },
  ],
};

/**
 * Validate HTML structure for export templates
 *
 * @param {string} html - HTML string to validate
 * @returns {Object} Validation result with errors array
 */
export function validateExportHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required elements
  if (!html.includes('<!DOCTYPE html>')) {
    errors.push('Missing DOCTYPE declaration');
  }

  if (!html.includes('<html')) {
    errors.push('Missing <html> tag');
  }

  if (!html.includes('<head>')) {
    errors.push('Missing <head> tag');
  }

  if (!html.includes('<body')) {
    errors.push('Missing <body> tag');
  }

  // Check for style tag
  if (!html.includes('<style>') && !html.includes('<style ')) {
    errors.push('Missing <style> tag');
  }

  // Check for content wrapper
  if (!html.includes('content-wrapper')) {
    errors.push('Missing content-wrapper class');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate template variant is correctly applied
 *
 * @param {string} html - HTML string to validate
 * @param {TemplateVariant} variant - Expected variant
 * @returns {boolean} True if variant is correctly applied
 */
export function validateVariant(html: string, variant: TemplateVariant): boolean {
  const variantClass = `variant-${variant}`;
  return (
    html.includes(variantClass) ||
    html.includes(`class="${variantClass}"`) ||
    html.includes(`class='${variantClass}'`)
  );
}

/**
 * Test template generation with different variants
 *
 * @param {TemplateVariant[]} variants - Variants to test
 * @returns {Object} Test results
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
      results[variant] = {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  });

  return results;
}

/**
 * Extract CSS from HTML string
 *
 * @param {string} html - HTML string
 * @returns {string} Extracted CSS
 */
export function extractCSS(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  return styleMatch ? styleMatch[1] : '';
}

/**
 * Extract content from HTML string
 *
 * @param {string} html - HTML string
 * @returns {string} Extracted content
 */
export function extractContent(html: string): string {
  const contentMatch = html.match(
    /<div[^>]*class="[^"]*export-content[^"]*"[^>]*>([\s\S]*?)<\/div>/,
  );
  return contentMatch ? contentMatch[1] : '';
}

/**
 * Check if HTML contains required Cyber Carrot branding elements
 *
 * @param {string} html - HTML string
 * @param {TemplateVariant} variant - Template variant
 * @returns {boolean} True if branding is appropriate for variant
 */
export function hasAppropriateBranding(html: string, variant: TemplateVariant): boolean {
  // Default variant should have full branding
  if (variant === 'default') {
    return html.includes('PrepFlow') || html.includes('prepflow');
  }

  // Kitchen and compact variants should have minimal branding
  if (variant === 'kitchen' || variant === 'compact') {
    return !html.includes('background-grid') && !html.includes('corner-glow');
  }

  // Other variants may have varying branding
  return true;
}

/**
 * Generate test report for export templates
 *
 * @param {Object} testResults - Test results from testTemplateVariants
 * @returns {string} Formatted test report
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



