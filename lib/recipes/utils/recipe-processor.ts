/**
 * Recipe Processor (Migrated from scripts)
 * Processes and formats scraped recipes using AI
 */

import { generateTextWithGroq, isGroqAvailable, isGroqEnabled } from '@/lib/ai/groq-client';
import { isRecipeFormatted } from '@/lib/utils/recipe-format-detection';
import { JSONStorage } from '../storage/json-storage';
import { ScrapedRecipe } from '../types';
import { scraperLogger } from './logger';

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
let processingStartTime: Date | null = null;
let lastProgressTime: Date | null = null;
let consecutiveErrors = 0;

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

async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function generateTextWithOllama(
  prompt: string,
  options: { model?: string; timeout?: number } = {},
): Promise<{ response: string }> {
  const model = options.model || 'llama3.2:3b';
  const timeout = options.timeout || 90000;
  const apiUrl = 'http://localhost:11434/api/generate';
  const systemPrompt =
    'You are a precise recipe formatter. Always respond with valid JSON only, no markdown, no explanations. Follow all conversion rules strictly.\n\n';
  const enhancedPrompt = systemPrompt + prompt;

  try {
    scraperLogger.debug('[Ollama] Generating text', { model, timeout });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: enhancedPrompt,
        stream: false,
        options: { temperature: 0.3, num_predict: -1, top_p: 0.9, top_k: 40 },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return { response: result.response || '' };
  } catch (err) {
    throw err;
  }
}

function buildUnitConversionGuide(): string {
  return `## UNIT CONVERSION GUIDE (Reference - Follow Strictly)\n\n**CRITICAL RULES:**\n1. **NEVER show imperial units**\n2. **Metric units only**\n3. **Natural units in brackets**\n4. **Solids vs Liquids**\n\n**CONVERSION EXAMPLES:**\n- "1 cup butter" → "225g butter"\n- "1 bunch cilantro" → "15g (1 bunch) fresh cilantro"`;
}

function buildFormattingPrompt(recipe: ScrapedRecipe): string {
  const unitGuide = buildUnitConversionGuide();
  const ingredients = recipe.ingredients
    .map(ing =>
      typeof ing === 'string'
        ? ing
        : ing.original_text || `${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`.trim(),
    )
    .join('\n');
  const instructions = recipe.instructions.join('\n');

  return `${unitGuide}\n\n---\n\n## RECIPE FORMATTING TASK\n\nRecipe Name: ${recipe.recipe_name}\nIngredients:\n${ingredients}\n\nInstructions:\n${instructions}\n\nReturn ONLY valid JSON.`;
}

export async function processSingleRecipe(
  recipe: ScrapedRecipe,
  options: { model?: string; timeout?: number } = {},
): Promise<ScrapedRecipe> {
  const prompt = buildFormattingPrompt(recipe);
  let processedText = '';
  let processedBy = 'unknown';

  const groqEnabled = isGroqEnabled();
  let groqAvailable = groqEnabled ? await isGroqAvailable() : false;

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

  let formattedRecipe: Partial<ScrapedRecipe> = JSON.parse(
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
