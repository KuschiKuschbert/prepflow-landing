import { supabaseAdmin } from '@/lib/supabase';

interface UpdatePrepListParams {
  id: string;
  kitchenSectionId?: string;
  name?: string;
  notes?: string;
  status?: string;
  items?: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes?: string;
  }>;
}

export async function updatePrepList(params: UpdatePrepListParams) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { id, kitchenSectionId, name, notes, status, items } = params;

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (kitchenSectionId !== undefined) updateData.kitchen_section_id = kitchenSectionId;
  if (name !== undefined) updateData.name = name;
  if (notes !== undefined) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  const { data, error } = await supabaseAdmin
    .from('prep_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update prep list: ${error.message}`);
  }

  // Update items if provided
  if (items !== undefined) {
    // Delete existing items
    await supabaseAdmin.from('prep_list_items').delete().eq('prep_list_id', id);

    // Add new items
    if (items.length > 0) {
      const prepItems = items.map((item: any) => ({
        prep_list_id: id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      }));

      await supabaseAdmin.from('prep_list_items').insert(prepItems);
    }
  }

  return data;
}
