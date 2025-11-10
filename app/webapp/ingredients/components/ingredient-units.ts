'use client';

interface UnitOption {
  value: string;
  labelKey: string;
  defaultLabel: string;
}

interface UnitGroup {
  labelKey: string;
  defaultLabel: string;
  options: UnitOption[];
}

export const UNIT_GROUPS: UnitGroup[] = [
  {
    labelKey: 'ingredients.units.weight',
    defaultLabel: 'Weight',
    options: [
      { value: 'g', labelKey: 'ingredients.units.grams', defaultLabel: 'Grams (g)' },
      { value: 'kg', labelKey: 'ingredients.units.kilograms', defaultLabel: 'Kilograms (kg)' },
      { value: 'oz', labelKey: 'ingredients.units.ounces', defaultLabel: 'Ounces (oz)' },
      { value: 'lb', labelKey: 'ingredients.units.pounds', defaultLabel: 'Pounds (lb)' },
    ],
  },
  {
    labelKey: 'ingredients.units.volume',
    defaultLabel: 'Volume',
    options: [
      { value: 'ml', labelKey: 'ingredients.units.milliliters', defaultLabel: 'Milliliters (ml)' },
      { value: 'l', labelKey: 'ingredients.units.liters', defaultLabel: 'Liters (L)' },
      { value: 'tsp', labelKey: 'ingredients.units.teaspoons', defaultLabel: 'Teaspoons (tsp)' },
      {
        value: 'tbsp',
        labelKey: 'ingredients.units.tablespoons',
        defaultLabel: 'Tablespoons (tbsp)',
      },
      { value: 'cup', labelKey: 'ingredients.units.cups', defaultLabel: 'Cups' },
      {
        value: 'fl oz',
        labelKey: 'ingredients.units.fluidOunces',
        defaultLabel: 'Fluid Ounces (fl oz)',
      },
    ],
  },
];

const ADDITIONAL_UNITS = ['pc', 'box', 'pack', 'bag', 'bottle', 'can'];

export const AVAILABLE_UNITS: string[] = [
  ...UNIT_GROUPS.flatMap(group => group.options.map(option => option.value)),
  ...ADDITIONAL_UNITS,
];
