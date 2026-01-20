import { processIngredientBatch } from './processIngredientBatch';

export interface BatchProcessingResult {
  successful: number;
  failed: number;
  results: Array<{
    ingredient_id: string;
    ingredient_name: string;
    status: 'success' | 'failed' | 'skipped';
    allergens?: string[];
    method?: string;
    error?: string;
  }>;
}

export async function processAllBatches(
  ingredientsToProcess: any[],
  batchSize: number,
  forceAi: boolean,
): Promise<BatchProcessingResult> {
  const finalResults: BatchProcessingResult = {
    successful: 0,
    failed: 0,
    results: [],
  };

  for (let i = 0; i < ingredientsToProcess.length; i += batchSize) {
    const batch = ingredientsToProcess.slice(i, i + batchSize);
    const batchResult = await processIngredientBatch(batch, forceAi);

    finalResults.results.push(...batchResult.results);
    finalResults.successful += batchResult.successful;
    finalResults.failed += batchResult.failed;

    await new Promise(resolve => setTimeout(resolve, 200));
    if (i + batchSize < ingredientsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return finalResults;
}
