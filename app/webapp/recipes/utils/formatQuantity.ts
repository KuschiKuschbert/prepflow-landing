export interface FormattedQuantity {
  value: string;
  unit: string;
  original: string;
}

export function formatQuantity(
  quantity: number,
  unit: string,
  previewYield: number,
  recipeYield: number,
): FormattedQuantity {
  const adjustedQuantity = (previewYield / recipeYield) * quantity;

  // Smart conversions for common units
  if (unit.toLowerCase() === 'gm' || unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram') {
    if (adjustedQuantity >= 1000) {
      return {
        value: (adjustedQuantity / 1000).toFixed(1),
        unit: 'kg',
        original: `${adjustedQuantity.toFixed(1)} ${unit}`,
      };
    }
  }

  if (unit.toLowerCase() === 'ml' || unit.toLowerCase() === 'milliliter') {
    if (adjustedQuantity >= 1000) {
      return {
        value: (adjustedQuantity / 1000).toFixed(1),
        unit: 'L',
        original: `${adjustedQuantity.toFixed(1)} ${unit}`,
      };
    }
  }

  // For smaller quantities, show more precision
  if (adjustedQuantity < 1) {
    return {
      value: adjustedQuantity.toFixed(2),
      unit: unit,
      original: `${adjustedQuantity.toFixed(2)} ${unit}`,
    };
  }

  // Default formatting
  return {
    value: adjustedQuantity.toFixed(1),
    unit: unit,
    original: `${adjustedQuantity.toFixed(1)} ${unit}`,
  };
}
