import { getGeminiClient, isAIEnabled, getModelForTask, type TaskType } from '../gemini-client';
import { buildKitchenContext } from '../prompts/kitchen-context';
import { parseAIError } from '../utils/errorParser';
import { processAIResponse } from '../utils/responseProcessor';
import type { AIRequestOptions, AIResponse } from '../types';

/**
 * Generate AI response from vision (image analysis).
 *
 * @param {string} imageUrl - URL of image to analyze (data URL, base64, or public URL)
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

  const client = getGeminiClient();
  if (!client) {
    return {
      content: '',
      error: 'AI client not available',
    };
  }

  const kitchenContext = buildKitchenContext(countryCode);
  const fullPrompt = `${prompt}\n\n${kitchenContext}\n\nAnalyze the image and provide recommendations specific to the user's location and regulations.`;

  // Use vision model (gemini-1.5-pro has vision capabilities)
  const taskType: TaskType = 'vision';
  const model = options.model || getModelForTask(taskType);
  const temperature = options.temperature ?? 0.7;
  const maxOutputTokens = options.maxTokens ?? 1000;

  try {
    // Get the model instance
    const geminiModel = client.getGenerativeModel({
      model,
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    });

    // Convert image URL to base64 if needed
    // Gemini requires base64 data, so we need to fetch URLs and convert them
    let imageData: string;
    let mimeType = 'image/jpeg'; // Default

    if (imageUrl.startsWith('data:')) {
      // Data URL format: data:image/png;base64,...
      const [mimePart, base64Data] = imageUrl.split(',');
      const mimeMatch = mimePart.match(/data:([^;]+)/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      imageData = base64Data;
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Public URL - fetch and convert to base64
      try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageData = buffer.toString('base64');
        // Try to detect mime type from response headers
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          mimeType = contentType;
        }
      } catch (fetchError) {
        return {
          content: '',
          error: `Failed to fetch image from URL: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        };
      }
    } else {
      // Assume base64 string
      imageData = imageUrl;
    }

    // Generate content with image and text prompt
    // Gemini expects parts array with text and image parts
    const parts = [
      { text: fullPrompt },
      {
        inlineData: {
          data: imageData,
          mimeType,
        },
      },
    ];

    const result = await geminiModel.generateContent(parts);

    const response = await result.response;
    const content = response.text();

    // Extract token usage from response
    const usageMetadata = result.response.usageMetadata;
    const usage = usageMetadata
      ? {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0,
        }
      : undefined;

    return processAIResponse(content, usage, model, 'vision', undefined, countryCode, options);
  } catch (error) {
    const aiError = parseAIError(error as Error);
    return { content: '', error: aiError.message };
  }
}
