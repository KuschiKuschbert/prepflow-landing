/**
 * Apply Queensland food safety standards to equipment data.
 *
 * @param {Array} equipment - Equipment data array
 * @returns {Array} Equipment data with Queensland-compliant thresholds
 */
export function applyQueenslandStandards(equipment: Record<string, any>[]): Record<string, any>[] {
  return equipment.map(eq => {
    const name = eq.name.toLowerCase();

    // Apply Queensland thresholds based on equipment type
    if (name.includes('freezer') || name.includes('frozen')) {
      return {
        ...eq,
        min_temp_celsius: -24, // Optimal minimum freezer temperature
        max_temp_celsius: -18, // Queensland freezer standard - must be at or below -18°C
      };
    } else if (name.includes('hot') || name.includes('warming') || name.includes('steam')) {
      return {
        ...eq,
        min_temp_celsius: 60, // Queensland hot holding standard
        max_temp_celsius: null, // No upper limit for hot holding
      };
    } else {
      // Default to cold storage (fridges, walk-ins, etc.)
      // Set 0°C to 5°C range for optimal food safety
      return {
        ...eq,
        min_temp_celsius: 0, // Minimum temperature for cold storage
        max_temp_celsius: 5, // Queensland cold storage standard - must be at or below 5°C
      };
    }
  });
}
