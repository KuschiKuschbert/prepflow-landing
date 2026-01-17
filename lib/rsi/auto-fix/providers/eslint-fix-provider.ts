/**
 * ESLint Fix Provider
 * Runs ESLint with --fix to auto-fix fixable issues.
 */

import { exec } from 'child_process';
import * as util from 'util';
import { FixProvider, FixSuggestion } from '../fix-provider';

const execAsync = util.promisify(exec);

interface ESLintResult {
  filePath: string;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  messages: Array<{
    ruleId: string;
    message: string;
    line: number;
    column: number;
    fix?: object;
  }>;
}

export class ESLintFixProvider implements FixProvider {
  name = 'ESLint Auto-Fix Provider';

  async scan(files?: string[]): Promise<FixSuggestion[]> {
    const suggestions: FixSuggestion[] = [];

    try {
      // Run ESLint in JSON format to get fixable issues
      const target = files?.join(' ') || 'app lib scripts';
      const { stdout } = await execAsync(
        `npx eslint ${target} --ext .ts,.tsx,.js,.jsx --format json --max-warnings 0 2>/dev/null || true`,
        { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer for large codebases
      );

      if (!stdout.trim()) {
        console.log('   No ESLint issues found.');
        return [];
      }

      const results: ESLintResult[] = JSON.parse(stdout);

      // Find files with fixable issues
      const fixableFiles = results.filter(
        r => r.fixableErrorCount > 0 || r.fixableWarningCount > 0,
      );

      if (fixableFiles.length === 0) {
        console.log('   No auto-fixable ESLint issues found.');
        return [];
      }

      console.log(`   Found ${fixableFiles.length} files with fixable ESLint issues.`);

      // Create a single batch fix suggestion for all fixable files
      const filePaths = fixableFiles.map(f => f.filePath);
      const totalFixable = fixableFiles.reduce(
        (sum, f) => sum + f.fixableErrorCount + f.fixableWarningCount,
        0,
      );

      suggestions.push({
        id: `eslint-batch-fix-${Date.now()}`,
        description: `Fix ${totalFixable} ESLint issues in ${fixableFiles.length} files`,
        file: filePaths.join(' '), // All files as space-separated list
        type: 'lint-fix',
        confidenceScore: 0.95, // ESLint fixes are highly reliable
        apply: async () => {
          try {
            await execAsync(`npx eslint ${filePaths.join(' ')} --fix`, {
              maxBuffer: 10 * 1024 * 1024,
            });
            return true;
          } catch {
            // ESLint --fix exits with error if issues remain, but fix was still applied
            return true;
          }
        },
        verify: async () => {
          // Verify by running type-check (ESLint fixes shouldn't break types)
          try {
            await execAsync('npm run type-check', { maxBuffer: 10 * 1024 * 1024 });
            return true;
          } catch {
            return false;
          }
        },
      });
    } catch (error) {
      console.error('   ESLint scan failed:', error);
    }

    return suggestions;
  }
}
