import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
interface CreatePrepListParams {
  userId: string;
  kitchenSectionId: string;
  name: string;
  notes?: string;
  items?: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes?: string;
  }>;
}

export async function createPrepList(params: CreatePrepListParams) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { userId, kitchenSectionId, name, notes, items } = params;

  // Create the prep list
  const { data: prepList, error: prepError } = await supabaseAdmin
    .from('prep_lists')
    .insert({
      user_id: userId,
      kitchen_section_id: kitchenSectionId,
      name: name,
      notes: notes,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (prepError) {
    throw new Error(`Failed to create prep list: ${prepError.message}`);
  }

  // Add items if provided
  if (items && items.length > 0) {
    const prepItems = items.map((item: any) => ({
      prep_list_id: prepList.id,
      ingredient_id: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabaseAdmin.from('prep_list_items').insert(prepItems);

    if (itemsError) {
      logger.error('Error creating prep list items:', itemsError);
      // Don't fail the entire request, just log the error
    }
  }

  return prepList;
}
