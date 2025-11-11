import {
  convertUnit,
  convertToStandardUnit,
  STANDARD_UNITS,
  normalizeUnit,
  getUnitCategory,
} from '@/lib/unit-conversion';
import { Ingredient } from '../components/types';

// Calculate cost per unit from pack price and pack size
// Returns cost in standard unit (g/ml/pc)
export function calculateCostPerUnit(
  packPrice: number,
  packSize: number,
  packSizeUnit: string,
  targetUnit: string,
): number {
  if (packPrice === 0 || packSize === 0) return 0;

  // Convert pack size to standard unit first
  const packSizeStandard = convertToStandardUnit(packSize, packSizeUnit);

  // Convert target unit to standard unit
  const targetStandard = convertToStandardUnit(1, targetUnit);

  // Calculate cost per standard unit
  const costPerStandardUnit = packPrice / packSizeStandard.value;

  // If target is already standard unit, return as is
  if (targetStandard.unit === packSizeStandard.unit) {
    return costPerStandardUnit;
  }

  // Convert cost to target unit
  const conversion = convertUnit(1, packSizeStandard.unit, targetStandard.unit);
  return costPerStandardUnit * conversion.value;
}

// AI-powered wastage calculation based on ingredient name
export function calculateWastagePercentage(ingredientName: string): number {
  const name = ingredientName.toLowerCase();

  // High wastage ingredients (30-50%)
  if (
    name.includes('onion') ||
    name.includes('garlic') ||
    name.includes('celery') ||
    name.includes('carrot') ||
    name.includes('leek') ||
    name.includes('fennel')
  ) {
    return 35;
  }

  // Medium wastage ingredients (15-30%)
  if (
    name.includes('tomato') ||
    name.includes('cucumber') ||
    name.includes('bell pepper') ||
    name.includes('capsicum') ||
    name.includes('eggplant') ||
    name.includes('zucchini')
  ) {
    return 20;
  }

  // Low wastage ingredients (5-15%)
  if (
    name.includes('potato') ||
    name.includes('apple') ||
    name.includes('banana') ||
    name.includes('orange') ||
    name.includes('lemon') ||
    name.includes('lime')
  ) {
    return 10;
  }

  // Very low wastage ingredients (0-5%)
  if (
    name.includes('rice') ||
    name.includes('pasta') ||
    name.includes('flour') ||
    name.includes('sugar') ||
    name.includes('salt') ||
    name.includes('oil')
  ) {
    return 2;
  }

  // Default for unknown ingredients
  return 15;
}

// Smart cost formatting - 3 decimals for small amounts (0.xxx), fewer for larger amounts
export function formatCost(cost: number): string {
  if (cost < 1) {
    return cost.toFixed(3); // 0.007
  } else if (cost < 10) {
    return cost.toFixed(2); // 5.50
  } else {
    return cost.toFixed(2); // 12.99
  }
}

// Pure validation function that doesn't set state (for use during render)
export function checkValidation(step: number, formData: Partial<Ingredient>): boolean {
  if (step === 1 || step === 3) {
    if (!formData.ingredient_name?.trim()) return false;
    if (!formData.pack_size?.trim()) return false;
    if (!formData.pack_size_unit) return false;
    if (!formData.pack_price || formData.pack_price <= 0) return false;
    if (!formData.unit) return false;
  }
  return true;
}

// Validation function that returns errors (for setting state)
export function getValidationErrors(
  step: number,
  formData: Partial<Ingredient>,
): Record<string, string> {
  const newErrors: Record<string, string> = {};

  if (step === 1 || step === 3) {
    if (!formData.ingredient_name?.trim())
      newErrors.ingredient_name = 'Ingredient name is required';
    if (!formData.pack_size?.trim()) newErrors.pack_size = 'Pack size is required';
    if (!formData.pack_size_unit) newErrors.pack_size_unit = 'Pack unit is required';
    if (!formData.pack_price || formData.pack_price <= 0)
      newErrors.pack_price = 'Pack price must be greater than 0';
    if (!formData.unit) newErrors.unit = 'Working unit is required';
  }

  return newErrors;
}
