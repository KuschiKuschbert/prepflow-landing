/**
 * Auto-detect error severity from error message and context.
 * Safety errors (system security/data integrity) are prioritized first.
 */

import { collectTextSources } from './severity-detector/helpers/collectTextSources';
import { matchKeywords } from './severity-detector/helpers/matchKeywords';
import { matchEndpointPatterns } from './severity-detector/helpers/matchEndpointPatterns';

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
 * Detect error severity from message and context.
 */
export function detectSeverity(context: SeverityDetectionContext): Severity {
  if (
    context.severity &&
    typeof context.severity === 'string' &&
    ['safety', 'critical', 'high', 'medium', 'low'].includes(context.severity)
  ) {
    return context.severity as Severity;
  }

  const combinedText = collectTextSources(context);
  const keywordMatch = matchKeywords(combinedText);

  if (keywordMatch) {
    return keywordMatch;
  }

  const endpointMatch = matchEndpointPatterns(context.endpoint);

  if (endpointMatch) {
    return endpointMatch;
  }

  return 'medium';
}
