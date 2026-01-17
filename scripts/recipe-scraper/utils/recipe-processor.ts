/**
 * Recipe Processor
 * Processes and formats scraped recipes using AI
 * PRIMARY: Groq API (fastest free option - sub-second responses, 500+ tokens/sec)
 * FALLBACK: Ollama (completely free, local processing)
 * GEMINI REMOVED: Using only Groq/Ollama to prevent expensive API costs
 */

import { generateTextWithGroq, isGroqAvailable, isGroqEnabled } from '@/lib/ai/groq-client';
import { parseAIError } from '@/lib/ai/utils/errorParser';
import { isRecipeFormatted } from '@/lib/utils/recipe-format-detection';
import { ScrapedRecipe } from '../parsers/types';
import { JSONStorage } from '../storage/json-storage';
import { scraperLogger } from './logger';

// Processing status (shared across all processing operations)
interface ProcessingStatus {
  isProcessing: boolean;
  isPaused: boolean;
  queueLength: number;
  activeProcessing: number;
  totalProcessed: number;
  totalRecipes: number;
  skippedFormatted?: number; // Number of recipes skipped because already formatted
  progressPercent: number;
  aiProvider?: string;
  aiProviderModel?: string;
  lastError?: string;
  lastProcessedRecipe?: string;
  isStuck: boolean;
  stuckReason?: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  processingDuration?: number; // in seconds
  startedAt?: string;
}

// Global processing status (in-memory, can be enhanced with Redis/file later)
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

// Processing queue and state
let processingQueue: ScrapedRecipe[] = [];
const currentlyProcessing: Set<string> = new Set();
let processingStartTime: Date | null = null;
let lastProgressTime: Date | null = null;
let consecutiveErrors = 0;

/**
 * Get current processing status
 */
export function getProcessingStatus(): ProcessingStatus {
  // Update duration if processing
  if (globalProcessingStatus.isProcessing && processingStartTime) {
    const duration = Math.floor((Date.now() - processingStartTime.getTime()) / 1000);
    globalProcessingStatus.processingDuration = duration;
  }

  // Check for stuck processing
  if (globalProcessingStatus.isProcessing && lastProgressTime) {
    const timeSinceProgress = Date.now() - lastProgressTime.getTime();
    if (timeSinceProgress > 5 * 60 * 1000) {
      // 5 minutes with no progress
      globalProcessingStatus.isStuck = true;
      globalProcessingStatus.stuckReason = 'No progress for 5+ minutes';
      globalProcessingStatus.healthStatus = 'error';
    }
  }

  return { ...globalProcessingStatus };
}

/**
 * Update processing status
 */
function updateStatus(updates: Partial<ProcessingStatus>): void {
  globalProcessingStatus = { ...globalProcessingStatus, ...updates };
  lastProgressTime = new Date();
}

/**
 * Check if Ollama is available
 */
async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate text with Ollama (optimized for structured JSON output)
 * Uses best practices: lower temperature for deterministic JSON, system prompt for structure, extended timeout
 */
