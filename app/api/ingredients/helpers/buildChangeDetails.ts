/**
 * Build change details object for cache invalidation
 */
export function buildChangeDetails(
  formattedUpdates: Record<string, unknown>,
): Record<string, unknown> {
  const changeDetails: Record<string, unknown> = {};
  const costFields = [
    { key: 'cost_per_unit', message: 'cost per unit updated' },
    { key: 'cost_per_unit_as_purchased', message: 'cost per unit as purchased updated' },
    { key: 'cost_per_unit_incl_trim', message: 'cost per unit including trim updated' },
    { key: 'trim_peel_waste_percentage', message: 'trim/peel/waste percentage updated' },
    { key: 'yield_percentage', message: 'yield percentage updated' },
  ];

  for (const field of costFields) {
    if (formattedUpdates[field.key] !== undefined) {
      changeDetails[field.key] = { field: field.key, change: field.message };
    }
  }

  return changeDetails;
}
