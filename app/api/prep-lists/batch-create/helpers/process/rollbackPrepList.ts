import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function rollbackPrepList(prepListId: string) {
  if (!supabaseAdmin) return;

  const { error: rollbackError } = await supabaseAdmin
    .from('prep_lists')
    .delete()
    .eq('id', prepListId);

  if (rollbackError) {
    logger.warn(
      '[Prep Lists API] Warning: Failed to rollback prep list after items error:',
      {
        error: rollbackError.message,
        prepListId,
      },
    );
  }
}
