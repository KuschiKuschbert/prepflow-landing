const BRISBANE_FALLBACK = { lat: -27.6394, lon: 153.1094 };

/**
 * Get venue coordinates from Supabase with Brisbane fallback.
 * Use this in server-side API routes. Accepts Supabase client.
 */
export async function getVenueCoordinatesFromDb(supabase: {
  from: (table: string) => unknown;
}): Promise<{ lat: number; lon: number }> {
  try {
    const builder = supabase.from('venue_settings') as {
      select: (cols: string) => {
        limit: (n: number) => {
          single: () => Promise<{
            data: { latitude?: number; longitude?: number } | null;
            error: unknown;
          }>;
        };
      };
    };
    const { data, error } = await builder.select('latitude, longitude').limit(1).single();

    if (error || !data) return BRISBANE_FALLBACK;
    const row = data;
    if (typeof row.latitude === 'number' && typeof row.longitude === 'number') {
      return { lat: row.latitude, lon: row.longitude };
    }
  } catch {
    // Fall through to Brisbane
  }
  return BRISBANE_FALLBACK;
}
