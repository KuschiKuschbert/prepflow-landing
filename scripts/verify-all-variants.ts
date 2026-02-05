/**
 * Verification script for all modernized export variants
 * Generates HTML for:
 * 1. Menu Density (Spacious, Compact, Ultra-Compact)
 * 2. Recipe Card Density (Standard, Compact)
 * 3. Prep List (Kitchen Variant)
 * 4. Order List (Supplier Variant)
 * 5. Compliance Report
 * 6. Allergen Matrix
 */

import fs from 'fs';
import path from 'path';
import { getAllTemplateStyles } from '../lib/exports/template-styles/index';

const OUT_DIR = path.join(process.cwd(), 'out-debug');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

// 1. Menu Density
const menuStyles = getAllTemplateStyles('menu');
const generateMenuHTML = (density: string) => `
<!DOCTYPE html>
<html>
<head><style>${menuStyles}</style></head>
<body>
  <div class="content-wrapper">
    <div class="header">
      <div class="header-content">
        <h1>Menu Density Test: ${density}</h1>
      </div>
    </div>
    <div class="menu-display density-${density}">
      <div class="menu-category">
        <div class="menu-category-header"><h2>Starters</h2></div>
        <div class="menu-items-grid">
          ${Array.from({ length: 5 })
            .map(
              (_, i) => `
            <div class="menu-item">
              <div class="menu-item-header">
                <span class="menu-item-name">Dish ${i + 1}</span>
                <span class="menu-item-price">$12.00</span>
              </div>
              <p class="menu-item-description">Description for dish ${i + 1} with some details.</p>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 2. Recipe Card Density
const recipeStyles = getAllTemplateStyles('recipe');
const generateRecipeHTML = (density: string) => `
<!DOCTYPE html>
<html>
<head><style>${recipeStyles}</style></head>
<body>
  <div class="content-wrapper">
    <div class="recipe-card ${density === 'compact' ? 'density-compact' : ''}">
      <div class="recipe-card-header">
        <h3 class="recipe-card-title">Test Recipe (${density})</h3>
        <div class="recipe-card-yield">Yield: 4 servings</div>
      </div>
      <div class="recipe-card-section">
        <h4 class="recipe-card-section-title">Ingredients</h4>
        <ul class="recipe-card-ingredients">
          ${Array.from({ length: density === 'compact' ? 15 : 5 })
            .map(
              (_, i) => `
            <li>Ingredient ${i + 1}: ${i * 10}g</li>
          `,
            )
            .join('')}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 3. Prep List (Kitchen)
const kitchenStyles = getAllTemplateStyles('kitchen');
const kitchenHTML = `
<!DOCTYPE html>
<html>
<head><style>${kitchenStyles}</style></head>
<body class="variant-kitchen">
  <div class="content-wrapper">
    <div class="prep-list-header">
      <h1>Daily Prep List</h1>
      <div class="prep-list-meta"><span>Station: Grill</span></div>
    </div>
    <div class="prep-list-section">
      <h2>Mise en Place</h2>
      <div class="kitchen-ingredient-item">
        <span class="kitchen-checkbox"></span>
        <span class="kitchen-ingredient-name">Chopped Onions</span>
        <span class="kitchen-ingredient-quantity">2kg</span>
      </div>
      <div class="kitchen-ingredient-item">
        <span class="kitchen-checkbox"></span>
        <span class="kitchen-ingredient-name">Marinated Chicken</span>
        <span class="kitchen-ingredient-quantity">5kg</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 4. Order List (Supplier)
const supplierStyles = getAllTemplateStyles('supplier');
const supplierHTML = `
<!DOCTYPE html>
<html>
<head><style>${supplierStyles}</style></head>
<body class="variant-supplier">
  <div class="content-wrapper">
    <div class="header"><div class="header-content"><h1>Purchase Order</h1></div></div>
    <div class="purchase-order-info">
      <div class="purchase-order-info-section">
        <h3>Supplier</h3>
        <p><strong>Fresh Foods Co.</strong></p>
      </div>
    </div>
    <table class="purchase-order-table">
      <thead>
        <tr><th class="col-item">Item</th><th class="col-qty">Qty</th><th class="col-unit-price">Price</th><th class="col-total">Total</th></tr>
      </thead>
      <tbody>
        <tr><td>Tomatoes</td><td class="col-qty">10kg</td><td class="col-unit-price">$2.00</td><td class="col-total">$20.00</td></tr>
      </tbody>
      <tfoot>
        <tr><td colspan="3" class="totals-label">Total</td><td class="totals-value">$20.00</td></tr>
      </tfoot>
    </table>
  </div>
</body>
</html>
`;

// 5. Compliance
const complianceStyles = getAllTemplateStyles('compliance');
const complianceHTML = `
<!DOCTYPE html>
<html>
<head><style>${complianceStyles}</style></head>
<body>
  <div class="content-wrapper">
    <h1>Allergen Overview</h1>
    <div class="table-container">
      <table>
        <thead><tr><th>Item</th><th>Allergens</th></tr></thead>
        <tbody>
          <tr><td class="item-name">Peanut Sauce</td><td class="allergens-list">Peanuts, Soy</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
`;

// 6. Matrix
const matrixStyles = getAllTemplateStyles('matrix');
const matrixHTML = `
<!DOCTYPE html>
<html>
<head><style>${matrixStyles}</style></head>
<body>
  <div class="content-wrapper">
    <h1>Allergen Matrix</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="allergen-header">Peanuts</th>
            <th class="allergen-header">Dairy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="item-name">Satay Chicken</td>
            <td class="has-allergen">X</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
`;

// Write files
fs.writeFileSync(path.join(OUT_DIR, 'verify-menu-compact.html'), generateMenuHTML('compact'));
fs.writeFileSync(
  path.join(OUT_DIR, 'verify-menu-ultra-compact.html'),
  generateMenuHTML('ultra-compact'),
);
fs.writeFileSync(path.join(OUT_DIR, 'verify-recipe-compact.html'), generateRecipeHTML('compact'));
fs.writeFileSync(path.join(OUT_DIR, 'verify-kitchen.html'), kitchenHTML);
fs.writeFileSync(path.join(OUT_DIR, 'verify-supplier.html'), supplierHTML);
fs.writeFileSync(path.join(OUT_DIR, 'verify-compliance.html'), complianceHTML);
fs.writeFileSync(path.join(OUT_DIR, 'verify-matrix.html'), matrixHTML);

console.log('Verification files generated in out-debug/');
