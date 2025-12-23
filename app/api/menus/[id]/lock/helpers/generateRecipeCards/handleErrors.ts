/**
 * Error handling and reporting for recipe card generation
 */

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { MenuItem } from './fetchMenuItems';

export function handleGenerationErrors(
  successCount: number,
  errorCount: number,
  skippedCount: number,
  itemsToProcess: MenuItem[],
  totalItems: number,
  reusedCount: number,
  errors: string[],
): void {
  const hasBillingError = errors.some(
    err =>
      err.toLowerCase().includes('account is not active') ||
      err.toLowerCase().includes('billing') ||
      err.toLowerCase().includes('payment') ||
      err.toLowerCase().includes('subscription'),
  );

  if (successCount === 0 && itemsToProcess.length > 0) {
    let errorMessage: string;
    if (hasBillingError) {
      errorMessage = `Failed to generate recipe cards: Hugging Face API issue detected. Please check your HUGGINGFACE_API_KEY and ensure the account is active. This is not a rate limit issue - the API key needs to be valid.`;
    } else {
      errorMessage = `Failed to generate any recipe cards. Processed ${itemsToProcess.length} items: ${successCount} succeeded, ${errorCount} errors, ${skippedCount} skipped.${errors.length > 0 ? ` First error: ${errors[0]}` : ' No errors logged - items may have been skipped silently (check if dishes/recipes have ingredients).'}`;
    }
    logger.error(errorMessage, {
      successCount,
      errorCount,
      skippedCount,
      totalItems,
      sampleErrors: errors.slice(0, 3),
      hasBillingError,
    });
    throw ApiErrorHandler.createError(errorMessage, 'GENERATION_ERROR', 500);
  }

  logger.dev(`Finished generating recipe cards`, {
    reusedCount,
    successCount,
    errorCount,
    skippedCount,
    totalItems,
    regeneratedItems: itemsToProcess.length,
    reusedItems: reusedCount,
    errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
  });
}
