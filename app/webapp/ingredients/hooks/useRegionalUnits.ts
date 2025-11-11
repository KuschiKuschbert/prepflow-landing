// PrepFlow - Regional Units Hook
// Filters available units based on user's region/country

'use client';

import { useMemo } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { UNIT_GROUPS } from '../components/ingredient-units';

const ADDITIONAL_UNITS = ['pc', 'box', 'pack', 'bag', 'bottle', 'can', 'bunch'];

// Metric units (g, kg, ml, l, tsp, tbsp, cup)
const METRIC_UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup'];

// Imperial units (oz, lb, fl oz)
const IMPERIAL_UNITS = ['oz', 'lb', 'fl oz'];

export function useRegionalUnits() {
  const { countryConfig } = useCountry();

  const availableUnits = useMemo(() => {
    const allUnits: string[] = [
      ...UNIT_GROUPS.flatMap(group => group.options.map(option => option.value)),
      ...ADDITIONAL_UNITS,
    ];

    // Filter based on unit system
    switch (countryConfig.unitSystem) {
      case 'metric':
        // Only show metric units + piece units
        return allUnits.filter(unit => {
          const normalized = unit.toLowerCase();
          return METRIC_UNITS.includes(normalized) || ADDITIONAL_UNITS.includes(normalized);
        });

      case 'imperial':
        // Only show imperial units + piece units
        return allUnits.filter(unit => {
          const normalized = unit.toLowerCase();
          return IMPERIAL_UNITS.includes(normalized) || ADDITIONAL_UNITS.includes(normalized);
        });

      case 'mixed':
      default:
        // Show all units
        return allUnits;
    }
  }, [countryConfig.unitSystem]);

  return { availableUnits, unitSystem: countryConfig.unitSystem };
}
