/**
 * Unit tests for export template utilities
 * Tests formatting functions, variant selection, and utility functions
 */

import {
  formatDateAustralian,
  formatDateShort,
  formatCurrency,
  formatDateRange,
  getRecommendedVariant,
  getVariantDisplayName,
  getVariantDescription,
  escapeHtml,
  formatMetaInfo,
} from '@/lib/exports/template-utils';
import type { TemplateVariant } from '@/lib/exports/template-utils';

describe('Template Utilities', () => {
  describe('formatDateAustralian', () => {
    it('should format date in Australian format', () => {
      const date = new Date('2025-01-15T10:30:00');
      const formatted = formatDateAustralian(date);
      expect(formatted).toContain('2025');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
    });

    it('should use current date if no date provided', () => {
      const formatted = formatDateAustralian();
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short Australian format', () => {
      const date = new Date('2025-01-15T10:30:00');
      const formatted = formatDateShort(date);
      expect(formatted).toContain('2025');
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in AUD with symbol', () => {
      const formatted = formatCurrency(29.99);
      expect(formatted).toContain('$');
      expect(formatted).toContain('29.99');
    });

    it('should format currency without symbol when requested', () => {
      const formatted = formatCurrency(29.99, false);
      expect(formatted).toBe('29.99');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('0');
    });

    it('should handle large numbers', () => {
      const formatted = formatCurrency(1234567.89);
      expect(formatted).toContain('1,234,567.89');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const formatted = formatDateRange('2025-01-01', '2025-01-31');
      expect(formatted).toContain('January');
      expect(formatted).toContain('2025');
      expect(formatted).toContain('1');
      expect(formatted).toContain('31');
    });
  });

  describe('getRecommendedVariant', () => {
    it('should return supplier variant for order lists', () => {
      const variant = getRecommendedVariant('order-list');
      expect(variant).toBe('supplier');
    });

    it('should return supplier variant when isSupplier is true', () => {
      const variant = getRecommendedVariant('any', { isSupplier: true });
      expect(variant).toBe('supplier');
    });

    it('should return compliance variant for compliance content', () => {
      const variant = getRecommendedVariant('compliance');
      expect(variant).toBe('compliance');
    });

    it('should return compliance variant when isAudit is true', () => {
      const variant = getRecommendedVariant('any', { isAudit: true });
      expect(variant).toBe('compliance');
    });

    it('should return customer variant for menus', () => {
      const variant = getRecommendedVariant('menu');
      expect(variant).toBe('customer');
    });

    it('should return customer variant when isCustomerFacing is true', () => {
      const variant = getRecommendedVariant('any', { isCustomerFacing: true });
      expect(variant).toBe('customer');
    });

    it('should return kitchen variant for prep lists', () => {
      const variant = getRecommendedVariant('prep-list');
      expect(variant).toBe('kitchen');
    });

    it('should return kitchen variant when isKitchenUse is true', () => {
      const variant = getRecommendedVariant('any', { isKitchenUse: true });
      expect(variant).toBe('kitchen');
    });

    it('should return default variant when no match', () => {
      const variant = getRecommendedVariant('unknown');
      expect(variant).toBe('default');
    });
  });

  describe('getVariantDisplayName', () => {
    it('should return display name for all variants', () => {
      const variants: TemplateVariant[] = [
        'default',
        'kitchen',
        'customer',
        'supplier',
        'compliance',
        'compact',
      ];
      variants.forEach(variant => {
        const name = getVariantDisplayName(variant);
        expect(name).toBeTruthy();
        expect(typeof name).toBe('string');
      });
    });

    it('should return correct display names', () => {
      expect(getVariantDisplayName('default')).toBe('Standard');
      expect(getVariantDisplayName('kitchen')).toBe('Kitchen');
      expect(getVariantDisplayName('customer')).toBe('Customer');
      expect(getVariantDisplayName('supplier')).toBe('Supplier');
      expect(getVariantDisplayName('compliance')).toBe('Compliance');
      expect(getVariantDisplayName('compact')).toBe('Compact');
    });
  });

  describe('getVariantDescription', () => {
    it('should return description for all variants', () => {
      const variants: TemplateVariant[] = [
        'default',
        'kitchen',
        'customer',
        'supplier',
        'compliance',
        'compact',
      ];
      variants.forEach(variant => {
        const description = getVariantDescription(variant);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
      });
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(escapeHtml('Test & Test')).toBe('Test &amp; Test');
      expect(escapeHtml("It's working")).toBe('It&#039;s working');
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle strings without special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('formatMetaInfo', () => {
    it('should format meta info with total items', () => {
      const meta = formatMetaInfo({ totalItems: 10 });
      expect(meta).toContain('Total Items: 10');
    });

    it('should format meta info with custom meta', () => {
      const meta = formatMetaInfo({ customMeta: 'Test Meta' });
      expect(meta).toBe('Test Meta');
    });

    it('should format meta info with both', () => {
      const meta = formatMetaInfo({ totalItems: 10, customMeta: 'Test Meta' });
      expect(meta).toContain('Total Items: 10');
      expect(meta).toContain('Test Meta');
      expect(meta).toContain('|');
    });

    it('should return empty string when no meta', () => {
      const meta = formatMetaInfo({});
      expect(meta).toBe('');
    });
  });
});

