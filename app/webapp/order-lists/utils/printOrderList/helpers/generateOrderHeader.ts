/**
 * Generate order list header HTML.
 */
import type { OrderList } from '../../printOrderList';

export function getStatusColor(status: string): string {
  switch (status) {
    case 'sent':
      return '#29E7CD';
    case 'received':
      return '#10B981';
    case 'cancelled':
      return '#D925C7';
    case 'draft':
    default:
      return '#FF6B00';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'sent':
      return 'Sent';
    case 'received':
      return 'Received';
    case 'cancelled':
      return 'Cancelled';
    case 'draft':
    default:
      return 'Draft';
  }
}

export function generateOrderHeader(orderList: OrderList): string {
  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
        ${orderList.name}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Supplier</div>
          <div style="font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">${orderList.suppliers.name}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Status</div>
          <div style="font-size: 18px; font-weight: 600; color: ${getStatusColor(orderList.status)};">
            ${getStatusLabel(orderList.status)}
          </div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Created</div>
          <div style="font-size: 16px; font-weight: 500; color: rgba(255, 255, 255, 0.8);">
            ${new Date(orderList.created_at).toLocaleDateString('en-AU')}
          </div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Items</div>
          <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${orderList.order_list_items.length}</div>
        </div>
      </div>
      ${
        orderList.notes
          ? `
        <div style="margin-top: 16px; padding: 12px; background: rgba(42, 42, 42, 0.5); border-radius: 8px; border-left: 3px solid rgba(41, 231, 205, 0.5);">
          <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8); white-space: pre-wrap;">${orderList.notes}</div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
