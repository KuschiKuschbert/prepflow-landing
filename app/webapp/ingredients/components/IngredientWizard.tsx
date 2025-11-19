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
import { useEffect, useMemo, useRef, useState } from 'react';
import { logger } from '@/lib/logger';
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
import IngredientWizardStep4 from './IngredientWizardStep4';
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
  const totalSteps = 4;
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
    allergens: [],
    allergen_source: { manual: false, ai: false },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detectingAllergens, setDetectingAllergens] = useState(false);
  const lastDetectedRef = useRef<{ ingredientName: string; brand?: string } | null>(null);
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

  const handleInputChange = (field: keyof Ingredient, value: string | number | string[] | Record<string, any>) => {
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
      setWizardStep(prev => Math.min(prev + 1, totalSteps));
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
      allergens: [],
      allergen_source: { manual: false, ai: false },
    });
    setErrors({});
    lastDetectedRef.current = null;
    setDetectingAllergens(false);
  };
  const handleSave = async () => {
    // Validate step 1 (required fields) before saving
    if (!validateStep(1)) return;

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
  const skipStep2 = () => {
    setWizardStep(3); // Skip to allergens step (now step 3)
  };

  // Detect allergens when entering step 3 (allergen step)
  useEffect(() => {
    const detectAllergens = async () => {
      // Only detect if we're on step 3, have ingredient name, and no manual allergens set
      if (wizardStep !== 3) return;

      const ingredientName = formData.ingredient_name?.trim();
      if (!ingredientName || ingredientName.length < 2) return;

      // Don't detect if user has already manually set allergens
      const currentAllergens = (formData.allergens as string[]) || [];
      const allergenSource = (formData.allergen_source as {
        manual?: boolean;
        ai?: boolean;
      }) || { manual: false, ai: false };

      if (allergenSource.manual && currentAllergens.length > 0) {
        logger.dev('[Wizard] Skipping allergen detection - manual allergens already set');
        return;
      }

      // Only detect if we haven't detected before for this ingredient name/brand combination
      const brand = formData.brand?.trim() || '';
      if (
        lastDetectedRef.current &&
        lastDetectedRef.current.ingredientName === ingredientName &&
        lastDetectedRef.current.brand === brand &&
        currentAllergens.length > 0
      ) {
        logger.dev('[Wizard] Skipping allergen detection - already detected for this ingredient');
        return;
      }

      setDetectingAllergens(true);

      try {
        const response = await fetch('/api/ingredients/ai-detect-allergens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredient_name: ingredientName,
            brand: formData.brand?.trim() || undefined,
            force_ai: false,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to detect allergens');
        }

        const result = await response.json();

        if (result.success && result.data?.allergens) {
          const detectedAllergens = result.data.allergens as string[];
          logger.dev(
            `[Wizard] Detected ${detectedAllergens.length} allergens for ${ingredientName}: ${detectedAllergens.join(', ')}`,
          );

          // Only update if we got allergens and they're different from current
          if (detectedAllergens.length > 0) {
            setFormData(prev => ({
              ...prev,
              allergens: detectedAllergens,
              allergen_source: {
                manual: false,
                ai: result.data.method === 'ai' || result.data.method === 'hybrid',
              },
            }));
            // Track that we've detected for this ingredient
            lastDetectedRef.current = {
              ingredientName,
              brand: brand || undefined,
            };
          }
        }
      } catch (error) {
        logger.error('[Wizard] Error detecting allergens:', error);
        // Don't show error to user - detection is optional
      } finally {
        setDetectingAllergens(false);
      }
    };

    detectAllergens();
  }, [wizardStep, formData.ingredient_name, formData.brand]);

  const canProceed = useMemo(() => {
    // Step 1 and step 4 (review) require validation
    // Step 2 (supplier/storage) and step 3 (allergens) are optional
    if (wizardStep === 1 || wizardStep === 4) {
      return checkValidationHelper(1, formData); // Use step 1 validation for both
    }
    return true; // Steps 2 and 3 are optional
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
    detectingAllergens: wizardStep === 3 ? detectingAllergens : false,
  };
  return (
    <div className="mb-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-white">Add New Ingredient</h2>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(step => (
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
      {wizardStep === 3 && <IngredientWizardStep4 {...stepProps} />}
      {wizardStep === 4 && <IngredientWizardStep3 {...stepProps} />}
      <IngredientWizardNavigation
        currentStep={wizardStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrevious={prevStep}
        onSave={handleSave}
        onCancel={onCancel}
        canProceed={canProceed}
        loading={loading}
        onSkipStep2={wizardStep === 2 ? skipStep2 : undefined}
      />
    </div>
  );
}
