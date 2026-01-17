/**
 * Response parser for Groq API
 */

import { logger } from '@/lib/logger';

export function parseGroqResponse(result: Record<string, any>): string {
  let content = '';
  if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
    content = result.choices[0].message?.content || '';
  } else if (result.content) {
    content = result.content;
  }

  if (!content) {
    throw new Error('Empty response from Groq API');
  }

  if (result.usage) {
    logger.dev('[Groq] Token usage:', {
      promptTokens: result.usage.prompt_tokens || 0,
      completionTokens: result.usage.completion_tokens || 0,
      totalTokens: result.usage.total_tokens || 0,
    });

    const totalTokens = result.usage.total_tokens || 0;
    if (totalTokens > 100000) {
      logger.warn(
        '[Groq] High token usage detected. Monitor usage at https://console.groq.com/ ' +
          'Consider setting spending limits in Groq Console (Settings → Billing → Limits)',
      );
    }
  }

  logger.dev('[Groq] Text generated successfully:', {
    contentLength: content.length,
    model: result.model || 'unknown',
  });

  return content;
}
