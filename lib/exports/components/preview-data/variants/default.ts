import type { PreviewData } from '../types';

export const defaultPreview: PreviewData = {
  title: 'Order List: Week 42',
  subtitle: 'Main Kitchen • 5 Items',
  customMeta: 'Created: Oct 24, 2024',
  totalItems: 5,
  content: `
    <div style="margin-bottom: 20px;">
      <p><strong>List Name:</strong> Weekly Staples</p>
      <p><strong>Supplier:</strong> General Dist. Co.</p>
    </div>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th style="text-align:right">Qty</th>
          <th style="text-align:center">Unit</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kosher Salt</td>
          <td>Pantry</td>
          <td style="text-align:right">5</td>
          <td style="text-align:center">box</td>
          <td>Diamond Crystal</td>
        </tr>
        <tr>
          <td>Olive Oil (EVOO)</td>
          <td>Pantry</td>
          <td style="text-align:right">12</td>
          <td style="text-align:center">L</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Black Pepper</td>
          <td>Spices</td>
          <td style="text-align:right">2</td>
          <td style="text-align:center">kg</td>
          <td>Whole peppercorns</td>
        </tr>
        <tr>
          <td>AP Flour</td>
          <td>Dry Goods</td>
          <td style="text-align:right">1</td>
          <td style="text-align:center">bag</td>
          <td>20kg sack</td>
        </tr>
        <tr>
          <td>Sugar</td>
          <td>Dry Goods</td>
          <td style="text-align:right">10</td>
          <td style="text-align:center">kg</td>
          <td>White granulated</td>
        </tr>
      </tbody>
    </table>
  `,
};
