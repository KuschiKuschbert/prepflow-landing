/**
 * Recipe Processor (Migrated from scripts)
 * Processes and formats scraped recipes using AI
 */
import { generateTextWithGroq, isGroqAvailable, isGroqEnabled } from '@/lib/ai/groq-client';
import { isRecipeFormatted } from '@/lib/utils/recipe-format-detection';
import { JSONStorage } from '../storage/json-storage';
import { ScrapedRecipe } from '../types';
import { buildFormattingPrompt, generateTextWithOllama } from './recipe-processor/helpers';

// Processing status
interface ProcessingStatus {
  isProcessing: boolean;
  isPaused: boolean;
  queueLength: number;
  activeProcessing: number;
  totalProcessed: number;
  totalRecipes: number;
  skippedFormatted?: number;
  progressPercent: number;
  aiProvider?: string;
  aiProviderModel?: string;
  lastError?: string;
  lastProcessedRecipe?: string;
  isStuck: boolean;
  stuckReason?: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  processingDuration?: number;
  startedAt?: string;
}

let globalProcessingStatus: ProcessingStatus = {
  isProcessing: false,
  isPaused: false,
  queueLength: 0,
  activeProcessing: 0,
  totalProcessed: 0,
  totalRecipes: 0,
  progressPercent: 0,
  isStuck: false,
  healthStatus: 'healthy',
};

const _processingQueue: ScrapedRecipe[] = [];
const currentlyProcessing: Set<string> = new Set();
const processingStartTime: Date | null = null;
let lastProgressTime: Date | null = null;
const consecutiveErrors = 0;

export function getProcessingStatus(): ProcessingStatus {
  if (globalProcessingStatus.isProcessing && processingStartTime) {
    const duration = Math.floor((Date.now() - processingStartTime.getTime()) / 1000);
    globalProcessingStatus.processingDuration = duration;
  }

  if (globalProcessingStatus.isProcessing && lastProgressTime) {
    const timeSinceProgress = Date.now() - lastProgressTime.getTime();
    if (timeSinceProgress > 5 * 60 * 1000) {
      globalProcessingStatus.isStuck = true;
      globalProcessingStatus.stuckReason = 'No progress for 5+ minutes';
      globalProcessingStatus.healthStatus = 'error';
    }
  }

  return { ...globalProcessingStatus };
}

function updateStatus(updates: Partial<ProcessingStatus>): void {
  globalProcessingStatus = { ...globalProcessingStatus, ...updates };
  lastProgressTime = new Date();
}

export async function processSingleRecipe(
  recipe: ScrapedRecipe,
  options: { model?: string; timeout?: number } = {},
): Promise<ScrapedRecipe> {
  const prompt = buildFormattingPrompt(recipe);
  let processedText = '';
  let processedBy = 'unknown';

  const groqEnabled = isGroqEnabled();
  const groqAvailable = groqEnabled ? await isGroqAvailable() : false;

  if (groqAvailable) {
    processedBy = 'groq';
    try {
      const result = await generateTextWithGroq(prompt, {
        model: options.model || 'llama-3.1-8b-instant',
        timeout: options.timeout || 30000,
        temperature: 0.3,
        responseFormat: 'json_object',
      });
      processedText = result.response;
    } catch (e) {
      processedBy = 'ollama';
      const result = await generateTextWithOllama(prompt, options);
      processedText = result.response;
    }
  } else {
    processedBy = 'ollama';
    const result = await generateTextWithOllama(prompt, options);
    processedText = result.response;
  }

  const formattedRecipe: Partial<ScrapedRecipe> = JSON.parse(
    processedText.replace(/^```json\s*/, '').replace(/\s*```$/, ''),
  );

  return {
    ...recipe,
    ...formattedRecipe,
    updated_at: new Date().toISOString(),
  } as ScrapedRecipe;
}

export async function processRecipes(
  options: { limit?: number; model?: string; batchSize?: number; concurrency?: number } = {},
): Promise<any> {
  const storage = new JSONStorage();
  const recipes = storage.getAllRecipes().slice(0, options.limit);
  const results = [];

  for (const entry of recipes) {
    const recipe = await storage.loadRecipe(entry.file_path);
    if (recipe && !isRecipeFormatted(recipe)) {
      const processed = await processSingleRecipe(recipe, options);
      await storage.saveRecipe(processed);
      results.push(processed);
    }
  }
  return { totalProcessed: results.length };
}

export function pauseProcessing(): void {
  updateStatus({ isPaused: true });
}
export function resumeProcessing(): void {
  updateStatus({ isPaused: false });
}
export function stopProcessing(): void {
  updateStatus({ isProcessing: false, queueLength: 0 });
  currentlyProcessing.clear();
}

export { isRecipeFormatted };
