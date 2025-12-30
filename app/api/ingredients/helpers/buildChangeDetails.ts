/**
 * Build change details object for cache invalidation
 */
export function buildChangeDetails(formattedUpdates: any): any {
  const changeDetails: any = {};
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



