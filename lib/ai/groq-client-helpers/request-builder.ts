/**
 * Request builder for Groq API
 */

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

export interface GroqRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: 'text' | 'json_object';
  timeout?: number;
}

export function buildGroqRequest(
  prompt: string,
  apiKey: string,
  options: GroqRequestOptions,
): { url: string; init: RequestInit; timeoutId: NodeJS.Timeout } {
  const model = options.model || DEFAULT_MODEL;
  const timeout = options.timeout || 30000;
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens || 8192;
  const responseFormat = options.responseFormat || 'json_object';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a precise recipe formatter. Always respond with valid JSON only, no markdown, no explanations. Follow all conversion rules strictly.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
    }),
    signal: controller.signal,
  };

  return {
    url: `${GROQ_API_BASE}/chat/completions`,
    init,
    timeoutId,
  };
}
