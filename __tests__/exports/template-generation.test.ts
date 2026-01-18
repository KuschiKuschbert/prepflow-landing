/**
 * Unit tests for template generation
 * Tests generatePrintTemplate and printWithTemplate functions
 */

import { generatePrintTemplate, type PrintTemplateOptions } from '@/lib/exports/print-template';
import {
  testTemplateVariants,
  validateExportHTML,
  validateVariant,
} from '@/lib/exports/test-helpers';

describe('Template Generation', () => {
  const baseOptions: PrintTemplateOptions = {
    title: 'Test Export',
    subtitle: 'Test Subtitle',
    content: '<div>Test Content</div>',
  };

  describe('generatePrintTemplate', () => {
    it('should generate valid HTML for default variant', () => {
      const html = generatePrintTemplate(baseOptions);
      const validation = validateExportHTML(html);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should include title in HTML', () => {
      const html = generatePrintTemplate(baseOptions);
      expect(html).toContain('Test Export');
    });

    it('should include subtitle in HTML', () => {
      const html = generatePrintTemplate(baseOptions);
      expect(html).toContain('Test Subtitle');
    });

    it('should include content in HTML', () => {
      const html = generatePrintTemplate(baseOptions);
      expect(html).toContain('Test Content');
    });

    it('should apply default variant correctly', () => {
      const html = generatePrintTemplate(baseOptions);
      expect(html).toContain('PrepFlow');
      expect(html).toContain('class="background-grid"');
    });

    it('should apply kitchen variant correctly', () => {
      const html = generatePrintTemplate({ ...baseOptions, variant: 'kitchen' });
      const variantApplied = validateVariant(html, 'kitchen');
      expect(variantApplied).toBe(true);
      expect(html).not.toContain('class="background-grid"');
    });

    it('should apply customer variant correctly', () => {
      const html = generatePrintTemplate({ ...baseOptions, variant: 'customer' });
      const variantApplied = validateVariant(html, 'customer');
      expect(variantApplied).toBe(true);
    });

    it('should apply supplier variant correctly', () => {
      const html = generatePrintTemplate({ ...baseOptions, variant: 'supplier' });
      const variantApplied = validateVariant(html, 'supplier');
      expect(variantApplied).toBe(true);
      expect(html).toContain('PURCHASE ORDER');
    });

    it('should apply compliance variant correctly', () => {
      const html = generatePrintTemplate({ ...baseOptions, variant: 'compliance' });
      const variantApplied = validateVariant(html, 'compliance');
      expect(variantApplied).toBe(true);
      expect(html).toContain('COMPLIANCE REPORT');
    });

    it('should apply compact variant correctly', () => {
      const html = generatePrintTemplate({ ...baseOptions, variant: 'compact' });
      const variantApplied = validateVariant(html, 'compact');
      expect(variantApplied).toBe(true);
    });

    it('should include totalItems in meta info', () => {
      const html = generatePrintTemplate({ ...baseOptions, totalItems: 10 });
      expect(html).toContain('Total Items: 10');
    });

    it('should include customMeta in meta info', () => {
      const html = generatePrintTemplate({ ...baseOptions, customMeta: 'Custom Meta' });
      expect(html).toContain('Custom Meta');
    });

    it('should escape HTML in title', () => {
      const html = generatePrintTemplate({
        ...baseOptions,
        title: '<script>alert("xss")</script>',
      });
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should escape HTML in subtitle', () => {
      const html = generatePrintTemplate({
        ...baseOptions,
        subtitle: '<script>alert("xss")</script>',
      });
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('All Variants', () => {
    it('should generate valid HTML for all variants', () => {
      const results = testTemplateVariants();
      const allValid = Object.values(results).every(r => r.valid);

      if (!allValid) {
        const failures = Object.entries(results)
          .filter(([_, result]) => !result.valid)
          .map(([variant, result]) => `${variant}: ${result.errors.join(', ')}`);

        console.error('Variant test failures:', failures);
      }

      expect(allValid).toBe(true);
    });
  });
});
