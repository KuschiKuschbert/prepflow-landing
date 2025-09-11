// Unit conversion utilities for ingredient management

export interface ConversionResult {
  conversionFactor: number;
  isValid: boolean;
  error?: string;
}

// Common unit conversions
const CONVERSION_FACTORS: Record<string, Record<string, number>> = {
  // Weight conversions (base unit: grams)
  'g': { 'g': 1, 'kg': 0.001, 'oz': 0.035274, 'lb': 0.002205 },
  'kg': { 'g': 1000, 'kg': 1, 'oz': 35.274, 'lb': 2.205 },
  'oz': { 'g': 28.3495, 'kg': 0.0283495, 'oz': 1, 'lb': 0.0625 },
  'lb': { 'g': 453.592, 'kg': 0.453592, 'oz': 16, 'lb': 1 },
  
  // Volume conversions (base unit: milliliters)
  'ml': { 'ml': 1, 'l': 0.001, 'tsp': 0.202884, 'tbsp': 0.067628, 'cup': 0.004227 },
  'l': { 'ml': 1000, 'l': 1, 'tsp': 202.884, 'tbsp': 67.628, 'cup': 4.227 },
  'tsp': { 'ml': 4.92892, 'l': 0.00492892, 'tsp': 1, 'tbsp': 0.333333, 'cup': 0.0208333 },
  'tbsp': { 'ml': 14.7868, 'l': 0.0147868, 'tsp': 3, 'tbsp': 1, 'cup': 0.0625 },
  'cup': { 'ml': 236.588, 'l': 0.236588, 'tsp': 48, 'tbsp': 16, 'cup': 1 },
  
  // Piece conversions (base unit: pieces)
  'pc': { 'pc': 1, 'box': 0.01, 'pack': 0.1, 'bag': 0.05, 'bottle': 0.1, 'can': 0.1 },
  'box': { 'pc': 100, 'box': 1, 'pack': 10, 'bag': 5, 'bottle': 10, 'can': 10 },
  'pack': { 'pc': 10, 'box': 0.1, 'pack': 1, 'bag': 0.5, 'bottle': 1, 'can': 1 },
  'bag': { 'pc': 20, 'box': 0.2, 'pack': 2, 'bag': 1, 'bottle': 2, 'can': 2 },
  'bottle': { 'pc': 10, 'box': 0.1, 'pack': 1, 'bag': 0.5, 'bottle': 1, 'can': 1 },
  'can': { 'pc': 10, 'box': 0.1, 'pack': 1, 'bag': 0.5, 'bottle': 1, 'can': 1 }
};

export function convertUnit(amount: number, fromUnit: string, toUnit: string): ConversionResult {
  if (!fromUnit || !toUnit) {
    return { conversionFactor: 1, isValid: false, error: 'Unit not specified' };
  }

  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  if (from === to) {
    return { conversionFactor: 1, isValid: true };
  }

  const fromFactors = CONVERSION_FACTORS[from];
  if (!fromFactors) {
    return { conversionFactor: 1, isValid: false, error: `Unknown unit: ${fromUnit}` };
  }

  const conversionFactor = fromFactors[to];
  if (conversionFactor === undefined) {
    return { conversionFactor: 1, isValid: false, error: `Cannot convert from ${fromUnit} to ${toUnit}` };
  }

  return { conversionFactor, isValid: true };
}

export function convertIngredientCost(
  cost: number, 
  fromUnit: string, 
  toUnit: string, 
  ingredientName: string
): number {
  const conversion = convertUnit(1, fromUnit, toUnit);
  if (!conversion.isValid) {
    console.warn(`Conversion failed for ${ingredientName}: ${conversion.error}`);
    return cost;
  }
  return cost * conversion.conversionFactor;
}

export function isVolumeUnit(unit: string): boolean {
  const volumeUnits = ['ml', 'l', 'tsp', 'tbsp', 'cup'];
  return volumeUnits.includes(unit.toLowerCase());
}

export function isWeightUnit(unit: string): boolean {
  const weightUnits = ['g', 'kg', 'oz', 'lb'];
  return weightUnits.includes(unit.toLowerCase());
}

export function getAllUnits(): string[] {
  return Object.keys(CONVERSION_FACTORS);
}