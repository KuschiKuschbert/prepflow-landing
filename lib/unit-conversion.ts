// Comprehensive Unit Conversion System for PrepFlow WebApp

export interface ConversionResult {
  convertedValue: number;
  convertedUnit: string;
  originalValue: number;
  originalUnit: string;
  conversionFactor: number;
}

// Volume to Volume conversions (base unit: ml)
const volumeConversions: Record<string, number> = {
  'ml': 1,
  'milliliter': 1,
  'l': 1000,
  'liter': 1000,
  'litre': 1000,
  'tsp': 5,
  'teaspoon': 5,
  'tbsp': 15,
  'tablespoon': 15,
  'cup': 240,
  'cups': 240,
  'fl oz': 30,
  'fluid ounce': 30,
  'pint': 480,
  'quart': 960,
  'gallon': 3840
};

// Weight to Weight conversions (base unit: g)
const weightConversions: Record<string, number> = {
  'g': 1,
  'gm': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'oz': 28.35,
  'ounce': 28.35,
  'lb': 453.6,
  'pound': 453.6,
  'mg': 0.001,
  'milligram': 0.001
};

// Common ingredient densities (grams per ml) for volume to weight conversion
const densities: Record<string, number> = {
  // Liquids
  'water': 1.0,
  'milk': 1.03,
  'cream': 1.01,
  'oil': 0.92,
  'olive oil': 0.92,
  'vegetable oil': 0.92,
  'vinegar': 1.01,
  'honey': 1.42,
  'syrup': 1.33,
  
  // Flours and powders
  'flour': 0.59,
  'all-purpose flour': 0.59,
  'bread flour': 0.59,
  'cake flour': 0.59,
  'sugar': 0.85,
  'white sugar': 0.85,
  'brown sugar': 0.8,
  'powdered sugar': 0.6,
  'cocoa powder': 0.4,
  'baking powder': 0.6,
  'baking soda': 0.87,
  'salt': 1.2,
  'cornstarch': 0.6,
  
  // Nuts and seeds
  'almonds': 0.6,
  'walnuts': 0.65,
  'pecans': 0.7,
  'peanuts': 0.6,
  'sesame seeds': 0.6,
  'sunflower seeds': 0.5,
  
  // Dairy
  'butter': 0.91,
  'cheese': 1.1,
  'cream cheese': 1.0,
  'yogurt': 1.03,
  
  // Default density for unknown ingredients
  'default': 0.8
};

/**
 * Get density for an ingredient
 */
export function getIngredientDensity(ingredientName: string): number {
  if (!ingredientName) return densities.default;
  
  const lowerIngredient = ingredientName.toLowerCase();
  
  // Check for exact matches first
  if (densities[lowerIngredient]) {
    return densities[lowerIngredient];
  }
  
  // Check for partial matches
  for (const [key, density] of Object.entries(densities)) {
    if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
      return density;
    }
  }
  
  return densities.default;
}

/**
 * Check if a unit is a volume unit
 */
export function isVolumeUnit(unit: string): boolean {
  const normalizedUnit = unit.toLowerCase().trim();
  return normalizedUnit in volumeConversions;
}

/**
 * Check if a unit is a weight unit
 */
export function isWeightUnit(unit: string): boolean {
  const normalizedUnit = unit.toLowerCase().trim();
  return normalizedUnit in weightConversions;
}

/**
 * Convert between units (volume to volume, weight to weight, or volume to weight)
 */
export function convertUnit(
  value: number, 
  fromUnit: string, 
  toUnit: string, 
  ingredientName?: string
): ConversionResult {
  const from = fromUnit.toLowerCase().trim();
  const to = toUnit.toLowerCase().trim();
  
  // If same unit, return original value
  if (from === to) {
    return {
      convertedValue: value,
      convertedUnit: toUnit,
      originalValue: value,
      originalUnit: fromUnit,
      conversionFactor: 1
    };
  }
  
  const isFromVolume = isVolumeUnit(from);
  const isToVolume = isVolumeUnit(to);
  const isFromWeight = isWeightUnit(from);
  const isToWeight = isWeightUnit(to);
  
  let convertedValue: number;
  let conversionFactor: number;
  
  if (isFromVolume && isToVolume) {
    // Volume to Volume conversion
    const fromMl = value * volumeConversions[from];
    convertedValue = fromMl / volumeConversions[to];
    conversionFactor = volumeConversions[from] / volumeConversions[to];
  } else if (isFromWeight && isToWeight) {
    // Weight to Weight conversion
    const fromGrams = value * weightConversions[from];
    convertedValue = fromGrams / weightConversions[to];
    conversionFactor = weightConversions[from] / weightConversions[to];
  } else if (isFromVolume && isToWeight) {
    // Volume to Weight conversion
    const density = getIngredientDensity(ingredientName || '');
    const fromMl = value * volumeConversions[from];
    const grams = fromMl * density;
    convertedValue = grams / weightConversions[to];
    conversionFactor = (volumeConversions[from] * density) / weightConversions[to];
  } else if (isFromWeight && isToVolume) {
    // Weight to Volume conversion
    const density = getIngredientDensity(ingredientName || '');
    const fromGrams = value * weightConversions[from];
    const ml = fromGrams / density;
    convertedValue = ml / volumeConversions[to];
    conversionFactor = weightConversions[from] / (density * volumeConversions[to]);
  } else {
    // Unknown units - return original value
    return {
      convertedValue: value,
      convertedUnit: toUnit,
      originalValue: value,
      originalUnit: fromUnit,
      conversionFactor: 1
    };
  }
  
  return {
    convertedValue,
    convertedUnit: toUnit,
    originalValue: value,
    originalUnit: fromUnit,
    conversionFactor
  };
}

/**
 * Convert ingredient cost from one unit to another
 */
export function convertIngredientCost(
  costPerUnit: number,
  fromUnit: string,
  toUnit: string,
  ingredientName?: string
): number {
  const conversion = convertUnit(1, fromUnit, toUnit, ingredientName);
  return costPerUnit / conversion.conversionFactor;
}

/**
 * Format quantity with smart unit conversion for display
 */
export function formatQuantityWithConversion(
  quantity: number,
  unit: string,
  targetUnit?: string
): { value: string; unit: string; original?: string } {
  if (!targetUnit || unit.toLowerCase() === targetUnit.toLowerCase()) {
    return { value: quantity.toFixed(2), unit };
  }
  
  const conversion = convertUnit(quantity, unit, targetUnit);
  
  return {
    value: conversion.convertedValue.toFixed(2),
    unit: targetUnit,
    original: `${quantity} ${unit}`
  };
}

/**
 * Get all available units
 */
export function getAllUnits(): { volume: string[]; weight: string[] } {
  return {
    volume: Object.keys(volumeConversions),
    weight: Object.keys(weightConversions)
  };
}

/**
 * Get conversion factor between two units
 */
export function getConversionFactor(
  fromUnit: string,
  toUnit: string,
  ingredientName?: string
): number {
  const conversion = convertUnit(1, fromUnit, toUnit, ingredientName);
  return conversion.conversionFactor;
}
