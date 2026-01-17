import { logAdminApiAction } from '@/lib/admin-audit';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { processHiddenFlags } from './helpers/processHiddenFlags';
import { processRegularFlags } from './helpers/processRegularFlags';
import { autoCreateSchema } from './types';

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

    // Separate regular and hidden flags
    const regularFlags = flags.filter(f => f.type === 'regular');
    const hiddenFlags = flags.filter(f => f.type === 'hidden');

    // Process regular flags
    const regularResult = await processRegularFlags(regularFlags);

    // Process hidden flags
    const hiddenResult = await processHiddenFlags(hiddenFlags);

    // Aggregate results
    const createdCount = regularResult.created + hiddenResult.created;
    const skippedCount = regularResult.skipped + hiddenResult.skipped;
    const createdFlags = [...regularResult.createdFlags, ...hiddenResult.createdFlags];
    const skippedFlags = [...regularResult.skippedFlags, ...hiddenResult.skippedFlags];

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
