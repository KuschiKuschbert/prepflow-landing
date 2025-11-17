'use client';

import { Icon } from '@/components/ui/Icon';
import {
  formatBrandName,
  formatIngredientName,
  formatStorageLocation,
  formatSupplierName,
  formatTextInput,
} from '@/lib/text-utils';
import { useTranslation } from '@/lib/useTranslation';
import { AlertTriangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  calculateCostPerUnit,
  calculateWastagePercentage,
  checkValidation as checkValidationHelper,
  formatCost,
  getValidationErrors,
} from '../utils/wizard-helpers';
import IngredientWizardNavigation from './IngredientWizardNavigation';
import IngredientWizardStep1 from './IngredientWizardStep1';
import IngredientWizardStep2 from './IngredientWizardStep2';
import IngredientWizardStep3 from './IngredientWizardStep3';
import { Ingredient, IngredientWizardProps } from './types';

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
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Auto-default working unit to pack unit when pack unit changes (if working unit not already set)
      if (field === 'pack_size_unit' && typeof value === 'string' && value && !prev.unit) {
        updated.unit = value;
      }

      return updated;
    });

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

  const handleInputBlur = (field: keyof Ingredient, value: string | number) => {
    // Format text fields on blur
    if (typeof value === 'string' && value.trim()) {
      let formattedValue = value;

      switch (field) {
        case 'ingredient_name':
          formattedValue = formatIngredientName(value);
          break;
        case 'brand':
          formattedValue = formatBrandName(value);
          break;
        case 'supplier':
          formattedValue = formatSupplierName(value);
          break;
        case 'storage_location':
          formattedValue = formatStorageLocation(value);
          break;
        case 'product_code':
          formattedValue = formatTextInput(value);
          break;
        default:
          return; // Don't format other fields
      }

      // Only update if formatting changed the value
      if (formattedValue !== value) {
        setFormData(prev => ({
          ...prev,
          [field]: formattedValue,
        }));
      }
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

      await onSave(capitalizedIngredient);
      resetWizard();
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.details || 'Failed to save ingredient. Please try again.';
      setErrors({ submit: errorMessage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const canProceed = useMemo(() => {
    const step = wizardStep === 3 ? 3 : wizardStep;
    return checkValidationHelper(step, formData);
  }, [wizardStep, formData]);
  const stepProps = {
    formData,
    suppliers,
    availableUnits,
    errors,
    onInputChange: handleInputChange,
    onInputBlur: handleInputBlur,
    onWastagePercentageChange: handleWastagePercentageChange,
    onYieldPercentageChange: handleYieldPercentageChange,
    onAddSupplier,
    formatCost,
  };
  return (
    <div className="mb-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-white">Add New Ingredient</h2>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-200 ${step <= wizardStep ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7]' : 'bg-[#2a2a2a]'}`}
              />
            </div>
          ))}
        </div>
      </div>
      {errors.submit && (
        <div className="mb-3 rounded-lg border border-red-500 bg-red-900/20 px-3 py-2 text-sm text-red-400">
          <div className="flex items-center space-x-2">
            <Icon icon={AlertTriangle} size="md" className="text-red-400" aria-hidden={true} />
            <span>{errors.submit}</span>
          </div>
        </div>
      )}
      {wizardStep === 1 && <IngredientWizardStep1 {...stepProps} />}
      {wizardStep === 2 && <IngredientWizardStep2 {...stepProps} />}
      {wizardStep === 3 && <IngredientWizardStep3 {...stepProps} />}
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
