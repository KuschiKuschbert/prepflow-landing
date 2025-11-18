import { getOpenAIClient, isAIEnabled } from '../openai-client';
import { buildKitchenContext } from '../prompts/kitchen-context';
import { parseAIError } from '../utils/errorParser';
import { processAIResponse } from '../utils/responseProcessor';
import type { AIRequestOptions, AIResponse } from '../types';

/**
 * Generate AI response from vision (image analysis).
 *
 * @param {string} imageUrl - URL of image to analyze
 * @param {string} prompt - Analysis prompt
 * @param {string} countryCode - Country code for context
 * @param {AIRequestOptions} options - Request options
 * @returns {Promise<AIResponse<string>>} AI response
 */
export async function generateAIVisionResponse(
  imageUrl: string,
  prompt: string,
  countryCode: string,
  options: AIRequestOptions = {},
): Promise<AIResponse<string>> {
  if (!isAIEnabled()) {
    return {
      content: '',
      error: 'AI is not enabled or API key is missing',
    };
  }

  const client = getOpenAIClient();
  if (!client) {
    return {
      content: '',
      error: 'AI client not available',
    };
  }

  const kitchenContext = buildKitchenContext(countryCode);
  const fullPrompt = `${prompt}\n\n${kitchenContext}\n\nAnalyze the image and provide recommendations specific to the user's location and regulations.`;
  const model = options.model || 'gpt-4o-vision';
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1000;
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: fullPrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature,
      max_tokens: maxTokens,
    });
    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage
      ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined;
    return processAIResponse(content, usage, model, 'vision', undefined, countryCode, options);
  } catch (error) {
    const aiError = parseAIError(error as Error);
    return { content: '', error: aiError.message };
  }
}
