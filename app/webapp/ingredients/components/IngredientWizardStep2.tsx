'use client';

import { useState } from 'react';
import { WizardStepProps } from './types';

export default function IngredientWizardStep2({
  formData,
  suppliers,
  errors,
  onInputChange,
  onWastagePercentageChange,
  onYieldPercentageChange,
  onAddSupplier,
}: WizardStepProps) {
  const [newSupplier, setNewSupplier] = useState('');
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  const addNewSupplier = async (supplierName: string) => {
    if (!supplierName.trim() || !onAddSupplier) return;

    try {
      await onAddSupplier(supplierName);
      setNewSupplier('');
      setShowAddSupplier(false);
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">⚙️ Advanced Settings</h3>
        <p className="text-gray-400">Configure supplier, storage, and yield information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
            🏢 Supplier Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Supplier</label>
              <div className="flex space-x-2">
                <select
                  value={formData.supplier || ''}
                  onChange={e => onInputChange('supplier', e.target.value)}
                  className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  <option value="">Select supplier</option>
                  {suppliers?.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(true)}
                  className="rounded-2xl bg-[#29E7CD] px-4 py-3 font-medium text-black transition-all hover:bg-[#29E7CD]/80"
                >
                  ➕
                </button>
              </div>
            </div>

            {showAddSupplier && (
              <div className="rounded-xl border border-[#29E7CD]/30 bg-[#1f1f1f] p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={e => setNewSupplier(e.target.value)}
                    placeholder="New supplier name"
                    className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addNewSupplier(newSupplier)}
                    className="rounded-lg bg-[#29E7CD] px-3 py-2 font-medium text-black transition-all hover:bg-[#29E7CD]/80"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSupplier(false);
                      setNewSupplier('');
                    }}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-white transition-all hover:bg-[#3a3a3a]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Product Code (Optional)
              </label>
              <input
                type="text"
                value={formData.product_code || ''}
                onChange={e => onInputChange('product_code', e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., SKU123456"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
            📦 Storage & Stock
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Storage Location
              </label>
              <input
                type="text"
                value={formData.storage_location || ''}
                onChange={e => onInputChange('storage_location', e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., Walk-in Cooler, Pantry"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Min Stock Level
              </label>
              <input
                type="number"
                value={formData.min_stock_level || ''}
                onChange={e => onInputChange('min_stock_level', parseFloat(e.target.value) || 0)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Current Stock</label>
              <input
                type="number"
                value={formData.current_stock || ''}
                onChange={e => onInputChange('current_stock', parseFloat(e.target.value) || 0)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., 25"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
          🎯 Yield & Wastage
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Wastage Percentage
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.trim_peel_waste_percentage || 0}
                onChange={e => onWastagePercentageChange?.(parseInt(e.target.value))}
                className="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
              />
              <div className="w-20 text-center">
                <div className="text-2xl font-bold text-[#29E7CD]">
                  {formData.trim_peel_waste_percentage || 0}%
                </div>
                <div className="text-xs text-gray-400">Waste</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              How much gets thrown away during prep (peels, trimmings, etc.)
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Yield Percentage</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.yield_percentage || 100}
                onChange={e => onYieldPercentageChange?.(parseInt(e.target.value))}
                className="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#2a2a2a]"
              />
              <div className="w-20 text-center">
                <div className="text-2xl font-bold text-[#29E7CD]">
                  {formData.yield_percentage || 100}%
                </div>
                <div className="text-xs text-gray-400">Yield</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              How much you get after prep (usable portion)
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#29E7CD]/20 bg-[#1f1f1f] p-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-[#29E7CD]">💡</span>
            <span className="text-gray-300">
              <strong>Tip:</strong> These percentages are linked - adjusting one automatically
              adjusts the other. For example, if you waste 20%, you get 80% yield.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
