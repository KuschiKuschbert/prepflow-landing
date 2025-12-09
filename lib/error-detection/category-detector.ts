/**
 * Auto-detect error category from error context.
 */

export type ErrorCategory = 'security' | 'database' | 'api' | 'client' | 'system' | 'other';

interface CategoryDetectionContext {
  endpoint?: string;
  component?: string;
  operation?: string;
  error?: Error | string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Detect error category from context.
 *
 * @param {CategoryDetectionContext} context - Error context
 * @returns {ErrorCategory} Detected category
 */
export function detectCategory(context: CategoryDetectionContext): ErrorCategory {
  // If category is explicitly provided, use it
  if (
    context.category &&
    typeof context.category === 'string' &&
    ['security', 'database', 'api', 'client', 'system', 'other'].includes(context.category)
  ) {
    return context.category as ErrorCategory;
  }

  // Combine all text sources for pattern matching
  const textSources: string[] = [];

  if (context.endpoint) {
    textSources.push(context.endpoint.toLowerCase());
  }

  if (context.component) {
    textSources.push(context.component.toLowerCase());
  }

  if (context.operation) {
    textSources.push(context.operation.toLowerCase());
  }

  if (context.error) {
    const errorText =
      context.error instanceof Error ? context.error.message : String(context.error);
    textSources.push(errorText.toLowerCase());
  }

  if (context.message) {
    textSources.push(context.message.toLowerCase());
  }

  const combinedText = textSources.join(' ');

  // Security category - authentication, authorization, permissions
  if (
    combinedText.includes('/auth') ||
    combinedText.includes('authentication') ||
    combinedText.includes('authorization') ||
    combinedText.includes('permission') ||
    combinedText.includes('unauthorized') ||
    combinedText.includes('forbidden') ||
    combinedText.includes('security') ||
    combinedText.includes('token') ||
    combinedText.includes('session')
  ) {
    return 'security';
  }

  // Database category - Supabase, database connection, queries
  if (
    combinedText.includes('supabase') ||
    combinedText.includes('database') ||
    combinedText.includes('db') ||
    combinedText.includes('sql') ||
    combinedText.includes('query') ||
    combinedText.includes('table') ||
    combinedText.includes('connection') ||
    combinedText.includes('postgres') ||
    combinedText.includes('relation') ||
    combinedText.includes('column')
  ) {
    return 'database';
  }

  // API category - API routes, endpoints, requests
  if (
    combinedText.includes('/api/') ||
    combinedText.includes('api route') ||
    combinedText.includes('endpoint') ||
    combinedText.includes('request') ||
    combinedText.includes('response') ||
    combinedText.includes('http') ||
    combinedText.includes('fetch') ||
    (context.endpoint && context.endpoint.startsWith('/api/'))
  ) {
    return 'api';
  }

  // Client category - React components, hooks, client-side errors
  if (
    combinedText.includes('component') ||
    combinedText.includes('react') ||
    combinedText.includes('hook') ||
    combinedText.includes('client') ||
    combinedText.includes('browser') ||
    combinedText.includes('window') ||
    combinedText.includes('dom') ||
    context.component ||
    context.hook
  ) {
    return 'client';
  }

  // System category - server errors, infrastructure, system-level
  if (
    combinedText.includes('server') ||
    combinedText.includes('system') ||
    combinedText.includes('infrastructure') ||
    combinedText.includes('500') ||
    combinedText.includes('503') ||
    combinedText.includes('timeout') ||
    combinedText.includes('memory') ||
    combinedText.includes('disk')
  ) {
    return 'system';
  }

  // Default to other
  return 'other';
}
