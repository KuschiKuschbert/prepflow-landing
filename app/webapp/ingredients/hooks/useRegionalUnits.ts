// PrepFlow - Regional Units Hook
// Filters available units based on user's region/country
// Excludes cooking measurements (tsp, tbsp, cup) for ingredients (only for recipes)

'use client';

import { useMemo } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { UNIT_GROUPS } from '../components/ingredient-units';

const ADDITIONAL_UNITS = ['pc', 'box', 'pack', 'bag', 'bottle', 'can', 'bunch'];

// Cooking measurements that are NOT available for ingredients (only for recipes)
const COOKING_MEASUREMENTS = ['tsp', 'tbsp', 'cup'];

// Metric units for ingredients (g, kg, ml, l) - excludes cooking measurements
const METRIC_UNITS_INGREDIENTS = ['g', 'kg', 'ml', 'l'];

// Imperial units for ingredients (oz, lb, fl oz) - excludes cooking measurements
const IMPERIAL_UNITS_INGREDIENTS = ['oz', 'lb', 'fl oz'];

export function useRegionalUnits() {
  const { countryConfig } = useCountry();

  const availableUnits = useMemo(() => {
    const allUnits: string[] = [
      ...UNIT_GROUPS.flatMap(group => group.options.map(option => option.value)),
      ...ADDITIONAL_UNITS,
    ];

    // Filter out cooking measurements (tsp, tbsp, cup) - these are only for recipes
    const unitsWithoutCooking = allUnits.filter(
      unit => !COOKING_MEASUREMENTS.includes(unit.toLowerCase()),
    );

    // Filter based on unit system
    switch (countryConfig.unitSystem) {
      case 'metric':
        // Only show metric units + piece units (no cooking measurements)
        return unitsWithoutCooking.filter(unit => {
          const normalized = unit.toLowerCase();
          return (
            METRIC_UNITS_INGREDIENTS.includes(normalized) || ADDITIONAL_UNITS.includes(normalized)
          );
        });

      case 'imperial':
        // Only show imperial units + piece units (no cooking measurements)
        return unitsWithoutCooking.filter(unit => {
          const normalized = unit.toLowerCase();
          return (
            IMPERIAL_UNITS_INGREDIENTS.includes(normalized) || ADDITIONAL_UNITS.includes(normalized)
          );
        });

      case 'mixed':
      default:
        // Show all units except cooking measurements
        return unitsWithoutCooking;
    }
  }, [countryConfig.unitSystem]);

  return { availableUnits, unitSystem: countryConfig.unitSystem };
}
