/**
 * Build SquareConfigInput partial fields from validation result
 */
export function buildConfigInput(validationResult: {
  data: {
    square_location_id?: string;
    sync_enabled?: boolean;
    sync_direction?: 'from_square' | 'to_square' | 'bidirectional';
    auto_sync_interval?: number;
  };
}): any {
  return {
    ...(validationResult.data.square_location_id && {
      default_location_id: validationResult.data.square_location_id,
    }),
    ...(validationResult.data.sync_enabled !== undefined && {
      auto_sync_enabled: validationResult.data.sync_enabled,
    }),
    ...(validationResult.data.sync_direction && {
      auto_sync_direction:
        validationResult.data.sync_direction === 'from_square'
          ? 'prepflow_to_square'
          : validationResult.data.sync_direction === 'to_square'
            ? 'prepflow_to_square'
            : 'bidirectional',
    }),
    ...(validationResult.data.auto_sync_interval && {
      sync_frequency_minutes: validationResult.data.auto_sync_interval,
    }),
  };
}
