/**
 * Feature flag scanner.
 * Scans the codebase for feature flag usage to discover flags.
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { getFeatureFlagDescription } from './feature-flag-descriptions';
import { logger } from './logger';

// Export types and functions for feature flag discovery

export interface DiscoveredFlag {
  flagKey: string;
  type: 'regular' | 'hidden';
  file: string;
  line?: number;
  description?: string | null;
}

/**
 * Scan codebase for feature flag usage.
 * Finds useFeatureFlag('flag-key') calls and extracts flag keys.
 *
 * @returns {DiscoveredFlag[]} Array of discovered feature flags
 */
export function scanForFeatureFlags(): DiscoveredFlag[] {
  const flags: Map<string, DiscoveredFlag> = new Map();
  const rootDir = process.cwd();
  const srcDirs = ['app', 'components', 'hooks', 'lib'];

  // Patterns to match feature flag usage
  const patterns = [
    // useFeatureFlag('flag-key')
    /useFeatureFlag\(['"]([^'"]+)['"]\)/g,
    // isFeatureEnabled('flag-key', ...)
    /isFeatureEnabled\(['"]([^'"]+)['"]/g,
    // useFeatureFlag("flag-key")
    /useFeatureFlag\(["']([^"']+)["']\)/g,
  ];

  /**
   * Recursively scan directory for TypeScript/TSX files
   */
  function scanDirectory(dir: string, relativePath: string = ''): void {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        // Skip node_modules, .next, and other build directories
        if (
          entry.startsWith('.') ||
          entry === 'node_modules' ||
          entry === '.next' ||
          entry === 'dist' ||
          entry === 'build'
        ) {
          continue;
        }

        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath, join(relativePath, entry));
        } else if (stat.isFile()) {
          const ext = extname(entry);
          if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') {
            scanFile(fullPath, join(relativePath, entry));
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      logger.warn(`[Feature Flag Scanner] Could not read directory ${dir}:`, error);
    }
  }

  /**
   * Scan a single file for feature flag usage
   */
  function scanFile(filePath: string, relativePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const flagKey = match[1];
          if (flagKey && flagKey.length > 0) {
            // Find line number
            const lineNumber = content.substring(0, match.index).split('\n').length || undefined;

            // Determine if it's a hidden flag (for now, all are regular)
            // Hidden flags could be identified by a prefix like 'hidden-' or similar
            const type: 'regular' | 'hidden' = flagKey.startsWith('hidden-') ? 'hidden' : 'regular';

            // Store flag (avoid duplicates)
            if (!flags.has(flagKey)) {
              // Get description from mapping
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
      // Skip files we can't read
      logger.warn(`[Feature Flag Scanner] Could not read file ${filePath}:`, error);
    }
  }

  // Scan source directories
  for (const srcDir of srcDirs) {
    const fullPath = join(rootDir, srcDir);
    try {
      if (statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, srcDir);
      }
    } catch (error) {
      // Directory doesn't exist, skip it
      logger.warn(`[Feature Flag Scanner] Could not scan ${srcDir}:`, error);
    }
  }

  return Array.from(flags.values());
}

/**
 * Group discovered flags by type.
 *
 * @param {DiscoveredFlag[]} flags - Array of discovered flags
 * @returns {Object} Grouped flags
 * @returns {DiscoveredFlag[]} returns.regular - Regular feature flags
 * @returns {DiscoveredFlag[]} returns.hidden - Hidden feature flags
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
