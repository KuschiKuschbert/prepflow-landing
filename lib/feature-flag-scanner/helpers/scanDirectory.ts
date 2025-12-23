import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { logger } from '@/lib/logger';
import { SKIP_DIRECTORIES } from '../constants';
import { scanFile } from './scanFile';
import type { DiscoveredFlag } from '../types';

/**
 * Recursively scan directory for TypeScript/TSX files
 */
export function scanDirectory(
  dir: string,
  relativePath: string,
  flags: Map<string, DiscoveredFlag>,
): void {
  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      if (
        entry.startsWith('.') ||
        SKIP_DIRECTORIES.includes(entry)
      ) {
        continue;
      }

      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, join(relativePath, entry), flags);
      } else if (stat.isFile()) {
        const ext = extname(entry);
        if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') {
          scanFile(fullPath, join(relativePath, entry), flags);
        }
      }
    }
  } catch (error) {
    logger.warn(`[Feature Flag Scanner] Could not read directory ${dir}:`, error);
  }
}
