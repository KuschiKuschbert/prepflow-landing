/**
 * Recipe Processing API
 * Handles recipe formatting/processing requests and status
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
    handlePauseAction,
    handleResumeAction,
    handleStartAction,
    handleStopAction,
} from './helpers/action-handlers';
import {
    enhanceProcessingStatus,
    getDefaultStatus,
    getProviderInfo,
} from './helpers/status-handlers';

// Dynamic import to handle potential import failures gracefully
async function getRecipeProcessor() {
  try {
    const processorMod = await import('../../../../scripts/recipe-scraper/utils/recipe-processor');
    return processorMod;
  } catch (importErr) {
    logger.error('[Process Recipes API] Failed to import recipe processor:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load recipe processor module');
  }
}

const processRecipesSchema = z.object({
  action: z.enum(['start', 'pause', 'resume', 'stop']).optional(),
  limit: z.number().int().positive().optional(),
  model: z.string().optional(),
});

/**
 * GET /api/recipe-scraper/process-recipes
 * Get current processing/formatting status with diagnostics
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Get processing status from processor
    let status;

    try {
      const processorMod = await getRecipeProcessor();
      const rawStatus = processorMod.getProcessingStatus();
      status = await enhanceProcessingStatus(rawStatus, processorMod);
    } catch (statusErr) {
      logger.error('[Process Recipes API] Error getting processing status:', {
        error: statusErr instanceof Error ? statusErr.message : String(statusErr),
      });
      status = getDefaultStatus();
    }

    // Add provider availability info
    const providerInfo = await getProviderInfo();

    return NextResponse.json({
      success: true,
      data: {
        ...status,
        providerInfo,
      },
    });
  } catch (err) {
    logger.error('[Process Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/process-recipes', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch processing status', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * POST /api/recipe-scraper/process-recipes
 * Start, pause, or resume recipe processing
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    let body: unknown = {};
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Process Recipes API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = processRecipesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { action, limit, model } = validationResult.data;
    const processorMod = await getRecipeProcessor();

    // Handle different actions
    if (action === 'pause') {
      const result = handlePauseAction(processorMod);
      return NextResponse.json(result);
    }

    if (action === 'resume') {
      const result = handleResumeAction(processorMod);
      return NextResponse.json(result);
    }

    if (action === 'stop') {
      const result = handleStopAction(processorMod);
      return NextResponse.json(result);
    }

    // Handle start action (process all recipes)
    if (action === 'start' || !action) {
      const result = await handleStartAction(processorMod, limit, model);
      return NextResponse.json(result, { status: result.status || 200 });
    }

    // Unknown action
    return NextResponse.json(
      ApiErrorHandler.createError(`Unknown action: ${action}`, 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  } catch (err) {
    logger.error('[Process Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/process-recipes', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to process recipes', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
