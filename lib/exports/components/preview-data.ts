import { type TemplateVariant } from '../print-template';

export interface PreviewData {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
}

export function getPreviewData(variant: TemplateVariant): PreviewData {
  switch (variant) {
    case 'menu':
      return {
        title: 'Spring Tasting Menu',
        subtitle: 'Seasonal Selections',
        customMeta: 'Valid until: June 30, 2024',
        content: `
          <div class="menu-section">
            <h3 class="menu-heading">Starters</h3>
            <div class="menu-item">
              <div class="menu-item-header">
                <span class="menu-item-name">Tuna Tartare</span>
                <span class="menu-item-price">$18</span>
              </div>
              <p class="menu-item-desc">Yellowfin tuna, avocado mousse, sesame crisp, citrus ponzu.</p>
            </div>
            <div class="menu-item">
              <div class="menu-item-header">
                <span class="menu-item-name">Burrata & Heirloom</span>
                <span class="menu-item-price">$22</span>
              </div>
              <p class="menu-item-desc">Local burrata, heirloom tomatoes, basil pesto, balsamic glaze.</p>
            </div>
          </div>

          <div class="menu-section">
            <h3 class="menu-heading">Mains</h3>
            <div class="menu-item">
              <div class="menu-item-header">
                <span class="menu-item-name">Pan-Seared Scallops</span>
                <span class="menu-item-price">$34</span>
              </div>
              <p class="menu-item-desc">Cauliflower purée, crispy pancetta, sage brown butter.</p>
            </div>
            <div class="menu-item">
              <div class="menu-item-header">
                <span class="menu-item-name">Wagyu Beef Burger</span>
                <span class="menu-item-price">$28</span>
              </div>
              <p class="menu-item-desc">Brioche bun, truffle mayo, aged cheddar, caramelized onions, fries.</p>
            </div>
          </div>
        `,
      };

    case 'recipe':
      return {
        title: 'Spicy Tuna Crispy Rice',
        subtitle: 'Appetizers / Seafood',
        customMeta: 'Yield: 4 Servings • Prep: 20m',
        content: `
           <div class="recipe-grid">
             <div class="recipe-section">
               <h3>Ingredients</h3>
               <ul>
                 <li>2 cups Sushi Rice (Cooked)</li>
                 <li>300g Fresh Tuna (Minced)</li>
                 <li>2 tbsp Spicy Mayo</li>
                 <li>1 tsp Sesame Oil</li>
                 <li>1 Jalapeño (Sliced)</li>
                 <li>2 tbsp Soy Sauce</li>
               </ul>
             </div>
             <div class="recipe-section">
               <h3>Method</h3>
               <ol>
                 <li>Press cooked sushi rice into a square mold and refrigerate for 2 hours.</li>
                 <li>Slice rice block into rectangles.</li>
                 <li>Deep fry rice cakes until golden brown and crispy.</li>
                 <li>Mix minced tuna with spicy mayo and sesame oil.</li>
                 <li>Top crispy rice with tuna mixture and a slice of jalapeño.</li>
               </ol>
             </div>
           </div>
           <div class="recipe-notes">
             <strong>Chef's Note:</strong> Ensure oil is at 375°F for optimal crispiness without absorbing too much oil.
           </div>
        `,
      };

    case 'kitchen':
      return {
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

    case 'supplier':
      return {
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

    case 'runsheet':
      return {
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

    case 'compliance':
      return {
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

    default: // default variant (Purchase Orders / Standard Lists)
      return {
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
  }
}
