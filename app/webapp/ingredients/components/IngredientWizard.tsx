'use client';

import { formatIngredientName } from '@/lib/text-utils';
import { useTranslation } from '@/lib/useTranslation';
import { useState, useMemo } from 'react';
import IngredientWizardNavigation from './IngredientWizardNavigation';
import IngredientWizardStep1 from './IngredientWizardStep1';
import IngredientWizardStep2 from './IngredientWizardStep2';
import IngredientWizardStep3 from './IngredientWizardStep3';
import { Ingredient, IngredientWizardProps } from './types';
import {
  calculateCostPerUnit,
  calculateWastagePercentage,
  formatCost,
  checkValidation as checkValidationHelper,
  getValidationErrors,
} from '../utils/wizard-helpers';

export default function IngredientWizard({
  suppliers = [],
  availableUnits = [],
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
    pack_size: '',
    pack_size_unit: '',
    pack_price: 0,
    unit: '',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
    current_stock: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        cost_per_unit_incl_trim: calculatedCost / ((prev.yield_percentage || 100) / 100),
      }));
    }
  };

  const handleInputChange = (field: keyof Ingredient, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Auto-calculate cost when relevant fields change
    if (['pack_price', 'pack_size', 'pack_size_unit', 'unit'].includes(field)) {
      setTimeout(updateCostPerUnit, 100);
    }

    // Auto-suggest wastage percentage when ingredient name changes
    if (field === 'ingredient_name' && typeof value === 'string' && value.length > 3) {
      const suggestedWastage = calculateWastagePercentage(value);
      setFormData(prev => ({
        ...prev,
        trim_peel_waste_percentage: suggestedWastage,
        yield_percentage: 100 - suggestedWastage,
        cost_per_unit_incl_trim: (prev.cost_per_unit || 0) / ((100 - suggestedWastage) / 100),
      }));
    }
  };

  const handleWastagePercentageChange = (wastage: number) => {
    const clampedWastage = Math.max(0, Math.min(100, Math.round(wastage)));
    const yieldPercentage = 100 - clampedWastage;

    setFormData(prev => ({
      ...prev,
      trim_peel_waste_percentage: clampedWastage,
      yield_percentage: yieldPercentage,
      cost_per_unit_incl_trim: (prev.cost_per_unit || 0) / (yieldPercentage / 100),
    }));
  };

  const handleYieldPercentageChange = (yieldPercent: number) => {
    const clampedYield = Math.max(0, Math.min(100, Math.round(yieldPercent)));
    const wastagePercentage = 100 - clampedYield;

    setFormData(prev => ({
      ...prev,
      yield_percentage: clampedYield,
      trim_peel_waste_percentage: wastagePercentage,
      cost_per_unit_incl_trim: (prev.cost_per_unit || 0) / (clampedYield / 100),
    }));
  };

  // Validation function that sets errors (only call on button clicks)
  const validateStep = (step: number): boolean => {
    const newErrors = getValidationErrors(step, formData);
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
      pack_size: '',
      pack_size_unit: '',
      pack_price: 0,
      unit: '',
      cost_per_unit: 0,
      cost_per_unit_as_purchased: 0,
      cost_per_unit_incl_trim: 0,
      trim_peel_waste_percentage: 0,
      yield_percentage: 100,
      supplier: '',
      product_code: '',
      storage_location: '',
      min_stock_level: 0,
      current_stock: 0,
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
        brand: formData.brand ? formatIngredientName(formData.brand) : undefined,
        supplier: formData.supplier ? formatIngredientName(formData.supplier) : undefined,
        storage_location: formData.storage_location
          ? formatIngredientName(formData.storage_location)
          : undefined,
      };

      console.log('Wizard saving ingredient:', capitalizedIngredient);
      await onSave(capitalizedIngredient);
      resetWizard();
    } catch (error: any) {
      console.error('Error saving ingredient in wizard:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        formData,
      });

      // Set error state to show user-friendly message
      const errorMessage =
        error?.message || error?.details || 'Failed to save ingredient. Please try again.';
      setErrors({ submit: errorMessage });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Use useMemo to calculate canProceed without side effects
  const canProceed = useMemo(() => {
    const step = wizardStep === 3 ? 3 : wizardStep;
    return checkValidationHelper(step, formData);
  }, [
    wizardStep,
    formData.ingredient_name,
    formData.pack_size,
    formData.pack_size_unit,
    formData.pack_price,
    formData.unit,
  ]);

  const stepProps = {
    formData,
    suppliers,
    availableUnits,
    errors,
    onInputChange: handleInputChange,
    onWastagePercentageChange: handleWastagePercentageChange,
    onYieldPercentageChange: handleYieldPercentageChange,
    onAddSupplier,
    formatCost,
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

      {/* Error Display */}
      {errors.submit && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-red-400">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚠️</span>
            <span>{errors.submit}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      {wizardStep === 1 && <IngredientWizardStep1 {...stepProps} />}
      {wizardStep === 2 && <IngredientWizardStep2 {...stepProps} />}
      {wizardStep === 3 && <IngredientWizardStep3 {...stepProps} />}

      {/* Navigation */}
      <IngredientWizardNavigation
        currentStep={wizardStep}
        totalSteps={3}
        onNext={nextStep}
        onPrevious={prevStep}
        onSave={handleSave}
        onCancel={onCancel}
        canProceed={canProceed}
        loading={loading}
      />
    </div>
  );
}
