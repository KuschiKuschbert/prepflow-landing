import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { logAdminApiAction } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const autoCreateSchema = z.object({
  flags: z.array(
    z.object({
      flag_key: z.string().min(1).max(100),
      type: z.enum(['regular', 'hidden']),
      description: z.string().optional().nullable(),
    }),
  ),
});

/**
 * POST /api/admin/features/auto-create
 * Auto-create missing feature flags from discovered list
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validated = autoCreateSchema.parse(body);
    const { flags } = validated;

    let createdCount = 0;
    let skippedCount = 0;
    const createdFlags: string[] = [];
    const skippedFlags: string[] = [];

    // Separate regular and hidden flags
    const regularFlags = flags.filter(f => f.type === 'regular');
    const hiddenFlags = flags.filter(f => f.type === 'hidden');

    // Create regular feature flags
    if (regularFlags.length > 0) {
      for (const flag of regularFlags) {
        try {
          // Check if flag already exists
          const { data: existing, error: checkError } = await supabaseAdmin
            .from('feature_flags')
            .select('flag_key')
            .eq('flag_key', flag.flag_key)
            .is('user_id', null)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is "not found" - that's okay, we'll create the flag
            logger.warn('[Admin Auto-Create] Error checking if regular flag exists:', {
              error: checkError.message,
              flag_key: flag.flag_key,
            });
          }

          if (existing) {
            skippedCount++;
            skippedFlags.push(flag.flag_key);
            continue;
          }

          // Create new flag
          const { error } = await supabaseAdmin.from('feature_flags').insert({
            flag_key: flag.flag_key,
            enabled: false,
            user_id: null,
            description: flag.description || null,
          });

          if (error) {
            // If it's a unique constraint violation, skip it
            if (error.code === '23505') {
              skippedCount++;
              skippedFlags.push(flag.flag_key);
            } else {
              logger.error('[Admin Auto-Create] Error creating regular flag:', {
                error: error.message,
                flag_key: flag.flag_key,
              });
              skippedFlags.push(flag.flag_key);
            }
          } else {
            createdCount++;
            createdFlags.push(flag.flag_key);
          }
        } catch (err) {
          logger.error('[Admin Auto-Create] Unexpected error creating regular flag:', {
            error: err instanceof Error ? err.message : String(err),
            flag_key: flag.flag_key,
          });
          skippedFlags.push(flag.flag_key);
        }
      }
    }

    // Create hidden feature flags
    if (hiddenFlags.length > 0) {
      for (const flag of hiddenFlags) {
        try {
          // Check if flag already exists
          const { data: existing, error: checkError2 } = await supabaseAdmin
            .from('hidden_feature_flags')
            .select('feature_key')
            .eq('feature_key', flag.flag_key)
            .single();

          if (checkError2 && checkError2.code !== 'PGRST116') {
            // PGRST116 is "not found" - that's okay, we'll create the flag
            logger.warn('[Admin Auto-Create] Error checking if hidden flag exists:', {
              error: checkError2.message,
              feature_key: flag.flag_key,
            });
          }

          if (existing) {
            skippedCount++;
            skippedFlags.push(flag.flag_key);
            continue;
          }

          // Create new hidden flag
          const { error } = await supabaseAdmin.from('hidden_feature_flags').insert({
            feature_key: flag.flag_key,
            description: flag.description || `Feature: ${flag.flag_key}`,
            is_unlocked: false,
            is_enabled: false,
          });

          if (error) {
            // If it's a unique constraint violation, skip it
            if (error.code === '23505') {
              skippedCount++;
              skippedFlags.push(flag.flag_key);
            } else {
              logger.error('[Admin Auto-Create] Error creating hidden flag:', {
                error: error.message,
                feature_key: flag.flag_key,
              });
              skippedFlags.push(flag.flag_key);
            }
          } else {
            createdCount++;
            createdFlags.push(flag.flag_key);
          }
        } catch (err) {
          logger.error('[Admin Auto-Create] Unexpected error creating hidden flag:', {
            error: err instanceof Error ? err.message : String(err),
            feature_key: flag.flag_key,
          });
          skippedFlags.push(flag.flag_key);
        }
      }
    }

    await logAdminApiAction(adminUser, 'auto_create_feature_flags', request, {
      details: {
        created: createdCount,
        skipped: skippedCount,
        createdFlags,
        skippedFlags,
      },
    });

    return NextResponse.json({
      success: true,
      created: createdCount,
      skipped: skippedCount,
      createdFlags,
      skippedFlags,
      message: `Created ${createdCount} flags, skipped ${skippedCount} existing flags`,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
