import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { createPrepList } from './process/createPrepList';
import { createPrepListItems } from './process/createPrepListItems';
import { rollbackPrepList } from './process/rollbackPrepList';
import { BatchCreateResult, PrepListToCreate } from './types';

// Re-export for backward compatibility
export type { BatchCreateResult, PrepListToCreate } from './types';

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
      const { prepList, error: prepError } = await createPrepList(userId, prepListData);

      if (prepError || !prepList) {
        errors.push({
          prepListName: prepListData.name,
          error: prepError?.message || 'Failed to create prep list',
        });
        continue;
      }

      // Create prep list items
      const { error: itemsError } = await createPrepListItems(prepList.id, prepListData.items);

      if (itemsError) {
        // Rollback
        await rollbackPrepList(prepList.id);

        errors.push({
          prepListName: prepListData.name,
          error: itemsError.message,
        });
        continue;
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
