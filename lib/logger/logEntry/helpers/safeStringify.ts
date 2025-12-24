/**
 * Safely stringify an object, handling circular references and large objects.
 * Automatically redacts sensitive information like secrets, keys, and passwords.
 *
 * @param {unknown} obj - Object to stringify
 * @param {boolean} pretty - Whether to format with indentation
 * @returns {string} Stringified object with secrets redacted
 */
import { logger } from '@/lib/logger';
import { redactSecrets } from './redactSecrets';

export function safeStringify(obj: unknown, pretty = false): string {
  try {
    // Handle circular references and large objects
    const seen = new WeakSet();
    const replacer = (key: string, value: unknown) => {
      // Redact sensitive keys
      const sensitiveKeys = [
        'password',
        'secret',
        'key',
        'token',
        'apiKey',
        'api_key',
        'authToken',
        'auth_token',
      ];
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        return '[REDACTED]';
      }

      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);

        // Limit depth and size for very large objects
        if (key === 'stack' && typeof value === 'string') {
          const stackValue = value as string;
          if (stackValue.length > 1000) {
            return stackValue.substring(0, 1000) + '... [truncated]';
          }
        }
      }

      // Redact secrets in string values
      if (typeof value === 'string') {
        return redactSecrets(value);
      }

      return value;
    };

    const json = pretty ? JSON.stringify(obj, replacer, 2) : JSON.stringify(obj, replacer);

    // Truncate if still too large (safety limit ~10MB)
    const MAX_LENGTH = 10 * 1024 * 1024;
    if (json.length > MAX_LENGTH) {
      return json.substring(0, MAX_LENGTH) + '... [truncated]';
    }

    return json;
  } catch (err) {
    logger.error('[logEntry.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return `[Error stringifying: ${err instanceof Error ? err.message : String(err)}]`;
  }
}
