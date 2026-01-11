/**
 * Recipe Processing API
 * Handles recipe formatting/processing requests and status
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { isGroqEnabled, isGroqAvailable } from '@/lib/ai/groq-client';
// PRIMARY: Groq API (fastest free option - sub-second responses)
// FALLBACK: Ollama (completely free, local processing)
// GEMINI REMOVED: Using only Groq/Ollama to prevent expensive API costs

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

/**
 * GET /api/recipe-scraper/process-recipes
 * Get current processing/formatting status with diagnostics
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Processing status with diagnostics
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    try {
      await requireAuth(request);
    } catch (authErr) {
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Process Recipes API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Get processing status from processor
    let status;

    try {
      const processor = await getRecipeProcessor();
      status = processor.getProcessingStatus();

      // If not processing, calculate unformatted recipe count to show accurate numbers
      if (!status.isProcessing) {
        try {
          const counts = await processor.countUnformattedRecipes();
          status.totalRecipes = counts.unformatted;
          status.skippedFormatted = counts.formatted;
          logger.dev('[Process Recipes API] Calculated unformatted recipe counts', counts);
        } catch (countErr) {
          logger.warn('[Process Recipes API] Failed to count unformatted recipes:', {
            error: countErr instanceof Error ? countErr.message : String(countErr),
          });
          // Continue with status.totalRecipes = 0 if counting fails
        }
      }

      // Set default provider if not set (Groq primary, Ollama fallback)
      if (!status.aiProvider) {
        const groqEnabled = isGroqEnabled();
        const groqAvailable = groqEnabled ? await isGroqAvailable() : false;

        if (groqAvailable) {
          status.aiProvider = 'Groq API';
          status.aiProviderModel = 'llama-3.1-8b-instant';
        } else {
          status.aiProvider = 'Ollama';
          status.aiProviderModel = 'llama3.2:3b';
        }
      }
    } catch (statusErr) {
      logger.error('[Process Recipes API] Error getting processing status:', {
        error: statusErr instanceof Error ? statusErr.message : String(statusErr),
      });
      // Return default status instead of failing
      status = {
        isProcessing: false,
        isPaused: false,
        queueLength: 0,
        activeProcessing: 0,
        totalProcessed: 0,
        totalRecipes: 0,
        progressPercent: 0,
        isStuck: false,
        healthStatus: 'healthy' as const,
        aiProvider: 'Unknown',
        aiProviderModel: 'Unknown',
      };
    }

    // Add provider availability info
    const groqEnabled = isGroqEnabled();
    const groqAvailable = groqEnabled ? await isGroqAvailable() : false;

    return NextResponse.json({
      success: true,
      data: {
        ...status,
        providerInfo: {
          groqEnabled,
          groqAvailable,
          ollamaRecommended: !groqAvailable,
          note: groqAvailable
            ? 'Using Groq API (fast, sub-second responses)'
            : groqEnabled
              ? 'Groq enabled but not available. Using Ollama fallback (free, local).'
              : 'Using Ollama (free, local). Enable Groq by setting USE_GROQ=true and GROQ_API_KEY=your-key for faster processing.',
        },
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
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Processing response
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    try {
      await requireAuth(request);
    } catch (authErr) {
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Process Recipes API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, limit, model } = body; // Model can be specified, but provider selection is automatic (Groq primary, Ollama fallback)

    const processor = await getRecipeProcessor();

    // Handle pause action
    if (action === 'pause') {
      processor.pauseProcessing();
      const status = processor.getProcessingStatus();
      return NextResponse.json({
        success: true,
        message: 'Processing paused',
        data: status,
      });
    }

    // Handle resume action
    if (action === 'resume') {
      processor.resumeProcessing();
      const status = processor.getProcessingStatus();
      return NextResponse.json({
        success: true,
        message: 'Processing resumed',
        data: status,
      });
    }

    // Handle stop action
    if (action === 'stop') {
      processor.stopProcessing();
      const status = processor.getProcessingStatus();
      return NextResponse.json({
        success: true,
        message: 'Processing stopped',
        data: status,
      });
    }

    // Handle start action (process all recipes)
    if (action === 'start' || !action) {
      // Check if already processing
      const currentStatus = processor.getProcessingStatus();
      if (currentStatus.isProcessing && !currentStatus.isPaused) {
        return NextResponse.json({
          success: false,
          message: 'Processing is already in progress',
          data: currentStatus,
        });
      }

      // Check provider availability (Groq primary, Ollama fallback)
      const groqEnabled = isGroqEnabled();
      const groqAvailable = groqEnabled ? await isGroqAvailable() : false;

      // Select model based on provider
      const selectedModel = model || (groqAvailable ? 'llama-3.1-8b-instant' : 'llama3.2:3b');
      const provider = groqAvailable ? 'Groq API (fast, sub-second)' : 'Ollama (free, local)';

      // Respond immediately - processing will start in background
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      logger.info('[Process Recipes API] Processing request received, responding immediately', {
        requestId,
        limit,
        provider,
        model: selectedModel,
        groqEnabled,
        groqAvailable,
      });

      // Start background processing
      setImmediate(async () => {
        try {
          logger.info('[Process Recipes API] Starting background processing', {
            requestId,
            limit,
            model: selectedModel,
            provider,
            groqEnabled,
            groqAvailable,
          });

          await processor.processRecipes({
            limit,
            model: selectedModel,
          });

          logger.info('[Process Recipes API] Background processing completed', { requestId });
        } catch (err) {
          logger.error('[Process Recipes API] Background processing failed:', {
            requestId,
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          });
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: `Processing started in background (using ${provider})`,
          data: {
            provider,
            model: selectedModel,
            groqEnabled,
            groqAvailable,
            note: groqAvailable
              ? 'Using Groq API for fast processing (sub-second responses). Monitor usage at https://console.groq.com/'
              : groqEnabled
                ? 'Groq enabled but not available. Using Ollama fallback (free, local). Make sure Ollama is running: "ollama serve"'
                : 'Using Ollama (free, local). Enable Groq by setting USE_GROQ=true and GROQ_API_KEY=your-key for faster processing. See: docs/GROQ_SETUP_GUIDE.md',
          },
        },
        { status: 202 }, // 202 Accepted for background processing
      );
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
