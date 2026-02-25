import type { PreviewData } from '../types';

export const compliancePreview: PreviewData = {
  title: 'Temperature Log',
  subtitle: 'Unit: Walk-in Fridge #1',
  customMeta: 'Week of: Oct 20 - Oct 26',
  totalItems: 7,
  content: `
    <table class="compliance-table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Time</th>
          <th>Temp (°C)</th>
          <th>Checked By</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monday</td>
          <td>08:00 AM</td>
          <td>3.2°C</td>
          <td>DK</td>
          <td><span style="color:green">● OK</span></td>
        </tr>
        <tr>
          <td>Monday</td>
          <td>02:00 PM</td>
          <td>3.5°C</td>
          <td>DK</td>
          <td><span style="color:green">● OK</span></td>
        </tr>
        <tr>
          <td>Tuesday</td>
          <td>08:00 AM</td>
          <td>3.1°C</td>
          <td>SJ</td>
          <td><span style="color:green">● OK</span></td>
        </tr>
        <tr>
          <td>Tuesday</td>
          <td>02:00 PM</td>
          <td>4.8°C</td>
          <td>SJ</td>
          <td><span style="color:orange">● Warn</span></td>
        </tr>
      </tbody>
    </table>
  `,
};
