import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

/**
 * Validation Suite
 * Runs targeted validations after a refactor.
 */

export class ValidationSuite {
  static async validate(affectedFiles: string[]): Promise<boolean> {
    try {
      console.log(`Validating ${affectedFiles.length} files...`);

      // 1. Check if git sees any changes
      const { stdout: diffStdout } = await execAsync('git diff --name-only');
      if (!diffStdout.trim()) {
        console.warn('⚠️ No changes detected after refactoring execution.');
        return false;
      }

      console.log('✅ Changes detected on disk.');

      // 2. Perform basic type check
      console.log('Running type check...');
      try {
         await execAsync('npx tsc --noEmit');
         console.log('✅ Type check passed.');
         return true;
      } catch (err: any) {
         console.error('❌ Type check failed:', err.stdout || err.message);
         return false;
      }
    } catch (error) {
      console.error('Validation failed', error);
      return false;
    }
  }
}
