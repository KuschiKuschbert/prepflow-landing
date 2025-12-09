'use client';

import { useState } from 'react';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { PrintButton } from '@/components/ui/PrintButton';
import { printOrderList, exportOrderListToCSV } from '../utils/orderListExportUtils';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { OrderListData } from '../utils/formatOrderListForPrint';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}

interface MenuIngredientsTableProps {
  menuName: string;
  groupedIngredients: Record<string, Ingredient[]>;
  sortBy: string;
}

export function MenuIngredientsTable({
  menuName,
  groupedIngredients,
  sortBy,
}: MenuIngredientsTableProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);

  const orderListData: OrderListData = {
    menuName,
    groupedIngredients,
    sortBy,
  };

  const handlePrint = () => {
    try {
      printOrderList(orderListData);
      showSuccess('Order list opened for printing');
    } catch (err) {
      logger.error('[Order List] Print error:', err);
      showError('Failed to print order list. Please try again.');
    }
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      setExportLoading(format);

      if (format === 'csv') {
        exportOrderListToCSV(orderListData);
        showSuccess('Order list exported as CSV');
      } else if (format === 'pdf') {
        // PDF is handled via print dialog
        printOrderList(orderListData);
        showSuccess(
          "Order list opened for printing. Use your browser's print dialog to save as PDF.",
        );
      } else if (format === 'html') {
        // HTML export - generate and download
        const { generatePrintTemplate } = await import('@/lib/exports/print-template');
        const { formatOrderListForPrint } = await import('../utils/formatOrderListForPrint');
        const { getOrderListPrintStyles } = await import('../utils/orderListPrintStyles');

        const contentHtml = formatOrderListForPrint(orderListData);
        const orderListStyles = getOrderListPrintStyles();
        const totalItems = Object.values(groupedIngredients).reduce(
          (sum, ingredients) => sum + ingredients.length,
          0,
        );

        const html = generatePrintTemplate({
          title: 'Order List',
          subtitle: menuName,
          content: `<style>${orderListStyles}</style>${contentHtml}`,
          totalItems,
          customMeta: `Sorted by: ${sortBy}`,
        });

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order_list_${menuName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showSuccess('Order list exported as HTML');
      }
    } catch (err) {
      logger.error('[Order List] Export error:', err);
      showError('Failed to export order list. Please try again.');
    } finally {
      setExportLoading(null);
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(price);
  };

  const formatPackSize = (packSize?: string, packSizeUnit?: string) => {
    if (!packSize) return '-';
    const unit = packSizeUnit || '';
    return unit ? `${packSize} ${unit}` : packSize;
  };

  const formatParLevel = (parLevel?: number, unit?: string) => {
    if (parLevel === undefined || parLevel === null) return '-';
    return `${parLevel}${unit ? ` ${unit}` : ''}`;
  };

  const groupKeys = Object.keys(groupedIngredients).sort();

  return (
    <div className="order-list-print">
      {/* Header with export buttons */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between mb-6 flex flex-col gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white">{menuName}</h2>
          <p className="text-gray-400">
            Order List -{' '}
            {new Date().toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <PrintButton onClick={handlePrint} label="Print" />
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
            availableFormats={['csv', 'pdf', 'html']}
            label="Export"
          />
        </div>
      </div>

      {/* Header - visible in print */}
      <div className="mb-6 hidden print:mb-4 print:block">
        <h2 className="text-2xl font-bold text-white print:text-xl print:text-black">{menuName}</h2>
        <p className="text-gray-400 print:text-sm print:text-gray-600">
          Order List -{' '}
          {new Date().toLocaleDateString('en-AU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Table */}
      {groupKeys.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400">No ingredients found for this menu.</p>
        </div>
      ) : (
        <div className="space-y-8 print:space-y-6">
          {groupKeys.map(groupKey => (
            <div key={groupKey} className="print:break-inside-avoid">
              {/* Group Header */}
              <h3 className="mb-4 text-lg font-semibold text-white print:mb-2 print:border-b print:border-gray-300 print:pb-1 print:text-base print:text-black">
                {groupKey}
              </h3>

              {/* Table */}
              <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] print:rounded-none print:border print:border-gray-300 print:bg-white">
                <table className="min-w-full divide-y divide-[#2a2a2a] print:divide-gray-300">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 print:bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Pack Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Price Per Pack
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Par Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f] print:divide-gray-300 print:bg-white">
                    {groupedIngredients[groupKey].map(ingredient => (
                      <tr
                        key={ingredient.id}
                        className="transition-colors hover:bg-[#2a2a2a]/20 print:hover:bg-transparent"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white print:px-4 print:py-2 print:text-black">
                          {ingredient.ingredient_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {ingredient.brand || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatPackSize(ingredient.pack_size, ingredient.pack_size_unit)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatPrice(ingredient.pack_price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatParLevel(ingredient.par_level, ingredient.par_unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
