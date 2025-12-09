/**
 * Auto-detect error severity from error message and context.
 * Safety errors (system security/data integrity) are prioritized first.
 */

export type Severity = 'safety' | 'critical' | 'high' | 'medium' | 'low';

interface SeverityDetectionContext {
  message?: string;
  error?: Error | string;
  endpoint?: string;
  component?: string;
  operation?: string;
  [key: string]: unknown;
}

/**
 * Safety keywords - system security and data integrity issues
 */
const SAFETY_KEYWORDS = [
  'unauthorized',
  'unauthorised',
  'authentication failed',
  'auth failed',
  'permission denied',
  'access denied',
  'forbidden',
  'security',
  'breach',
  'corruption',
  'corrupted',
  'data corruption',
  'integrity',
  'tamper',
  'malicious',
  'injection',
  'xss',
  'csrf',
  'sql injection',
  'hack',
  'exploit',
  'vulnerability',
];

/**
 * Critical keywords - system crashes, data loss, complete failures
 */
const CRITICAL_KEYWORDS = [
  'database connection',
  'db connection',
  'connection failed',
  'connection error',
  'system crash',
  'crash',
  'data loss',
  'lost data',
  '500 error',
  'internal server error',
  'fatal',
  'cannot connect',
  'timeout',
  'out of memory',
  'memory error',
  'disk full',
  'service unavailable',
  '503',
];

/**
 * High keywords - major feature breakage, API failures
 */
const HIGH_KEYWORDS = [
  'api failed',
  'api error',
  'endpoint failed',
  'request failed',
  'feature broken',
  'broken feature',
  '400 error',
  'bad request',
  'not found',
  '404',
  'method not allowed',
  '405',
];

/**
 * Detect error severity from message and context.
 *
 * @param {SeverityDetectionContext} context - Error context
 * @returns {Severity} Detected severity level
 */
export function detectSeverity(context: SeverityDetectionContext): Severity {
  // If severity is explicitly provided, use it
  if (
    context.severity &&
    typeof context.severity === 'string' &&
    ['safety', 'critical', 'high', 'medium', 'low'].includes(context.severity)
  ) {
    return context.severity as Severity;
  }

  // Combine all text sources for keyword matching
  const textSources: string[] = [];

  if (context.message) {
    textSources.push(context.message.toLowerCase());
  }

  if (context.error) {
    const errorText =
      context.error instanceof Error ? context.error.message : String(context.error);
    textSources.push(errorText.toLowerCase());
  }

  if (context.endpoint) {
    textSources.push(context.endpoint.toLowerCase());
  }

  if (context.component) {
    textSources.push(context.component.toLowerCase());
  }

  if (context.operation) {
    textSources.push(context.operation.toLowerCase());
  }

  const combinedText = textSources.join(' ');

  // Check for safety keywords first (highest priority)
  for (const keyword of SAFETY_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return 'safety';
    }
  }

  // Check for critical keywords
  for (const keyword of CRITICAL_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return 'critical';
    }
  }

  // Check for high keywords
  for (const keyword of HIGH_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return 'high';
    }
  }

  // Check endpoint patterns for severity hints
  if (context.endpoint) {
    const endpoint = context.endpoint.toLowerCase();

    // Auth endpoints are often safety-related
    if (endpoint.includes('/auth') || endpoint.includes('/login') || endpoint.includes('/signin')) {
      return 'safety';
    }

    // Database-related endpoints are critical
    if (endpoint.includes('/db/') || endpoint.includes('/database')) {
      return 'critical';
    }
  }

  // Default to medium for unknown errors
  return 'medium';
}
