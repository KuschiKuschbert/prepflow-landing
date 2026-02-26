/**
 * Response parser for Groq API
 */

import { logger } from '@/lib/logger';

interface GroqChoice {
  message?: { content?: string };
}

export function parseGroqResponse(result: Record<string, unknown>): string {
  let content = '';
  if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
    const first = result.choices[0] as GroqChoice;
    content = first?.message?.content || '';
  } else if (result.content != null) {
    content = String(result.content);
  }

  if (!content) {
    throw new Error('Empty response from Groq API');
  }

  const usage = result.usage as Record<string, unknown> | undefined;
  if (usage) {
    logger.dev('[Groq] Token usage:', {
      promptTokens: (usage.prompt_tokens as number) || 0,
      completionTokens: (usage.completion_tokens as number) || 0,
      totalTokens: (usage.total_tokens as number) || 0,
    });

    const totalTokens = (usage.total_tokens as number) || 0;
    if (totalTokens > 100000) {
      logger.warn(
        '[Groq] High token usage detected. Monitor usage at https://console.groq.com/ ' +
          'Consider setting spending limits in Groq Console (Settings → Billing → Limits)',
      );
    }
  }

  logger.dev('[Groq] Text generated successfully:', {
    contentLength: content.length,
    model: (result.model as string) || 'unknown',
  });

  return content;
}
