import type { PreviewData } from '../types';

export const kitchenPreview: PreviewData = {
  title: 'Morning Prep List',
  subtitle: 'Station: Garde Manger',
  customMeta: 'Date: 24 Oct 2024',
  totalItems: 4,
  content: `
    <table class="prep-list-table">
      <thead>
        <tr>
          <th width="50">Done</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="checkbox" /></td>
          <td>Dice Onions</td>
          <td>5</td>
          <td>kg</td>
          <td>Fine dice for salsa</td>
        </tr>
        <tr>
          <td><input type="checkbox" /></td>
          <td>Slice Tomatoes</td>
          <td>20</td>
          <td>ea</td>
          <td>Burger station</td>
        </tr>
        <tr>
          <td><input type="checkbox" /></td>
          <td>Wash Lettuce</td>
          <td>4</td>
          <td>box</td>
          <td>Ice water shock</td>
        </tr>
        <tr>
          <td><input type="checkbox" /></td>
          <td>Make Vinaigrette</td>
          <td>2</td>
          <td>L</td>
          <td>Label and date</td>
        </tr>
      </tbody>
    </table>
  `,
};
