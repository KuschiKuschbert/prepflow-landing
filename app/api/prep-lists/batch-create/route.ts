import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
        {
          success: false,
          error: 'Missing required fields',
          message: 'Prep lists array is required',
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'User ID is required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection could not be established',
        },
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
          logger.error('Error creating prep list:', prepError);
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
            logger.error('Error creating prep list items:', itemsError);
            // Delete the prep list if items failed
            await supabaseAdmin.from('prep_lists').delete().eq('id', prepList.id);
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
        {
          success: false,
          error: 'Failed to create prep lists',
          message: 'All prep lists failed to create',
          errors,
        },
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
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
