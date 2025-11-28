/**
 * AI generation utilities for recipe cards with retry logic.
 */

import { generateAIResponse } from '@/lib/ai/ai-service';
import type { AIChatMessage } from '@/lib/ai/types';
import { logger } from '@/lib/logger';

/**
 * Generate AI response with exponential backoff retry logic
 * Handles rate limits and temporary failures gracefully
 */
export async function generateAIResponseWithRetry(
  prompt: string,
  maxRetries = 3,
  initialDelay = 2000,
): Promise<{ content: string; error?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      logger.dev(`[generateAIResponseWithRetry] Attempt ${attempt + 1}/${maxRetries + 1}`);

      // Convert prompt string to AIChatMessage format
      const messages: AIChatMessage[] = [{ role: 'user', content: prompt }];
      const result = await generateAIResponse(messages, 'AU'); // Default to Australia

      if (result.content && result.content.trim().length > 0) {
        logger.dev(`[generateAIResponseWithRetry] ✅ Success on attempt ${attempt + 1}`);
        return { content: result.content };
      }

      if (result.error) {
        const errorMessage = result.error.toLowerCase();
        logger.dev(`[generateAIResponseWithRetry] AI returned error: ${result.error}`);

        // Check for billing/account errors - don't retry these
        if (
          errorMessage.includes('account is not active') ||
          errorMessage.includes('billing') ||
          errorMessage.includes('payment') ||
          errorMessage.includes('subscription') ||
          errorMessage.includes('insufficient_quota')
        ) {
          logger.error('AI account billing issue detected - not retrying:', {
            error: result.error,
            attempt: attempt + 1,
          });
          return { content: '', error: result.error };
        }

        // Retry on rate limit errors only
        if (errorMessage.includes('rate limit') && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
          logger.warn(
            `Rate limit error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Don't retry on other errors or if we've exhausted retries
        return { content: '', error: result.error };
      }

      // No content and no error - this is unusual
      logger.warn(`AI returned no content and no error on attempt ${attempt + 1}`);
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        logger.dev(`Retrying in ${delay}ms due to empty response`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return { content: '', error: 'AI service returned no content and no error message' };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message.toLowerCase();

      logger.dev(`AI call exception on attempt ${attempt + 1}:`, {
        error: lastError.message,
        stack: lastError.stack,
        errorType: error?.constructor?.name,
      });

      // Check for billing/account errors - don't retry these
      if (
        errorMessage.includes('account is not active') ||
        errorMessage.includes('billing') ||
        errorMessage.includes('payment') ||
        errorMessage.includes('subscription') ||
        errorMessage.includes('insufficient_quota')
      ) {
        logger.error('AI account billing issue detected - not retrying:', {
          error: lastError.message,
          attempt: attempt + 1,
        });
        return { content: '', error: lastError.message };
      }

      // Retry on rate limit errors only
      if (errorMessage.includes('rate limit') && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
        logger.warn(
          `Rate limit error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Don't retry on other errors or if we've exhausted retries
      return { content: '', error: lastError.message };
    }
  }

  return { content: '', error: lastError?.message || 'Max retries exceeded' };
}
