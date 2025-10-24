// Unit conversion utilities
export interface ConversionResult {
  value: number;
  unit: string;
  originalValue: number;
  originalUnit: string;
}

// Basic unit conversion functions
export const convertUnit = (value: number, fromUnit: string, toUnit: string): ConversionResult => {
  // Simple conversion logic - can be expanded
  const conversions: { [key: string]: { [key: string]: number } } = {
    kg: { g: 1000, lb: 2.20462, oz: 35.274 },
    g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
    lb: { kg: 0.453592, g: 453.592, oz: 16 },
    oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 },
    l: { ml: 1000, cup: 4.22675, fl_oz: 33.814 },
    ml: { l: 0.001, cup: 0.00422675, fl_oz: 0.033814 },
    cup: { l: 0.236588, ml: 236.588, fl_oz: 8 },
    fl_oz: { l: 0.0295735, ml: 29.5735, cup: 0.125 },
  };

  if (fromUnit === toUnit) {
    return {
      value,
      unit: toUnit,
      originalValue: value,
      originalUnit: fromUnit,
    };
  }

  const conversionFactor = conversions[fromUnit]?.[toUnit];
  if (!conversionFactor) {
    // Return original value if conversion not supported
    return {
      value,
      unit: toUnit,
      originalValue: value,
      originalUnit: fromUnit,
    };
  }

  return {
    value: value * conversionFactor,
    unit: toUnit,
    originalValue: value,
    originalUnit: fromUnit,
  };
};

export const convertIngredientCost = (
  cost: number,
  fromUnit: string,
  toUnit: string,
  quantity: number = 1,
): number => {
  const conversion = convertUnit(quantity, fromUnit, toUnit);
  return (cost / quantity) * conversion.value;
};

export const formatUnit = (value: number, unit: string): string => {
  return `${value.toFixed(2)} ${unit}`;
};

export const getAllUnits = (): string[] => {
  return ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'cup', 'fl_oz'];
};

export const isVolumeUnit = (unit: string): boolean => {
  return ['l', 'ml', 'cup', 'fl_oz'].includes(unit.toLowerCase());
};

export const isWeightUnit = (unit: string): boolean => {
  return ['kg', 'g', 'lb', 'oz'].includes(unit.toLowerCase());
};

export const parseUnit = (unitString: string): { value: number; unit: string } => {
  const match = unitString.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2].trim(),
    };
  }
  return { value: 0, unit: unitString };
};
