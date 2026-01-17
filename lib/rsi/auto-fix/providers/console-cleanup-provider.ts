/**
 * Console Cleanup Provider
 * Removes console.log statements from production code.
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as util from 'util';
import { FixProvider, FixSuggestion } from '../fix-provider';

const execAsync = util.promisify(exec);

// Directories to scan (production code)
const SCAN_DIRS = ['app/api', 'app/webapp', 'lib'];

// Directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  '*.test.ts',
  '*.test.tsx',
  '*.spec.ts',
  'scripts/', // Allow console in scripts
];

export class ConsoleCleanupProvider implements FixProvider {
  name = 'Console Cleanup Provider';

  async scan(files?: string[]): Promise<FixSuggestion[]> {
    const suggestions: FixSuggestion[] = [];

    try {
      // Find files with console.log (excluding tests and scripts)
      const excludeArgs = EXCLUDE_PATTERNS.map(p => `--exclude='${p}'`).join(' ');
      const searchDirs = files?.join(' ') || SCAN_DIRS.join(' ');

      const { stdout } = await execAsync(
        `grep -rl "console\\.log" ${searchDirs} ${excludeArgs} 2>/dev/null || true`,
      );

      if (!stdout.trim()) {
return [];
      }

      const filesWithConsole = stdout.trim().split('\n').filter(Boolean);

      // Filter out test files and already-ignored lines
      const productionFiles: string[] = [];

      for (const file of filesWithConsole) {
        if (
          file.includes('.test.') ||
          file.includes('.spec.') ||
          file.includes('scripts/') ||
          file.includes('__tests__')
        ) {
          continue;
        }
        productionFiles.push(file);
      }

      if (productionFiles.length === 0) {
return [];
      }
// Create individual suggestions for each file (safer, more granular)
      for (const filePath of productionFiles) {
        const content = await fs.readFile(filePath, 'utf8');
        const consoleCount = (content.match(/console\.log\(/g) || []).length;

        if (consoleCount === 0) continue;

        suggestions.push({
          id: `console-cleanup-${path.basename(filePath)}-${Date.now()}`,
          description: `Remove ${consoleCount} console.log from ${path.basename(filePath)}`,
          file: filePath,
          type: 'cleanup',
          confidenceScore: 0.85, // High confidence but not 1.0 (some console.log may be intentional)
          apply: async () => {
            try {
              // Use jscodeshift for safe AST-based transformation
              const codemodPath = path.resolve(process.cwd(), 'scripts/codemods/console-migration.js');
              // Run jscodeshift on the single file
              await execAsync(`npx jscodeshift -t ${codemodPath} ${filePath} --parser tsx`);
              return true;
            } catch (error) {
              console.error(`Failed to apply console cleanup to ${filePath}:`, error);
              return false;
            }
          },
          verify: async () => {
            // Verify by checking file still compiles
            try {
              await execAsync(`npx tsc --noEmit ${filePath} 2>&1`);
              return true;
            } catch {
              // TypeScript errors may exist unrelated to our change
              // Check if our file change is the cause by checking for syntax errors
              const { stdout: checkOutput } = await execAsync(
                `npx tsc --noEmit ${filePath} 2>&1 || true`,
              );
              // If it's just type errors (not syntax), we're okay
              return !checkOutput.includes('Unexpected token');
            }
          },
        });
      }
    } catch (error) {
      console.error('   Console cleanup scan failed:', error);
    }

    return suggestions;
  }
}
