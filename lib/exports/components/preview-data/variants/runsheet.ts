import type { PreviewData } from '../types';

export const runsheetPreview: PreviewData = {
  title: 'Corporate Lunch — Day 1',
  subtitle: 'Friday, March 15th 2024',
  totalItems: 5,
  content: `
    <div class="runsheet-event-info">
      <div class="runsheet-event-info-grid">
        <div class="runsheet-event-info-section">
          <div class="runsheet-event-info-section-title">Event Details</div>
          <p><strong>Type:</strong> Corporate Catering · <strong>Attendees:</strong> 120 PAX</p>
          <p><strong>When:</strong> Fri, Mar 15th 2024, 11:30 — 14:00</p>
          <p><strong>Location:</strong> Boardroom West, Level 3</p>
        </div>
        <div class="runsheet-event-info-section">
          <div class="runsheet-event-info-section-title">Client &amp; Contact</div>
          <p><strong>Client:</strong> Acme Corp (Events Team)</p>
          <p><strong>Contact:</strong> 0412 555 789 · events@acme.com.au</p>
        </div>
        <div class="runsheet-event-info-notes runsheet-event-info-section">
          <div class="runsheet-event-info-section-title">Notes</div>
          <p>Dietary: 4 vegetarian, 2 gluten-free. Buffet style. Pack down by 15:00.</p>
        </div>
      </div>
    </div>
    <table class="runsheet-table">
      <thead>
        <tr>
          <th style="width:80px;">Time</th>
          <th>Description</th>
          <th style="width:100px;text-align:center;">Type</th>
        </tr>
      </thead>
      <tbody>
        <tr class="runsheet-row-setup">
          <td class="runsheet-time">10:00</td>
          <td><div>Setup buffet station</div></td>
          <td class="runsheet-type"><span class="runsheet-type-badge setup">Setup</span></td>
        </tr>
        <tr class="runsheet-row-activity">
          <td class="runsheet-time">10:30</td>
          <td><div>Brief staff</div></td>
          <td class="runsheet-type"><span class="runsheet-type-badge activity">Activity</span></td>
        </tr>
        <tr class="runsheet-row-meal">
          <td class="runsheet-time">11:30</td>
          <td><div>Lunch service begins</div><div class="runsheet-linked">Menu: Corporate Lunch</div></td>
          <td class="runsheet-type"><span class="runsheet-type-badge meal">Meal Service</span></td>
        </tr>
        <tr class="runsheet-row-other">
          <td class="runsheet-time">14:00</td>
          <td><div>Pack down and clean</div></td>
          <td class="runsheet-type"><span class="runsheet-type-badge other">Other</span></td>
        </tr>
      </tbody>
    </table>
  `,
};
