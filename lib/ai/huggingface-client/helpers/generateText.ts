import { logger } from '@/lib/logger';
import type { AIChatMessage } from '../../types';
import { HUGGINGFACE_ROUTER_BASE } from '../constants';
import { getHuggingFaceTextModel } from './getModels';

/**
 * Get Hugging Face API key (required for router API)
 */
function getHuggingFaceApiKey(): string | null {
  return process.env.HUGGINGFACE_API_KEY || null;
}

/**
 * Generate text using Hugging Face Router API (Llama model)
 *
 * Uses OpenAI-compatible format via router API
 * Router API supports specific models like Llama-3.2-3B-Instruct
 *
 * @param messages - Chat messages (system/user/assistant)
 * @param options - Generation options
 * @returns Generated text response
 */
export async function generateTextWithHuggingFace(
  messages: AIChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {},
): Promise<{
  content: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
} | null> {
  const model = options.model || getHuggingFaceTextModel();
  const apiKey = getHuggingFaceApiKey();

  if (!apiKey) {
    logger.error('[Hugging Face] API key is required for router API');
    return null;
  }

  try {
    logger.dev('[Hugging Face] Generating text:', {
      model,
      messageCount: messages.length,
      hasApiKey: !!apiKey,
      endpoint: `${HUGGINGFACE_ROUTER_BASE}/v1/chat/completions`,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // Router API uses OpenAI-compatible format with /v1/chat/completions endpoint
    const response = await fetch(`${HUGGINGFACE_ROUTER_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: unknown = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not JSON, use as text
      }

      logger.error('[Hugging Face] Text generation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 500),
        errorJson,
      });

      // Handle rate limiting and model loading
      if (response.status === 503) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 10000;
        logger.warn(`[Hugging Face] Model loading, waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return generateTextWithHuggingFace(messages, options); // Retry once
      }

      return null;
    }

    const result = await response.json();

    // OpenAI-compatible format returns { choices: [{ message: { content: "..." } }] }
    let content = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      content = result.choices[0].message?.content || '';
    } else if (result.content) {
      content = result.content;
    }

    // Extract usage if available
    const usage = result.usage
      ? {
          promptTokens: result.usage.prompt_tokens || 0,
          completionTokens: result.usage.completion_tokens || 0,
          totalTokens: result.usage.total_tokens || 0,
        }
      : undefined;

    logger.dev('[Hugging Face] Text generated successfully:', {
      contentLength: content.length,
      hasUsage: !!usage,
    });

    return { content, usage };
  } catch (error) {
    logger.error('[Hugging Face] Text generation error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
