
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface PrepListToCreate {
  sectionId: string | null;
  name: string;
  notes?: string;
  items: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes: string;
  }>;
}

export interface BatchCreateResult {
  createdIds: string[];
  errors: Array<{ prepListName: string; error: string }>;
}

export async function processBatchCreation(
  userId: string,
  prepLists: PrepListToCreate[],
): Promise<BatchCreateResult> {
  const createdPrepLists: string[] = [];
  const errors: Array<{ prepListName: string; error: string }> = [];

  if (!supabaseAdmin) {
    throw new Error('Database connection could not be established');
  }

  // Create prep lists sequentially to handle errors properly
  for (const prepListData of prepLists) {
    try {
      // Skip if no items
      if (!prepListData.items || prepListData.items.length === 0) {
        continue;
      }

      // Create the prep list
      const { data: prepList, error: prepError } = await supabaseAdmin
        .from('prep_lists')
        .insert({
          user_id: userId,
          kitchen_section_id: prepListData.sectionId,
          name: prepListData.name,
          notes: prepListData.notes || null,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (prepError) {
        const code = (prepError as { code?: string }).code;
        logger.error('[Prep Lists API] Database error creating prep list:', {
          error: prepError.message,
          code,
          prepListName: prepListData.name,
        });
        errors.push({
          prepListName: prepListData.name,
          error: prepError.message,
        });
        continue;
      }

      // Create prep list items
      const prepItems = prepListData.items.map(item => ({
        prep_list_id: prepList.id,
        ingredient_id: item.ingredientId,
        quantity: parseFloat(item.quantity) || 0,
        unit: item.unit,
        notes: item.notes || null,
      }));

      if (prepItems.length > 0) {
        const { error: itemsError } = await supabaseAdmin
          .from('prep_list_items')
          .insert(prepItems);

        if (itemsError) {
          const code = (itemsError as { code?: string }).code;
          logger.error('[Prep Lists API] Error creating prep list items:', {
            error: itemsError.message,
            code,
            prepListId: prepList.id,
          });
          // Delete the prep list if items failed
          const { error: rollbackError } = await supabaseAdmin
            .from('prep_lists')
            .delete()
            .eq('id', prepList.id);

          if (rollbackError) {
            logger.warn(
              '[Prep Lists API] Warning: Failed to rollback prep list after items error:',
              {
                error: rollbackError.message,
                prepListId: prepList.id,
              },
            );
          }
          errors.push({
            prepListName: prepListData.name,
            error: itemsError.message,
          });
          continue;
        }
      }

      createdPrepLists.push(prepList.id);
    } catch (err) {
      logger.error('Error processing prep list:', err);
      errors.push({
        prepListName: prepListData.name,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { createdIds: createdPrepLists, errors };
}
