import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
interface PrepListToCreate {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prepLists, userId } = body;

    if (!prepLists || !Array.isArray(prepLists) || prepLists.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep lists array is required', 'MISSING_REQUIRED_FIELD', 400),
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User ID is required', 'MISSING_REQUIRED_FIELD', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    const createdPrepLists = [];
    const errors = [];

    // Create prep lists sequentially to handle errors properly
    for (const prepListData of prepLists as PrepListToCreate[]) {
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
          // It is safe to assume PostgrestError has a code, but better to check or use unknown
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

    if (createdPrepLists.length === 0 && errors.length > 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('All prep lists failed to create', 'BATCH_CREATE_FAILED', 500, {
          errors,
        }),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdPrepLists.length} prep list(s)`,
      data: {
        createdCount: createdPrepLists.length,
        createdIds: createdPrepLists,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
