import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch all active kitchen sections.
 *
 * @returns {Promise<Map<string, {id: string, name: string}>>} Map of section ID to section data
 */
export async function fetchKitchenSections() {
  if (!supabaseAdmin) {
    return new Map();
  }

  const { data: kitchenSections } = await supabaseAdmin
    .from('kitchen_sections')
    .select('id, name')
    .eq('is_active', true);

  const sectionsMap = new Map<string, { id: string; name: string }>();
  if (kitchenSections) {
    kitchenSections.forEach(section => {
      sectionsMap.set(section.id, { id: section.id, name: section.name });
    });
  }

  return sectionsMap;
}
