import type { PreviewData } from '../types';

export const supplierPreview: PreviewData = {
  title: 'Purchase Order #PO-9942',
  subtitle: 'Supplier: Fresh Produce Co.',
  customMeta: 'Delivery: Tomorrow AM',
  totalItems: 3,
  content: `
    <div class="order-details">
      <p><strong>Contact:</strong> John Doe (555-0199)</p>
      <p><strong>Ship To:</strong> Main Kitchen, 123 Culinary Ave.</p>
    </div>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Item Code</th>
          <th>Description</th>
          <th style="text-align:right">Qty</th>
          <th style="text-align:right">Unit Price</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>VEG-001</td>
          <td>Avocados (Hass)</td>
          <td style="text-align:right">24</td>
          <td style="text-align:right">$1.50</td>
          <td style="text-align:right">$36.00</td>
        </tr>
        <tr>
          <td>VEG-042</td>
          <td>Lemons (Case)</td>
          <td style="text-align:right">2</td>
          <td style="text-align:right">$45.00</td>
          <td style="text-align:right">$90.00</td>
        </tr>
        <tr>
          <td>HRB-007</td>
          <td>Fresh Basil</td>
          <td style="text-align:right">10</td>
          <td style="text-align:right">$2.00</td>
          <td style="text-align:right">$20.00</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="text-align:right"><strong>Total</strong></td>
          <td style="text-align:right"><strong>$146.00</strong></td>
        </tr>
      </tfoot>
    </table>
  `,
};
