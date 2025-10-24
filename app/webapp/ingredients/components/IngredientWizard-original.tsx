'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
} from '@/lib/text-utils';
import { convertUnit } from '@/lib/unit-conversion';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface Supplier {
  id: string;
  name: string;
  created_at: string;
}

interface IngredientWizardProps {
  suppliers: Supplier[];
  availableUnits: string[];
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
  onCancel: () => void;
  onAddSupplier: (name: string) => Promise<void>;
  loading?: boolean;
}

export default function IngredientWizard({
  suppliers,
  availableUnits,
  onSave,
  onCancel,
  onAddSupplier,
  loading = false,
}: IngredientWizardProps) {
  const { t } = useTranslation();

  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '1',
    pack_size_unit: 'GM',
    pack_price: 0,
    unit: 'GM',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
  });

  const [newSupplier, setNewSupplier] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate cost per unit from pack price and pack size
  const calculateCostPerUnit = (
    packPrice: number,
    packSize: number,
    packSizeUnit: string,
    targetUnit: string,
  ): number => {
    if (packPrice === 0 || packSize === 0) return 0;

    const conversion = convertUnit(1, packSizeUnit, targetUnit);
    const packSizeInTargetUnit = packSize * conversion.conversionFactor;

    return packPrice / packSizeInTargetUnit;
  };

  // Auto-calculate cost per unit when pack price or pack size changes
  const updateCostPerUnit = () => {
    if (formData.pack_price && formData.pack_size && formData.pack_size_unit && formData.unit) {
      const calculatedCost = calculateCostPerUnit(
        formData.pack_price,
        parseFloat(formData.pack_size),
        formData.pack_size_unit,
        formData.unit,
      );
      setFormData(prev => ({
        ...prev,
        cost_per_unit: calculatedCost,
        cost_per_unit_as_purchased: calculatedCost,
        cost_per_unit_incl_trim: calculatedCost,
      }));
    }
  };

  // AI-powered wastage calculation based on ingredient name
  const calculateWastagePercentage = (ingredientName: string): number => {
    const name = ingredientName.toLowerCase();

    // High wastage ingredients (30-50%)
    if (
      name.includes('whole') ||
      name.includes('bone') ||
      name.includes('shell') ||
      name.includes('peel') ||
      name.includes('skin') ||
      name.includes('rind') ||
      name.includes('head') ||
      name.includes('stalk') ||
      name.includes('stem')
    ) {
      return Math.floor(Math.random() * 21) + 30; // 30-50%
    }

    // Medium wastage ingredients (10-25%)
    if (
      name.includes('fresh') ||
      name.includes('raw') ||
      name.includes('uncooked') ||
      name.includes('leafy') ||
      name.includes('herb') ||
      name.includes('lettuce') ||
      name.includes('spinach') ||
      name.includes('kale') ||
      name.includes('cabbage')
    ) {
      return Math.floor(Math.random() * 16) + 10; // 10-25%
    }

    // Low wastage ingredients (0-10%)
    if (
      name.includes('frozen') ||
      name.includes('canned') ||
      name.includes('dried') ||
      name.includes('powder') ||
      name.includes('oil') ||
      name.includes('sauce') ||
      name.includes('paste') ||
      name.includes('concentrate')
    ) {
      return Math.floor(Math.random() * 11); // 0-10%
    }

    // Default moderate wastage (5-15%)
    return Math.floor(Math.random() * 11) + 5; // 5-15%
  };

  // Smart cost formatting - 3 decimals for small amounts (0.xxx), fewer for larger amounts
  const formatCost = (cost: number): string => {
    if (cost < 1) {
      return cost.toFixed(3); // 0.007
    } else if (cost < 10) {
      return cost.toFixed(2); // 1.25
    } else {
      return cost.toFixed(2); // 15.50
    }
  };

  const handleInputChange = (field: keyof Ingredient, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate cost per unit for relevant fields
    if (['pack_price', 'pack_size', 'pack_size_unit', 'unit'].includes(field)) {
      setTimeout(updateCostPerUnit, 100);
    }
  };

  const handleWastagePercentageChange = (wastage: number) => {
    const clampedWastage = Math.max(0, Math.min(100, Math.round(wastage)));
    const yieldPercentage = 100 - clampedWastage;

    setFormData(prev => ({
      ...prev,
      trim_peel_waste_percentage: clampedWastage,
      yield_percentage: yieldPercentage,
    }));
  };

  const handleYieldPercentageChange = (yieldPercent: number) => {
    const clampedYield = Math.max(0, Math.min(100, Math.round(yieldPercent)));
    const wastagePercentage = 100 - clampedYield;

    setFormData(prev => ({
      ...prev,
      yield_percentage: clampedYield,
      trim_peel_waste_percentage: wastagePercentage,
    }));
  };

  const addNewSupplier = async (supplierName: string) => {
    try {
      await onAddSupplier(supplierName);
      setFormData(prev => ({ ...prev, supplier: supplierName }));
      setNewSupplier('');
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.ingredient_name?.trim()) {
        newErrors.ingredient_name = 'Ingredient name is required';
      }
      if (!formData.pack_price || formData.pack_price <= 0) {
        newErrors.pack_price = 'Pack price must be greater than 0';
      }
      if (!formData.pack_size || parseFloat(formData.pack_size) <= 0) {
        newErrors.pack_size = 'Pack size must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(wizardStep)) {
      setWizardStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setWizardStep(prev => Math.max(prev - 1, 1));
  };

  const resetWizard = () => {
    setWizardStep(1);
    setFormData({
      ingredient_name: '',
      brand: '',
      pack_size: '1',
      pack_size_unit: 'GM',
      pack_price: 0,
      unit: 'GM',
      cost_per_unit: 0,
      cost_per_unit_as_purchased: 0,
      cost_per_unit_incl_trim: 0,
      trim_peel_waste_percentage: 0,
      yield_percentage: 100,
      supplier: '',
      product_code: '',
      storage_location: '',
      min_stock_level: 0,
    });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateStep(3)) return;

    try {
      // Capitalize text fields before saving
      const capitalizedIngredient = {
        ...formData,
        ingredient_name: formatIngredientName(formData.ingredient_name || ''),
        brand: formatBrandName(formData.brand || ''),
        supplier: formatSupplierName(formData.supplier || ''),
        storage_location: formatStorageLocation(formData.storage_location || ''),
      };

      await onSave(capitalizedIngredient);
      resetWizard();
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">🥘 Add New Ingredient</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-[#29E7CD]"></div>
          <span className="text-xs text-gray-400">Guided Setup</span>
        </div>
      </div>

      {/* Wizard Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  step <= wizardStep
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white'
                    : 'bg-[#2a2a2a] text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`mx-2 h-1 w-12 transition-all duration-200 ${
                    step < wizardStep
                      ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7]'
                      : 'bg-[#2a2a2a]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="text-sm text-gray-400">
            {wizardStep === 1 && '📦 Basic Information'}
            {wizardStep === 2 && '⚙️ Advanced Settings'}
            {wizardStep === 3 && '✅ Review & Save'}
          </div>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {wizardStep === 1 && (
        <div className="space-y-6">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-white">📦 Basic Information</h3>
            <p className="text-gray-400">Let's start with the essential details</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Ingredient Name *
              </label>
              <input
                type="text"
                required
                value={formData.ingredient_name || ''}
                onChange={e => handleInputChange('ingredient_name', e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., Fresh Tomatoes"
              />
              {errors.ingredient_name && (
                <p className="mt-1 text-sm text-red-400">{errors.ingredient_name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Brand (Optional)
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={e => handleInputChange('brand', e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                placeholder="e.g., Coles, Woolworths"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
              📦 Packaging Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Pack Size *</label>
                <input
                  type="text"
                  required
                  value={formData.pack_size || ''}
                  onChange={e => handleInputChange('pack_size', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="e.g., 5"
                />
                {errors.pack_size && (
                  <p className="mt-1 text-sm text-red-400">{errors.pack_size}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Pack Unit *</label>
                <select
                  value={formData.pack_size_unit || ''}
                  onChange={e => handleInputChange('pack_size_unit', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  <option value="">Select pack unit</option>
                  <option value="GM">Grams (g)</option>
                  <option value="KG">Kilograms (kg)</option>
                  <option value="ML">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="PC">Pieces</option>
                  <option value="BOX">Box</option>
                  <option value="PACK">Pack</option>
                  <option value="BAG">Bag</option>
                  <option value="BOTTLE">Bottle</option>
                  <option value="CAN">Can</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Individual Unit *
                </label>
                <select
                  value={formData.unit || ''}
                  onChange={e => handleInputChange('unit', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  <option value="">Select individual unit</option>
                  <option value="GM">Grams (g)</option>
                  <option value="KG">Kilograms (kg)</option>
                  <option value="ML">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="PC">Pieces</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Pack Price ($) *
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.pack_price || ''}
                  onChange={e => handleInputChange('pack_price', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] py-3 pr-4 pl-8 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="13.54"
                />
              </div>
              {errors.pack_price && (
                <p className="mt-1 text-sm text-red-400">{errors.pack_price}</p>
              )}

              {/* Helper text */}
              <div className="mt-4 rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 p-3">
                <p className="text-sm text-[#29E7CD]">
                  💡 Enter the total pack price (e.g., $13.54 for a 5L tub of yogurt). The system
                  will automatically calculate the price per unit.
                </p>
                {formData.pack_price &&
                  formData.pack_size &&
                  formData.pack_size_unit &&
                  formData.unit && (
                    <p className="mt-2 text-sm font-medium text-[#29E7CD]">
                      ✅ Price per {formData.unit}: ${formatCost(formData.cost_per_unit || 0)}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Step 1 Navigation */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/80"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.ingredient_name || !formData.pack_price || !formData.pack_size}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Advanced Settings */}
      {wizardStep === 2 && (
        <div className="space-y-6">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-white">⚙️ Advanced Settings</h3>
            <p className="text-gray-400">Configure wastage, yield, and supplier information</p>
          </div>

          {/* Wastage and Yield */}
          <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
              🎯 Wastage & Yield Management
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Trim/Waste Percentage
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.trim_peel_waste_percentage || 0}
                    onChange={e => handleWastagePercentageChange(parseInt(e.target.value) || 0)}
                    className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  />
                  <span className="text-gray-400">%</span>
                </div>
                {formData.ingredient_name && (
                  <p className="mt-1 text-xs text-gray-400">
                    💡 AI suggests: {calculateWastagePercentage(formData.ingredient_name)}% based on
                    "{formData.ingredient_name}"
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Yield Percentage
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.yield_percentage || 100}
                    onChange={e => handleYieldPercentageChange(parseInt(e.target.value) || 100)}
                    className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
              🏪 Supplier Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Supplier</label>
                <select
                  value={formData.supplier || ''}
                  onChange={e => handleInputChange('supplier', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                  <option value="custom">+ Add new supplier</option>
                </select>

                {formData.supplier === 'custom' && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newSupplier}
                      onChange={e => setNewSupplier(e.target.value)}
                      className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                      placeholder="Enter new supplier name"
                    />
                    <button
                      type="button"
                      onClick={() => addNewSupplier(newSupplier)}
                      disabled={!newSupplier.trim()}
                      className="rounded-2xl bg-[#29E7CD]/10 px-4 py-3 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Storage Location
                </label>
                <input
                  type="text"
                  value={formData.storage_location || ''}
                  onChange={e => handleInputChange('storage_location', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="e.g., Cold Room A, Dry Storage"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
              📋 Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Product Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.product_code || ''}
                  onChange={e => handleInputChange('product_code', e.target.value)}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="e.g., SKU123456"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Min Stock Level
                </label>
                <input
                  type="number"
                  value={formData.min_stock_level || 0}
                  onChange={e =>
                    handleInputChange('min_stock_level', parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Step 2 Navigation */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/80"
            >
              ← Previous Step
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Save */}
      {wizardStep === 3 && (
        <div className="space-y-6">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-white">✅ Review & Save</h3>
            <p className="text-gray-400">Review your ingredient details before saving</p>
          </div>

          {/* Review Summary */}
          <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
              📋 Ingredient Summary
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Ingredient Name:</span>
                  <div className="font-medium text-white">{formData.ingredient_name}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Brand:</span>
                  <div className="font-medium text-white">{formData.brand || 'Not specified'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Pack Size:</span>
                  <div className="font-medium text-white">
                    {formData.pack_size} {formData.pack_size_unit}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Pack Price:</span>
                  <div className="font-medium text-white">${formData.pack_price}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Individual Unit:</span>
                  <div className="font-medium text-white">{formData.unit}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Price per {formData.unit}:</span>
                  <div className="font-medium text-white">
                    ${formatCost(formData.cost_per_unit || 0)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Wastage:</span>
                  <div className="font-medium text-white">
                    {formData.trim_peel_waste_percentage}%
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Yield:</span>
                  <div className="font-medium text-white">{formData.yield_percentage}%</div>
                </div>
              </div>
            </div>

            {(formData.supplier || formData.storage_location || formData.product_code) && (
              <div className="mt-6 border-t border-[#2a2a2a] pt-6">
                <h4 className="text-md mb-3 font-semibold text-white">Additional Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {formData.supplier && (
                    <div>
                      <span className="text-sm text-gray-400">Supplier:</span>
                      <div className="font-medium text-white">{formData.supplier}</div>
                    </div>
                  )}
                  {formData.storage_location && (
                    <div>
                      <span className="text-sm text-gray-400">Storage Location:</span>
                      <div className="font-medium text-white">{formData.storage_location}</div>
                    </div>
                  )}
                  {formData.product_code && (
                    <div>
                      <span className="text-sm text-gray-400">Product Code:</span>
                      <div className="font-medium text-white">{formData.product_code}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 3 Navigation */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/80"
            >
              ← Previous Step
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={resetWizard}
                className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/80"
              >
                Start Over
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Saving...' : '✅ Save Ingredient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
