import { NextRequest, NextResponse } from 'next/server';
import { migrateIngredientsToStandardUnits } from '@/lib/ingredients/migrate-to-standard-units';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
export async function POST(request: NextRequest) {
  try {
    const result = await migrateIngredientsToStandardUnits();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Migration completed with errors',
          migrated: result.migrated,
          errors: result.errors,
          errorDetails: result.errorDetails,
        },
        { status: 207 }, // 207 Multi-Status for partial success
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${result.migrated} ingredients to standard units`,
      migrated: result.migrated,
      errors: result.errors,
    });
  } catch (err) {
    logger.error('Migration error:', err);
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
