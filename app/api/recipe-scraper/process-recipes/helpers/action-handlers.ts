/**
 * Action handlers for recipe processing
 */

import { logger } from '@/lib/logger';
import { isGroqEnabled, isGroqAvailable } from '@/lib/ai/groq-client';

// Processor module exports functions directly (not as an object)
type Processor = unknown;

/**
 * Handle pause action
 */
export function handlePauseAction(processor: Processor) {
  processor.pauseProcessing();
  const status = processor.getProcessingStatus();
  return {
    success: true,
    message: 'Processing paused',
    data: status,
  };
}

/**
 * Handle resume action
 */
export function handleResumeAction(processor: Processor) {
  processor.resumeProcessing();
  const status = processor.getProcessingStatus();
  return {
    success: true,
    message: 'Processing resumed',
    data: status,
  };
}

/**
 * Handle stop action
 */
export function handleStopAction(processor: Processor) {
  processor.stopProcessing();
  const status = processor.getProcessingStatus();
  return {
    success: true,
    message: 'Processing stopped',
    data: status,
  };
}

/**
 * Handle start action - starts background processing
 */
export async function handleStartAction(
  processor: Processor,
  limit?: number,
  model?: string,
): Promise<{ success: boolean; message: string; data: unknown; status?: number }> {
  // Check if already processing
  const currentStatus = processor.getProcessingStatus();
  if (currentStatus.isProcessing && !currentStatus.isPaused) {
    return {
      success: false,
      message: 'Processing is already in progress',
      data: currentStatus,
    };
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

  return {
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
    status: 202, // 202 Accepted for background processing
  };
}
