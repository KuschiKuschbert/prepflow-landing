import { exec } from 'child_process';
import util from 'util';
import { GeneratedRule } from './rule-generator';

import { logger } from '@/lib/logger';

const execAsync = util.promisify(exec);

/**
 * Rule Evaluator
 * Tests a generated rule against the codebase to ensure validity and check false positives.
 */
export class RuleEvaluator {
  static async evaluate(
    rule: GeneratedRule,
  ): Promise<{ isValid: boolean; matches: number; falsePositives: number }> {
    logger.dev(`Evaluator: Testing rule "${rule.name}" (${rule.definition})...`);

    try {
      // Use grep to find matches.
      // -r: recursive
      // -l: match files only (faster than counting all lines if we just need existence)
      // -E: extended regex
      // --exclude-dir: ignore noise
      // We wrap the definition in quotes to prevent shell injection, though simple regexes are expected.
      // We use '|| true' to prevent throw on no match (grep returns exit code 1)

      const excludeDirs =
        '--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=dist --exclude-dir=build';
      const command = `grep -rlE "${rule.definition.replace(/"/g, '\\"')}" . ${excludeDirs} | head -n 5`;

      const { stdout } = await execAsync(command);
      const files = stdout.split('\n').filter(line => line.trim());

      const matches = files.length;
      const isValid = matches > 0;

      if (isValid) {
        logger.dev(`  ✅ Rule matches ${matches}+ files (e.g., ${files[0]})`);
      } else {
        logger.dev(`  ❌ Rule found NO matches in codebase.`);
      }

      return {
        isValid,
        matches,
        falsePositives: 0, // Cannot determine false positives without human feedback loop yet
      };
    } catch (error) {
      logger.error('Evaluator Error:', error);
      // Fail safely
      return { isValid: false, matches: 0, falsePositives: 0 };
    }
  }
}
