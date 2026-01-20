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
    try {
      const stdout = await this.runESLintScan(files);
      if (!stdout) return [];

      const results: ESLintResult[] = JSON.parse(stdout);
      const fixableFiles = this.getFixableFiles(results);

      if (fixableFiles.length === 0) return [];

      return [this.createBatchFixSuggestion(fixableFiles)];
    } catch (error) {
      console.error('   ESLint scan failed:', error);
      return [];
    }
  }

  private async runESLintScan(files?: string[]): Promise<string> {
    const target = files?.join(' ') || 'app lib scripts';
    const { stdout } = await execAsync(
      `npx eslint ${target} --ext .ts,.tsx,.js,.jsx --format json --max-warnings 0 2>/dev/null || true`,
      { maxBuffer: 10 * 1024 * 1024 },
    );
    return stdout.trim();
  }

  private getFixableFiles(results: ESLintResult[]): ESLintResult[] {
    return results.filter(r => r.fixableErrorCount > 0 || r.fixableWarningCount > 0);
  }

  private createBatchFixSuggestion(fixableFiles: ESLintResult[]): FixSuggestion {
    const filePaths = fixableFiles.map(f => f.filePath);
    const totalFixable = fixableFiles.reduce(
      (sum, f) => sum + f.fixableErrorCount + f.fixableWarningCount,
      0,
    );

    return {
      id: `eslint-batch-fix-${Date.now()}`,
      description: `Fix ${totalFixable} ESLint issues in ${fixableFiles.length} files`,
      file: filePaths.join(' '),
      type: 'lint-fix',
      confidenceScore: 0.95,
      apply: async () => {
        try {
          await execAsync(`npx eslint ${filePaths.join(' ')} --fix`, {
            maxBuffer: 10 * 1024 * 1024,
          });
          return true;
        } catch {
          return true; // ESLint exits with error if issues remain
        }
      },
      verify: async () => {
        try {
          await execAsync('npm run type-check', { maxBuffer: 10 * 1024 * 1024 });
          return true;
        } catch {
          return false;
        }
      },
    };
  }
}
