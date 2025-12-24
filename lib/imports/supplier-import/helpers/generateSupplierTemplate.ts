/**
 * Generate supplier CSV template
 */
export function generateSupplierTemplate(): string {
  const headers = [
    'name',
    'contact_person',
    'email',
    'phone',
    'address',
    'website',
    'payment_terms',
    'delivery_schedule',
    'minimum_order_amount',
    'is_active',
    'notes',
  ];

  const exampleRow = [
    'Fresh Produce Co',
    'John Smith',
    'john@freshproduce.com',
    '0412 345 678',
    '123 Main St, Brisbane QLD 4000',
    'https://freshproduce.com',
    'Net 30',
    'Monday, Wednesday, Friday',
    '100',
    'true',
    'Preferred supplier for vegetables',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}
