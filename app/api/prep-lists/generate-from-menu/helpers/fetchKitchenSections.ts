import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetch all active kitchen sections.
 *
 * @returns {Promise<Map<string, {id: string, name: string}>>} Map of section ID to section data
 */
export async function fetchKitchenSections() {
  if (!supabaseAdmin) {
    return new Map();
  }

  const { data: kitchenSections, error: sectionsError } = await supabaseAdmin
    .from('kitchen_sections')
    .select('id, name')
    .eq('is_active', true);

  if (sectionsError) {
    logger.error('[Prep Lists API] Error fetching kitchen sections:', {
      error: sectionsError.message,
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchKitchenSections' },
    });
  }

  const sectionsMap = new Map<string, { id: string; name: string }>();
  if (kitchenSections) {
    kitchenSections.forEach(section => {
      sectionsMap.set(section.id, { id: section.id, name: section.name });
    });
  }

  return sectionsMap;
}
