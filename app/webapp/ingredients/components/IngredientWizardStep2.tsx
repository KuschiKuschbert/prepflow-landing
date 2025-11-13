'use client';

import { StorageCombobox } from './StorageCombobox';
import { SupplierCombobox } from './SupplierCombobox';
import { WizardStepProps } from './types';

export default function IngredientWizardStep2({
  formData,
  suppliers,
  errors,
  onInputChange,
  onInputBlur,
  onWastagePercentageChange,
  onYieldPercentageChange,
  onAddSupplier,
}: WizardStepProps) {
  const handleAddNewSupplier = async (supplierName: string) => {
    if (!supplierName.trim() || !onAddSupplier) return;
    const { formatSupplierName } = await import('@/lib/text-utils');
    const formattedName = formatSupplierName(supplierName);
    await onAddSupplier(formattedName);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Supplier */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Supplier</label>
        <SupplierCombobox
          value={formData.supplier || ''}
          onChange={value => onInputChange('supplier', value)}
          placeholder="Search suppliers..."
          onAddNew={onAddSupplier ? handleAddNewSupplier : undefined}
        />
      </div>

      {/* Product Code */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Product Code (Optional)
        </label>
        <input
          type="text"
          value={formData.product_code || ''}
          onChange={e => onInputChange('product_code', e.target.value)}
          onBlur={e => onInputBlur?.('product_code', e.target.value)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          placeholder="e.g., SKU123456"
        />
      </div>

      {/* Storage Location */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Storage Location
        </label>
        <StorageCombobox
          value={formData.storage_location || ''}
          onChange={value => onInputChange('storage_location', value)}
          placeholder="Search equipment..."
        />
      </div>

      {/* Yield Percentage */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Yield %</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="100"
            value={formData.yield_percentage || 100}
            onChange={e => onYieldPercentageChange?.(parseInt(e.target.value))}
            className="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
          />
          <div className="w-16 text-center">
            <div className="text-lg font-bold text-[#29E7CD]">
              {String(formData.yield_percentage ?? 100)}%
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Waste: {100 - (formData.yield_percentage || 100)}%
        </p>
      </div>
    </div>
  );
}
