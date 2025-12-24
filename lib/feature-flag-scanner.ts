/**
 * Feature flag scanner.
 * Scans the codebase for feature flag usage to discover flags.
 */

import { statSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';
import { SOURCE_DIRECTORIES } from './feature-flag-scanner/constants';
import { scanDirectory } from './feature-flag-scanner/helpers/scanDirectory';
import type { DiscoveredFlag } from './feature-flag-scanner/types';

export type { DiscoveredFlag } from './feature-flag-scanner/types';

/**
 * Scan codebase for feature flag usage.
 */
export function scanForFeatureFlags(): DiscoveredFlag[] {
  const flags: Map<string, DiscoveredFlag> = new Map();
  const rootDir = process.cwd();

  for (const srcDir of SOURCE_DIRECTORIES) {
    const fullPath = join(rootDir, srcDir);
    try {
      if (statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, srcDir, flags);
      }
    } catch (error) {
      logger.warn(`[Feature Flag Scanner] Could not scan ${srcDir}:`, error);
    }
  }

  return Array.from(flags.values());
}

/**
 * Group discovered flags by type.
 */
export function groupFlagsByType(flags: DiscoveredFlag[]): {
  regular: DiscoveredFlag[];
  hidden: DiscoveredFlag[];
} {
  return {
    regular: flags.filter(f => f.type === 'regular'),
    hidden: flags.filter(f => f.type === 'hidden'),
  };
}
