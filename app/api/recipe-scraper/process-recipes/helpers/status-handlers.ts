/**
 * Status handling helpers for recipe processing
 */

import { logger } from '@/lib/logger';
import { isGroqEnabled, isGroqAvailable } from '@/lib/ai/groq-client';

// Use any for status since it comes from the processor module
type ProcessingStatus = any;

/**
 * Get default status when processor fails
 */
export function getDefaultStatus(): ProcessingStatus {
  return {
    isProcessing: false,
    isPaused: false,
    queueLength: 0,
    activeProcessing: 0,
    totalProcessed: 0,
    totalRecipes: 0,
    progressPercent: 0,
    isStuck: false,
    healthStatus: 'healthy',
    aiProvider: 'Unknown',
    aiProviderModel: 'Unknown',
  };
}

/**
 * Enhance status with provider information and unformatted counts
 */
export async function enhanceProcessingStatus(
  status: ProcessingStatus,
  processor: {
    getProcessingStatus: () => any;
    countUnformattedRecipes: () => Promise<{ unformatted: number; formatted: number }>;
  },
): Promise<ProcessingStatus> {
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

  return status;
}

/**
 * Get provider information for status response
 */
export async function getProviderInfo() {
  const groqEnabled = isGroqEnabled();
  const groqAvailable = groqEnabled ? await isGroqAvailable() : false;

  return {
    groqEnabled,
    groqAvailable,
    ollamaRecommended: !groqAvailable,
    note: groqAvailable
      ? 'Using Groq API (fast, sub-second responses)'
      : groqEnabled
        ? 'Groq enabled but not available. Using Ollama fallback (free, local).'
        : 'Using Ollama (free, local). Enable Groq by setting USE_GROQ=true and GROQ_API_KEY=your-key for faster processing.',
  };
}
