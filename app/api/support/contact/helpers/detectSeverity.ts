import { detectSeverity as detectSeverityFromLib } from '@/lib/error-detection/severity-detector';

/**
 * Auto-detect severity from message content
 */
export function detectSeverity(subject: string, message: string): string {
  const detectionContext = {
    message: `${subject} ${message}`,
    endpoint: '/api/support/contact',
  };
  return detectSeverityFromLib(detectionContext);
}
