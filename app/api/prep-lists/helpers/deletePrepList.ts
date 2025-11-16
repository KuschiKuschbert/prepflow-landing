import { supabaseAdmin } from '@/lib/supabase';

export async function deletePrepList(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Delete prep list items first (foreign key constraint)
  await supabaseAdmin.from('prep_list_items').delete().eq('prep_list_id', id);

  // Delete the prep list
  const { error } = await supabaseAdmin.from('prep_lists').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete prep list: ${error.message}`);
  }
}
