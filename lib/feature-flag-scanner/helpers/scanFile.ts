import { getFeatureFlagDescription } from '@/lib/feature-flag-descriptions';
import { logger } from '@/lib/logger';
import { readFileSync } from 'fs';
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
      scanWithPattern(content, pattern, relativePath, flags);
    }
  } catch (error) {
    logger.warn(`[Feature Flag Scanner] Could not read file ${filePath}:`, error);
  }
}

function scanWithPattern(
  content: string,
  pattern: RegExp,
  relativePath: string,
  flags: Map<string, DiscoveredFlag>,
) {
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const flagKey = match[1];
    if (flagKey && flagKey.length > 0) {
      processFlagMatch(flagKey, match.index, content, relativePath, flags);
    }
  }
}

function processFlagMatch(
  flagKey: string,
  index: number,
  content: string,
  relativePath: string,
  flags: Map<string, DiscoveredFlag>,
) {
  if (flags.has(flagKey)) return;

  const lineNumber = content.substring(0, index).split('\n').length || undefined;
  const type: 'regular' | 'hidden' = flagKey.startsWith('hidden-') ? 'hidden' : 'regular';
  const description = getFeatureFlagDescription(flagKey);

  flags.set(flagKey, {
    flagKey,
    type,
    file: relativePath,
    line: lineNumber,
    description: description || null,
  });
}
