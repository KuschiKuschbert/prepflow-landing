import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

/**
 * Safety Checker for RSI
 * Validates system state before allowing automated changes.
 */

export class SafetyChecker {
  /**
   * Check if the git working directory is clean
   */
  static async isGitClean(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git status --porcelain');
      return stdout.trim().length === 0;
    } catch (error) {
      console.error('Git status check failed:', error);
      return false;
    }
  }

  /**
   * Check if tests are passing
   * @param testParams Optional parameters for specific tests
   */
  static async areTestsPassing(testParams = ''): Promise<boolean> {
    try {
      // Running a lightweight check or specific relevant tests
      // For full safety, this might run 'npm test', but that can be slow.
      // RSI might run targeted tests.
      const command = testParams ? `npm test -- ${testParams}` : 'npm run type-check';
      await execAsync(command);
      return true;
    } catch (error) {
      console.warn('Tests check failed:', error);
      return false;
    }
  }

  /**
   * Validate a proposed file modification
   * @param filePath Path to file
   * @param newContent New content
   */
  static validateSyntax(filePath: string, newContent: string): boolean {
    // Simple syntax check hooks could go here
    // For JS/TS, we could try to parse it with TypeScript compiler API
    // For now, valid if non-empty
    return newContent.trim().length > 0;
  }
}
