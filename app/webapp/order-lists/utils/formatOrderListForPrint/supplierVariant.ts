/**
 * Supplier variant formatting for order lists (purchase order format)
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { OrderListData } from './types';
import { formatPackSize, formatPrice, calculateOrderTotals } from './helpers';

/**
 * Format order list as purchase order (supplier variant)
 *
 * @param {OrderListData} data - Order list data with supplier info
 * @returns {string} HTML content for purchase order
 */
export function formatSupplierOrderList(data: OrderListData): string {
  const { menuName, groupedIngredients, supplier, purchaseOrderNumber } = data;
  const groupKeys = Object.keys(groupedIngredients).sort();
  const poNumber =
    purchaseOrderNumber || `PO-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
  const orderDate = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate totals
  const { totalAmount, totalItems } = calculateOrderTotals(groupedIngredients);

  let html = '<div class="order-list-content supplier-variant">';

  // Purchase Order Information Section
  html += `
    <div class="purchase-order-info">
      <div class="purchase-order-info-section">
        <h3>Bill To</h3>
        <p><strong>PrepFlow</strong></p>
        <p>Restaurant Management System</p>
        <p>Order Date: ${orderDate}</p>
        ${purchaseOrderNumber ? `<p><strong>PO Number:</strong> ${escapeHtml(poNumber)}</p>` : ''}
      </div>
      <div class="purchase-order-info-section">
        <h3>Ship To / Supplier</h3>
        ${
          supplier
            ? `
          <p><strong>${escapeHtml(supplier.name)}</strong></p>
          ${supplier.contact_person ? `<p>Contact: ${escapeHtml(supplier.contact_person)}</p>` : ''}
          ${supplier.email ? `<p>Email: ${escapeHtml(supplier.email)}</p>` : ''}
          ${supplier.phone ? `<p>Phone: ${escapeHtml(supplier.phone)}</p>` : ''}
          ${supplier.address ? `<p>${escapeHtml(supplier.address)}</p>` : ''}
          ${supplier.payment_terms ? `<p><strong>Payment Terms:</strong> ${escapeHtml(supplier.payment_terms)}</p>` : ''}
        `
            : `
          <p>Supplier information not provided</p>
        `
        }
      </div>
    </div>
  `;

  // Itemized List
  html += `
    <div class="purchase-order-items">
      <h3 class="purchase-order-items-header">Items Ordered</h3>
      <table class="purchase-order-table">
        <thead>
          <tr>
            <th class="col-item">Item Description</th>
            <th class="col-brand">Brand</th>
            <th class="col-pack">Pack Size</th>
            <th class="col-qty">Qty</th>
            <th class="col-unit-price">Unit Price</th>
            <th class="col-total">Total</th>
          </tr>
        </thead>
        <tbody>
  `;

  let itemNumber = 1;
  groupKeys.forEach(groupKey => {
    const ingredients = groupedIngredients[groupKey];
    ingredients.forEach(ingredient => {
      const unitPrice = ingredient.pack_price || 0;
      const quantity = 1; // Default to 1 pack per item
      const lineTotal = unitPrice * quantity;

      html += `
        <tr>
          <td class="col-item">
            <strong>${escapeHtml(ingredient.ingredient_name)}</strong>
            ${ingredient.category ? `<br><small>Category: ${escapeHtml(ingredient.category)}</small>` : ''}
          </td>
          <td class="col-brand">${escapeHtml(ingredient.brand || '-')}</td>
          <td class="col-pack">${escapeHtml(formatPackSize(ingredient.pack_size, ingredient.pack_size_unit))}</td>
          <td class="col-qty">${quantity}</td>
          <td class="col-unit-price">${formatPrice(unitPrice)}</td>
          <td class="col-total"><strong>${formatPrice(lineTotal)}</strong></td>
        </tr>
      `;
      itemNumber++;
    });
  });

  html += `
        </tbody>
        <tfoot>
          <tr class="purchase-order-totals">
            <td colspan="4" class="totals-label"><strong>Total Items:</strong></td>
            <td class="totals-value"><strong>${totalItems}</strong></td>
            <td class="totals-value"><strong>${formatPrice(totalAmount)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  // Terms and Conditions Section
  html += `
    <div class="purchase-order-terms">
      <h3>Terms & Conditions</h3>
      <ul>
        <li>All prices are in Australian Dollars (AUD)</li>
        <li>Payment terms: ${supplier?.payment_terms || 'Net 30 days'}</li>
        <li>Delivery expected within 7-14 business days</li>
        <li>Please confirm receipt of this order</li>
      </ul>
    </div>
  `;

  html += '</div>';

  return html;
}