async function generateTextWithOllama(
  prompt: string,
  options: { model?: string; timeout?: number } = {},
): Promise<{ response: string }> {
  // Model selection: Prefer models optimized for structured output
  // llama3.2:3b and qwen2.5:3b are better for JSON tasks, fallback to phi3:mini
  // These models handle structured output (JSON) better than phi3:mini
  const model = options.model || 'llama3.2:3b';
  const timeout = options.timeout || 90000; // 90 seconds (Ollama local can be slower, especially for complex recipes)

  const apiUrl = 'http://localhost:11434/api/generate';

  // System prompt to emphasize JSON output requirement (best practice for structured outputs)
  // Note: Integrated into prompt for compatibility (some Ollama versions don't support options.system)
  // This ensures consistent JSON output across all Ollama versions
  const systemPrompt =
    'You are a precise recipe formatter. Always respond with valid JSON only, no markdown, no explanations. Follow all conversion rules strictly.\n\n';
  const enhancedPrompt = systemPrompt + prompt; // Prepend system prompt for maximum compatibility

  try {
    scraperLogger.debug('[Ollama] Generating text with model:', {
      model,
      promptLength: prompt.length,
      enhancedPromptLength: enhancedPrompt.length,
      timeout,
      temperature: 0.3, // Low temperature for deterministic JSON output
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Ollama API parameters optimized for structured JSON output (per Ollama best practices)
    // Reference: https://docs.ollama.com/
    // - temperature: 0.3 (low = deterministic, better for JSON output)
    // - num_predict: -1 (unlimited, recipes can vary significantly in length)
    // - top_p/top_k: Sampling parameters for consistency (best practice for structured output)
    // - system prompt: Integrated into main prompt for compatibility across all Ollama versions
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: enhancedPrompt, // Enhanced prompt with system instructions (compatible with all Ollama versions)
        stream: false, // Non-streaming for simpler response handling
        options: {
          temperature: 0.3, // Low temperature = deterministic JSON output (best practice: 0.3-0.5 for structured data)
          num_predict: -1, // Unlimited output length (recipes can vary significantly)
          top_p: 0.9, // Nucleus sampling (good balance for consistent JSON)
          top_k: 40, // Limit vocabulary choices for consistency in structured output
          // num_ctx: Uses model default (usually 4096 for 3B models, sufficient for recipe prompts)
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      scraperLogger.error('[Ollama] API error response:', {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const responseText = result.response || '';

    if (!responseText) {
      throw new Error(
        'Empty response from Ollama - model may not be loaded. Run: ollama pull ' + model,
      );
    }

    // Log performance metrics if available
    if (result.eval_count) {
      scraperLogger.debug('[Ollama] Generation complete:', {
        responseLength: responseText.length,
        evalCount: result.eval_count,
        evalDuration: result.eval_duration,
        totalDuration: result.total_duration,
      });
    } else {
      scraperLogger.debug('[Ollama] Text generated successfully:', {
        responseLength: responseText.length,
      });
    }

    return { response: responseText };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    // Enhanced error messages for common Ollama issues
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      throw new Error(
        'Ollama is not running. Please start Ollama: "ollama serve" (or "ollama run ' +
          model +
          '" to pull and start).',
      );
    }

    if (error.message.includes('404') || error.message.includes('model not found')) {
      throw new Error(
        `Model "${model}" not found. Please pull the model: "ollama pull ${model}". Recommended models: llama3.2:3b, qwen2.5:3b, or phi3:mini`,
      );
    }

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new Error(
        `Ollama request timed out after ${timeout}ms. Try: (1) Use a faster model like "phi3:mini", (2) Increase timeout, (3) Check system resources with "ollama ps"`,
      );
    }

    scraperLogger.error('[Ollama] Error generating text:', {
      error: error.message,
      model,
      timeout,
    });
    throw error;
  }
}

/**
 * Build unit conversion guide (Prompt Section 1 - Reference)
 * This guide provides comprehensive rules for unit conversion that must be followed strictly
 */
function buildUnitConversionGuide(): string {
  return `## UNIT CONVERSION GUIDE (Reference - Follow Strictly)

**CRITICAL RULES:**
1. **NEVER show imperial units** - Always convert cups, tablespoons, ounces, pounds, etc. to metric
2. **Metric units only** - Use g, kg, mg for weight; ml, l for volume
3. **Natural units in brackets** - For natural units (bunch, piece, head, clove, bulb), show metric weight first, then natural unit in brackets: "15g (1 bunch) fresh cilantro"
4. **Solids vs Liquids:** Determine unit type from ingredient name:
   - **Solids** (butter, flour, sugar, chocolate, cheese, meat, nuts) → Use weight (g, kg, mg)
   - **Liquids** (cream, milk, oil, water, vinegar, wine, juice) → Use volume (ml, l)

**CHEF NORMAL ROUNDING (Practical Kitchen Increments):**
- < 5: Round to nearest 1 or 0.5 (1.2ml → 1ml, 2.8ml → 3ml, 0.7g → 1g)
- 5-50: Round to nearest 5 or 10 (44.77ml → 50ml, 14.79g → 15g, 23.4ml → 25ml, 7.2g → 7g)
- 50-100: Round to nearest 10 (78.5ml → 80ml, 67.3g → 70g, 96ml → 100ml)
- 100-500: Round to nearest 20 (453.59g → 460g, 236.5ml → 240ml, 127g → 140g, 383g → 380g)
- > 500: Round to nearest 50 or 100 (673g → 650g or 700g, 987ml → 1000ml)

**CONVERSION EXAMPLES:**
- "1 cup butter" → "225g butter" (solid → weight, no bracket needed)
- "1 cup cream" → "240ml cream" (liquid → volume, no bracket needed)
- "1 bunch cilantro" → "15g (1 bunch) fresh cilantro" (natural unit → metric + bracket)
- "2 pieces garlic" → "6g (2 cloves) garlic" (natural unit → metric + bracket)
- "1 head lettuce" → "500g (1 head) lettuce" (natural unit → metric + bracket)
- "2.84oz chocolate" → "80g chocolate" (imperial → metric, no bracket)
- "1 lb flour" → "450g flour" (imperial → metric, no bracket)
- "44.77ml olive oil" → "50ml olive oil" (round to nearest 5)
- "236.5ml milk" → "240ml milk" (round to nearest 20)
- "453.59g flour" → "460g flour" (round to nearest 20)

**NATURAL UNITS (Show in brackets only):**
- bunch, piece/pieces, head, clove/cloves, bulb
- When original recipe uses natural unit, convert to metric weight/volume and show natural unit in brackets
- Example: "1 bunch parsley" → "15g (1 bunch) fresh parsley"`;
}

/**
 * Build formatting prompt for recipe (Prompt Section 2 - Task)
 * Uses two-section structure with explicit cross-reference to Unit Conversion Guide
 */
function buildFormattingPrompt(recipe: ScrapedRecipe): string {
  const unitGuide = buildUnitConversionGuide();
  const ingredients = recipe.ingredients
    .map(ing => {
      if (typeof ing === 'string') return ing;
      return ing.original_text || `${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`.trim();
    })
    .join('\n');

  const instructions = recipe.instructions.join('\n');

  return `${unitGuide}

---

## RECIPE FORMATTING TASK

**IMPORTANT:** You have access to the **Unit Conversion Guide** above. **Refer to it strictly** for all unit conversions.

Recipe Name: ${recipe.recipe_name}
${recipe.description ? `Description: ${recipe.description}` : ''}

Ingredients:
${ingredients}

Instructions:
${instructions}

${recipe.yield ? `Yield: ${recipe.yield} ${recipe.yield_unit || 'servings'}` : ''}
${recipe.prep_time_minutes ? `Prep Time: ${recipe.prep_time_minutes} minutes` : ''}
${recipe.cook_time_minutes ? `Cook Time: ${recipe.cook_time_minutes} minutes` : ''}
${recipe.temperature_celsius ? `Temperature: ${recipe.temperature_celsius}°C` : ''}
${recipe.category ? `Category: ${recipe.category}` : ''}
${recipe.cuisine ? `Cuisine: ${recipe.cuisine}` : ''}

**YOUR TASK:**
Format this recipe into clean JSON. **CRITICALLY:** Follow the Unit Conversion Guide above for ALL ingredient conversions:
- Convert ALL imperial units to metric (refer to guide)
- Round quantities using chef normal increments (refer to guide)
- For natural units (bunch, piece, head), show metric first, then natural unit in brackets (refer to guide)

Format into JSON structure with:
- recipe_name: Clean, properly capitalized recipe name
- description: Clear, concise description (if provided)
- ingredients: Array of ingredient objects with {name, quantity, unit, notes, original_text}
  - **quantity**: Converted and rounded using guide rules
  - **unit**: Metric unit (g, kg, mg, ml, l) from guide
  - **name**: Ingredient name with natural unit in brackets if applicable (e.g., "fresh cilantro (1 bunch)")
- instructions: Array of clear, numbered step-by-step instructions
- yield: Number of servings
- yield_unit: Unit (servings, portions, etc.)
- prep_time_minutes: Prep time in minutes
- cook_time_minutes: Cook time in minutes
- total_time_minutes: Total time in minutes
- temperature_celsius: Cooking temperature in Celsius
- category: Recipe category
- cuisine: Cuisine type
- dietary_tags: Array of dietary tags

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;
}

/**
 * Process a single recipe with AI
 * PRIMARY: Groq API (fast, sub-second responses)
 * FALLBACK: Ollama (free, local processing)
 */
export async function processSingleRecipe(
  recipe: ScrapedRecipe,
  options: {
    model?: string;
    timeout?: number;
  } = {},
): Promise<ScrapedRecipe> {
  const prompt = buildFormattingPrompt(recipe);
  let processedText = '';
  let processedBy = 'unknown';

  const ingredientsCount = recipe.ingredients.length;
  const instructionsCount = recipe.instructions.length;

  // Try Groq first (if enabled)
  const groqEnabled = isGroqEnabled();
  let groqAvailable = false;

  if (groqEnabled) {
    try {
      groqAvailable = await isGroqAvailable();
    } catch (error) {
      scraperLogger.warn(
        '[Recipe Processor] Groq availability check failed, using Ollama fallback:',
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      groqAvailable = false;
    }
  }

  // Use Groq if available and enabled
  if (groqAvailable) {
    processedBy = 'groq';
    const timeout = options.timeout || 30000; // 30 seconds (Groq is fast, sub-second typically)

    try {
      scraperLogger.debug(
        '[Recipe Processor] Using Groq API for recipe processing (fast, sub-second)',
        {
          model: options.model || 'llama-3.1-8b-instant',
          timeout,
        },
      );

      const result = await generateTextWithGroq(prompt, {
        model: options.model || 'llama-3.1-8b-instant',
        timeout,
        temperature: 0.3,
        responseFormat: 'json_object',
      });
      processedText = result.response;
    } catch (groqError) {
      const error = groqError instanceof Error ? groqError : new Error(String(groqError));
      scraperLogger.warn('[Recipe Processor] Groq processing failed, falling back to Ollama:', {
        error: error.message,
      });

      // Fallback to Ollama if Groq fails
      const ollamaAvailable = await isOllamaAvailable();
      if (!ollamaAvailable) {
        throw new Error(
          `Groq processing failed and Ollama is not available. Groq error: ${error.message}. ` +
            'Please start Ollama (localhost:11434) for fallback processing. Run: "ollama serve" (or "ollama run llama3.2:3b" to pull and start).',
        );
      }

      // Fallback to Ollama
      processedBy = 'ollama';
      const ollamaTimeout = options.timeout || 90000; // 90 seconds (local processing needs more time)

      scraperLogger.debug('[Recipe Processor] Using Ollama fallback (cost-free, local)', {
        model: options.model || 'llama3.2:3b',
        timeout: ollamaTimeout,
      });

      const result = await generateTextWithOllama(prompt, {
        model: options.model || 'llama3.2:3b',
        timeout: ollamaTimeout,
      });
      processedText = result.response;
    }
  } else {
    // Use Ollama (fallback or if Groq disabled)
    processedBy = 'ollama';
    const ollamaAvailable = await isOllamaAvailable();

    if (!ollamaAvailable) {
      if (groqEnabled) {
        throw new Error(
          'Groq is enabled but not available, and Ollama is also not available. ' +
            'Please either: (1) Set up Groq API key (USE_GROQ=true, GROQ_API_KEY=your-key) or ' +
            '(2) Start Ollama for free local processing (ollama serve). ' +
            'See: docs/GROQ_SETUP_GUIDE.md or docs/OLLAMA_SETUP_GUIDE.md',
        );
      } else {
        throw new Error(
          'Ollama is not available. Please start Ollama (localhost:11434) for free processing. ' +
            'Run: "ollama serve" (or "ollama run llama3.2:3b" to pull and start). ' +
            'Alternatively, enable Groq API by setting USE_GROQ=true and GROQ_API_KEY=your-key. ' +
            'See: docs/OLLAMA_SETUP_GUIDE.md or docs/GROQ_SETUP_GUIDE.md',
        );
      }
    }

    const timeout = options.timeout || 90000; // 90 seconds (local processing needs more time)

    try {
      scraperLogger.debug(
        '[Recipe Processor] Using Ollama for recipe processing (cost-free, local)',
        {
          model: options.model || 'llama3.2:3b',
          timeout,
        },
      );

      const result = await generateTextWithOllama(prompt, {
        model: options.model || 'llama3.2:3b',
        timeout,
      });
      processedText = result.response;
    } catch (ollamaError) {
      const error = ollamaError instanceof Error ? ollamaError : new Error(String(ollamaError));
      scraperLogger.error(
        `[Recipe Processor] Failed to process recipe with Ollama: ${recipe.recipe_name}`,
        {
          error: error.message,
          ingredientsCount,
          instructionsCount,
          timeout,
        },
      );
      throw error;
    }
  }

  // Parse JSON response (common for both Groq and Ollama)
  let formattedRecipe: Partial<ScrapedRecipe>;
  try {
    // Try to extract JSON from response (handle markdown code blocks)
    let jsonText = processedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Try to repair common JSON issues
    jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'); // Remove trailing commas

    formattedRecipe = JSON.parse(jsonText);
  } catch (parseError) {
    scraperLogger.error('[Recipe Processor] Failed to parse AI response as JSON:', {
      error: parseError instanceof Error ? parseError.message : String(parseError),
      responsePreview: processedText.substring(0, 500),
      processedBy,
    });
    throw new Error(
      `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
    );
  }

  // Merge formatted data with original recipe (preserve original fields)
  const processedRecipe: ScrapedRecipe = {
    ...recipe,
    recipe_name: formattedRecipe.recipe_name || recipe.recipe_name,
    description: formattedRecipe.description || recipe.description,
    ingredients: formattedRecipe.ingredients || recipe.ingredients,
    instructions: formattedRecipe.instructions || recipe.instructions,
    yield: formattedRecipe.yield || recipe.yield,
    yield_unit: formattedRecipe.yield_unit || recipe.yield_unit,
    prep_time_minutes: formattedRecipe.prep_time_minutes || recipe.prep_time_minutes,
    cook_time_minutes: formattedRecipe.cook_time_minutes || recipe.cook_time_minutes,
    total_time_minutes: formattedRecipe.total_time_minutes || recipe.total_time_minutes,
    temperature_celsius: formattedRecipe.temperature_celsius || recipe.temperature_celsius,
    category: formattedRecipe.category || recipe.category,
    cuisine: formattedRecipe.cuisine || recipe.cuisine,
    dietary_tags: formattedRecipe.dietary_tags || recipe.dietary_tags,
    updated_at: new Date().toISOString(),
  };

  scraperLogger.info(
    `[Recipe Processor] Successfully processed recipe: ${recipe.recipe_name} (${processedBy})`,
    {
      recipeId: recipe.id,
      ingredientsCount,
      instructionsCount,
      processedBy,
    },
  );

  return processedRecipe;
}

/**
 * Process batch of recipes with concurrency control
 */
async function processBatchWithConcurrency(
  recipes: ScrapedRecipe[],
  options: {
    model?: string;
    concurrency?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {},
): Promise<{
  processed: ScrapedRecipe[];
  failed: Array<{ recipe: ScrapedRecipe; error: string }>;
}> {
  // Use lower concurrency for Ollama (local, slower processing)
  // Optimized for local processing (5 concurrent requests by default)
  const concurrency = options.concurrency || 5;
  const processed: ScrapedRecipe[] = [];
  const failed: Array<{ recipe: ScrapedRecipe; error: string }> = [];
  let currentIndex = 0;

  const processNext = async (): Promise<void> => {
    while (currentIndex < recipes.length) {
      if (globalProcessingStatus.isPaused) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait while paused
        continue;
      }

      const recipe = recipes[currentIndex++];
      const recipeId = recipe.id;

      if (currentlyProcessing.has(recipeId)) {
        continue; // Skip if already processing
      }

      currentlyProcessing.add(recipeId);
      updateStatus({ activeProcessing: currentlyProcessing.size });

      try {
        const processedRecipe = await processSingleRecipe(recipe, {
          model: options.model,
        });

        processed.push(processedRecipe);
        updateStatus({
          totalProcessed: globalProcessingStatus.totalProcessed + 1,
          lastProcessedRecipe: recipe.recipe_name,
          lastError: undefined, // Clear error on success
        });

        consecutiveErrors = 0; // Reset error counter on success

        if (options.onProgress) {
          options.onProgress(processed.length + failed.length, recipes.length);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        const aiError = parseAIError(err instanceof Error ? err : new Error(error));

        failed.push({ recipe, error });

        consecutiveErrors++;
        updateStatus({
          lastError: error,
          healthStatus:
            consecutiveErrors > 3 ? 'error' : consecutiveErrors > 1 ? 'warning' : 'healthy',
        });

        scraperLogger.warn(`[Recipe Processor] Failed to process recipe: ${recipe.recipe_name}`, {
          error,
          type: aiError.type,
          retryable: aiError.retryable,
        });

        // If rate limited, reduce concurrency and wait
        if (aiError.type === 'RATE_LIMITED') {
          scraperLogger.warn(
            '[Recipe Processor] Rate limit hit, reducing concurrency and waiting...',
          );
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        }
      } finally {
        currentlyProcessing.delete(recipeId);
        updateStatus({ activeProcessing: currentlyProcessing.size });
      }
    }
  };

  // Start concurrent processing
  const workers = Array.from({ length: concurrency }, () => processNext());
  await Promise.all(workers);

  return { processed, failed };
}

/**
 * Retry failed recipes with exponential backoff
 */
async function retryFailedRecipes(
  failed: Array<{ recipe: ScrapedRecipe; error: string }>,
  options: {
    model?: string;
    maxRetries?: number;
  } = {},
): Promise<{
  processed: ScrapedRecipe[];
  stillFailed: Array<{ recipe: ScrapedRecipe; error: string }>;
}> {
  const maxRetries = options.maxRetries || 3;
  const processed: ScrapedRecipe[] = [];
  const stillFailed: Array<{ recipe: ScrapedRecipe; error: string }> = [];

  for (const { recipe, error: originalError } of failed) {
    let retryCount = 0;
    let lastError = originalError;

    while (retryCount < maxRetries) {
      try {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // Exponential backoff

        const processedRecipe = await processSingleRecipe(recipe, {
          model: options.model,
        });

        processed.push(processedRecipe);
        scraperLogger.info(`[Recipe Processor] Retry successful for: ${recipe.recipe_name}`);
        break; // Success, exit retry loop
      } catch (err) {
        retryCount++;
        lastError = err instanceof Error ? err.message : String(err);

        if (retryCount >= maxRetries) {
          stillFailed.push({ recipe, error: lastError });
          scraperLogger.error(
            `[Recipe Processor] Retry failed after ${maxRetries} attempts: ${recipe.recipe_name}`,
            {
              error: lastError,
            },
          );
        } else {
          scraperLogger.warn(
            `[Recipe Processor] Retry ${retryCount}/${maxRetries} failed for: ${recipe.recipe_name}`,
            {
              error: lastError,
            },
          );
        }
      }
    }
  }

  return { processed, stillFailed };
}

/**
 * Process recipes in batches
 * PRIMARY: Groq API (fast, sub-second responses)
 * FALLBACK: Ollama (free, local processing)
 */
export async function processRecipes(
  options: {
    limit?: number;
    model?: string;
    batchSize?: number;
    concurrency?: number;
  } = {},
): Promise<{
  totalProcessed: number;
  totalFailed: number;
  processedRecipes: ScrapedRecipe[];
  failedRecipes: Array<{ recipe: ScrapedRecipe; error: string }>;
}> {
  // Check availability of both providers
  const groqEnabled = isGroqEnabled();
  let groqAvailable = false;
  let ollamaAvailable = false;

  if (groqEnabled) {
    try {
      groqAvailable = await isGroqAvailable();
    } catch (error) {
      scraperLogger.warn('[Recipe Processor] Groq availability check failed:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  ollamaAvailable = await isOllamaAvailable();

  // At least one provider must be available
  if (!groqAvailable && !ollamaAvailable) {
    if (groqEnabled) {
      throw new Error(
        'Groq is enabled but not available, and Ollama is also not available. ' +
          'Please either: (1) Set up Groq API key (USE_GROQ=true, GROQ_API_KEY=your-key) or ' +
          '(2) Start Ollama for free local processing (ollama serve). ' +
          'See: docs/GROQ_SETUP_GUIDE.md or docs/OLLAMA_SETUP_GUIDE.md',
      );
    } else {
      throw new Error(
        'Ollama is not available. Please start Ollama (localhost:11434) for free processing. ' +
          'Run: "ollama serve" (or "ollama run llama3.2:3b" to pull and start). ' +
          'Alternatively, enable Groq API by setting USE_GROQ=true and GROQ_API_KEY=your-key. ' +
          'See: docs/OLLAMA_SETUP_GUIDE.md or docs/GROQ_SETUP_GUIDE.md',
      );
    }
  }

  // Determine optimal batch size and concurrency based on provider
  // Groq is fast (sub-second), so can handle higher concurrency
  // Ollama is slower (local), so use lower concurrency
  const usingGroq = groqAvailable;
  const batchSize = options.batchSize || (usingGroq ? 50 : 20); // Larger batches for Groq
  const concurrency = options.concurrency || (usingGroq ? 10 : 5); // Higher concurrency for Groq
  const limit = options.limit;

  const providerInfo = usingGroq
    ? { provider: 'Groq API (fast, sub-second)', model: options.model || 'llama-3.1-8b-instant' }
    : { provider: 'Ollama (local, free)', model: options.model || 'llama3.2:3b' };

  scraperLogger.info('[Recipe Processor] Starting recipe processing', {
    groqEnabled,
    groqAvailable,
    ollamaAvailable,
    ...providerInfo,
    batchSize,
    concurrency,
    limit: limit || 'all',
  });

  // Initialize status
  processingStartTime = new Date();
  lastProgressTime = new Date();
  consecutiveErrors = 0;

  updateStatus({
    isProcessing: true,
    isPaused: false,
    startedAt: processingStartTime.toISOString(),
    aiProvider: usingGroq ? 'Groq API' : 'Ollama',
    aiProviderModel: providerInfo.model,
    healthStatus: 'healthy',
  });

  try {
    // Load all recipes from storage
    const storage = new JSONStorage();
    const allRecipes = storage.getAllRecipes();

    if (allRecipes.length === 0) {
      scraperLogger.warn('[Recipe Processor] No recipes found in storage');
      updateStatus({
        isProcessing: false,
        totalRecipes: 0,
      });
      return {
        totalProcessed: 0,
        totalFailed: 0,
        processedRecipes: [],
        failedRecipes: [],
      };
    }

    // Load actual recipe data and filter out already-formatted recipes
    const recipesToProcess: ScrapedRecipe[] = [];
    let skippedCount = 0;

    for (const entry of allRecipes.slice(0, limit)) {
      const recipe = await storage.loadRecipe(entry.file_path);
      if (recipe) {
        // Skip if already formatted using shared utility
        const isFormatted = isRecipeFormatted(recipe);

        if (isFormatted) {
          skippedCount++;
          scraperLogger.debug(
            `[Recipe Processor] Skipping already-formatted recipe: ${recipe.recipe_name}`,
            {
              recipeId: recipe.id,
              scrapedAt: recipe.scraped_at,
              updatedAt: recipe.updated_at,
            },
          );
        } else {
          recipesToProcess.push(recipe);
        }
      }
    }

    scraperLogger.info('[Recipe Processor] Recipe filtering complete', {
      totalRecipes: allRecipes.slice(0, limit).length,
      skippedFormatted: skippedCount,
      recipesToProcess: recipesToProcess.length,
    });

    updateStatus({
      totalRecipes: recipesToProcess.length,
      queueLength: recipesToProcess.length,
      skippedFormatted: skippedCount,
    });

    // Process in batches
    const allProcessed: ScrapedRecipe[] = [];
    const allFailed: Array<{ recipe: ScrapedRecipe; error: string }> = [];

    for (let i = 0; i < recipesToProcess.length; i += batchSize) {
      if (globalProcessingStatus.isPaused) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait while paused
        i -= batchSize; // Retry this batch
        continue;
      }

      const batch = recipesToProcess.slice(i, i + batchSize);
      updateStatus({ queueLength: recipesToProcess.length - i });

      scraperLogger.info(
        `[Recipe Processor] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipesToProcess.length / batchSize)}`,
        {
          batchSize: batch.length,
          totalRemaining: recipesToProcess.length - i,
        },
      );

      const { processed, failed } = await processBatchWithConcurrency(batch, {
        model: options.model,
        concurrency,
        onProgress: (processedCount, total) => {
          const progressPercent = (processedCount / recipesToProcess.length) * 100;
          updateStatus({
            progressPercent,
            queueLength: recipesToProcess.length - processedCount,
          });
        },
      });

      allProcessed.push(...processed);
      allFailed.push(...failed);

      // Save processed recipes back to storage
      for (const processedRecipe of processed) {
        await storage.saveRecipe(processedRecipe);
      }
    }

    // Retry failed recipes
    if (allFailed.length > 0) {
      scraperLogger.info(`[Recipe Processor] Retrying ${allFailed.length} failed recipes...`);
      const { processed: retriedProcessed, stillFailed } = await retryFailedRecipes(allFailed, {
        model: options.model,
        maxRetries: 3,
      });

      allProcessed.push(...retriedProcessed);

      // Save retried recipes
      for (const processedRecipe of retriedProcessed) {
        await storage.saveRecipe(processedRecipe);
      }

      // Update final status
      updateStatus({
        totalProcessed: allProcessed.length,
        queueLength: 0,
        activeProcessing: 0,
        progressPercent: 100,
        lastError:
          stillFailed.length > 0 ? `${stillFailed.length} recipes failed after retries` : undefined,
        healthStatus: stillFailed.length > 0 ? 'warning' : 'healthy',
      });

      scraperLogger.info('[Recipe Processor] Processing complete', {
        totalProcessed: allProcessed.length,
        totalFailed: stillFailed.length,
        successRate: `${((allProcessed.length / recipesToProcess.length) * 100).toFixed(1)}%`,
      });

      return {
        totalProcessed: allProcessed.length,
        totalFailed: stillFailed.length,
        processedRecipes: allProcessed,
        failedRecipes: stillFailed,
      };
    }

    // Update final status
    updateStatus({
      totalProcessed: allProcessed.length,
      queueLength: 0,
      activeProcessing: 0,
      progressPercent: 100,
      healthStatus: 'healthy',
    });

    scraperLogger.info('[Recipe Processor] Processing complete', {
      totalProcessed: allProcessed.length,
      totalFailed: 0,
      successRate: '100%',
    });

    return {
      totalProcessed: allProcessed.length,
      totalFailed: 0,
      processedRecipes: allProcessed,
      failedRecipes: [],
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    scraperLogger.error('[Recipe Processor] Fatal error during processing:', { error });

    updateStatus({
      isProcessing: false,
      healthStatus: 'error',
      lastError: error,
      isStuck: true,
      stuckReason: `Fatal error: ${error}`,
    });

    throw err;
  } finally {
    updateStatus({
      isProcessing: false,
      activeProcessing: 0,
    });
    processingStartTime = null;
    lastProgressTime = null;
  }
}

/**
 * Count unformatted recipes (recipes that need formatting)
 * This is used to show the count of recipes that need formatting when not processing
 * For performance, this uses sampling for large datasets (1000+ recipes)
 */
export async function countUnformattedRecipes(limit?: number): Promise<{
  total: number;
  unformatted: number;
  formatted: number;
}> {
  try {
    const storage = new JSONStorage();
    const allRecipes = storage.getAllRecipes();
    const recipesToCheck = limit ? allRecipes.slice(0, limit) : allRecipes;
    const total = recipesToCheck.length;

    if (total === 0) {
      return { total: 0, unformatted: 0, formatted: 0 };
    }

    let formattedCount = 0;
    let unformattedCount = 0;

    // For large datasets (1000+), use sampling for performance
    // For smaller datasets, check all recipes for accuracy
    const useSampling = total > 1000;
    const sampleSize = useSampling ? 500 : total;
    const recipesToSample = useSampling ? recipesToCheck.slice(0, sampleSize) : recipesToCheck;

    for (const entry of recipesToSample) {
      const recipe = await storage.loadRecipe(entry.file_path);
      if (recipe) {
        // Use shared utility for format detection
        const isFormatted = isRecipeFormatted(recipe);

        if (isFormatted) {
          formattedCount++;
        } else {
          unformattedCount++;
        }
      }
    }

    if (useSampling) {
      // Extrapolate the ratio to the full dataset
      const checkedCount = formattedCount + unformattedCount;
      const ratio = checkedCount > 0 ? unformattedCount / checkedCount : 0;
      const estimatedUnformatted = Math.round(total * ratio);
      const estimatedFormatted = total - estimatedUnformatted;

      scraperLogger.debug('[Recipe Processor] Counted unformatted recipes (sampled)', {
        total,
        sampleSize,
        estimatedUnformatted,
        estimatedFormatted,
      });

      return {
        total,
        unformatted: estimatedUnformatted,
        formatted: estimatedFormatted,
      };
    } else {
      // Exact count for smaller datasets
      scraperLogger.debug('[Recipe Processor] Counted unformatted recipes (exact)', {
        total,
        unformatted: unformattedCount,
        formatted: formattedCount,
      });

      return {
        total,
        unformatted: unformattedCount,
        formatted: formattedCount,
      };
    }
  } catch (error) {
    scraperLogger.error('[Recipe Processor] Error counting unformatted recipes:', {
      error: error instanceof Error ? error.message : String(error),
    });
    // Return conservative estimate (assume all need formatting)
    const storage = new JSONStorage();
    const allRecipes = storage.getAllRecipes();
    const total = limit ? Math.min(limit, allRecipes.length) : allRecipes.length;
    return {
      total,
      unformatted: total,
      formatted: 0,
    };
  }
}

/**
 * Pause processing
 */
export function pauseProcessing(): void {
  updateStatus({ isPaused: true });
  scraperLogger.info('[Recipe Processor] Processing paused');
}

/**
 * Resume processing
 */
export function resumeProcessing(): void {
  updateStatus({ isPaused: false });
  scraperLogger.info('[Recipe Processor] Processing resumed');
}

/**
 * Stop processing
 */
export function stopProcessing(): void {
  updateStatus({
    isProcessing: false,
    isPaused: false,
    queueLength: 0,
    activeProcessing: 0,
  });
  processingQueue = [];
  currentlyProcessing.clear();
  processingStartTime = null;
  lastProgressTime = null;
  scraperLogger.info('[Recipe Processor] Processing stopped');
}
