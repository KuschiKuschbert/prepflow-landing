import { readFileSync } from 'fs';
import { logger } from '@/lib/logger';
import { getFeatureFlagDescription } from '@/lib/feature-flag-descriptions';
import { FEATURE_FLAG_PATTERNS } from '../constants';
import type { DiscoveredFlag } from '../types';

/**
 * Scan a single file for feature flag usage
 */
export function scanFile(
  filePath: string,
  relativePath: string,
  flags: Map<string, DiscoveredFlag>,
): void {
  try {
    const content = readFileSync(filePath, 'utf-8');

    for (const pattern of FEATURE_FLAG_PATTERNS) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const flagKey = match[1];
        if (flagKey && flagKey.length > 0) {
          const lineNumber = content.substring(0, match.index).split('\n').length || undefined;
          const type: 'regular' | 'hidden' = flagKey.startsWith('hidden-') ? 'hidden' : 'regular';

          if (!flags.has(flagKey)) {
            const description = getFeatureFlagDescription(flagKey);
            flags.set(flagKey, {
              flagKey,
              type,
              file: relativePath,
              line: lineNumber,
              description: description || null,
            });
          }
        }
      }
    }
  } catch (error) {
    logger.warn(`[Feature Flag Scanner] Could not read file ${filePath}:`, error);
  }
}
