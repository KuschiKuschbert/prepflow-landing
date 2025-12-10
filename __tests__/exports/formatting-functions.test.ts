/**
 * Unit tests for export formatting functions
 * Tests content formatting for different export types
 */

import {
  formatOrderListForPrint,
  type OrderListData,
} from '@/app/webapp/order-lists/utils/formatOrderListForPrint';
import { escapeHtml } from '@/lib/exports/template-utils';

describe('Export Formatting Functions', () => {
  describe('formatOrderListForPrint', () => {
    const mockOrderListData: OrderListData = {
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
    };

    it('should format order list with default variant', () => {
      const html = formatOrderListForPrint(mockOrderListData);
      expect(html).toContain('order-list-content');
      expect(html).toContain('Tomatoes');
      expect(html).toContain('Fresh Farm');
      expect(html).toContain('$25.99');
    });

    it('should format order list with supplier variant', () => {
      const html = formatOrderListForPrint(mockOrderListData, 'supplier');
      expect(html).toContain('supplier-variant');
      expect(html).toContain('purchase-order-info');
      expect(html).toContain('Bill To');
      expect(html).toContain('Ship To');
      expect(html).toContain('Items Ordered');
    });

    it('should handle empty data', () => {
      const emptyData: OrderListData = {
        menuName: 'Empty Menu',
        groupedIngredients: {},
        sortBy: 'name',
      };
      const html = formatOrderListForPrint(emptyData);
      expect(html).toContain('order-list-empty');
      expect(html).toContain('No ingredients found');
    });

    it('should escape HTML in ingredient names', () => {
      const dataWithSpecialChars: OrderListData = {
        menuName: 'Test Menu',
        groupedIngredients: {
          Test: [
            {
              id: '1',
              ingredient_name: '<script>alert("xss")</script>',
              brand: 'Test Brand',
              pack_size: '1',
              pack_size_unit: 'kg',
              pack_price: 10,
              cost_per_unit: 10,
              unit: 'kg',
            },
          ],
        },
        sortBy: 'name',
      };
      const html = formatOrderListForPrint(dataWithSpecialChars);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should include supplier information in supplier variant', () => {
      const dataWithSupplier: OrderListData = {
        ...mockOrderListData,
        supplier: {
          name: 'Test Supplier',
          contact_person: 'John Doe',
          email: 'john@supplier.com',
          phone: '0412345678',
          address: '123 Supplier St',
          payment_terms: 'Net 30',
        },
        purchaseOrderNumber: 'PO-20250115',
      };
      const html = formatOrderListForPrint(dataWithSupplier, 'supplier');
      expect(html).toContain('Test Supplier');
      expect(html).toContain('John Doe');
      expect(html).toContain('john@supplier.com');
      expect(html).toContain('PO-20250115');
    });
  });
});



