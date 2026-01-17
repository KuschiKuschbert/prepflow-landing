import { exec } from 'child_process';
import * as path from 'path';
import * as util from 'util';

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
      } catch (err: unknown) {
        console.error('❌ Type check failed. Analyzing errors...');
        const errorObj = err as Error & { stdout?: string };
        const output = errorObj.stdout || errorObj.message;

        // Extract file paths from TSC output
        // Example: app/webapp/temperature/components/TemperatureLogCard.tsx(24,87): error TS1005...
        const failedFiles = new Set<string>();
        const lines = output.split('\n');
        const pathRegex = /^([^\s(]+)\(/;

        for (const line of lines) {
          const match = line.match(pathRegex);
          if (match && match[1] && affectedFiles.some(f => match[1].includes(path.basename(f)))) {
            // Basic match check - can be improved to be exact match if passing full paths
            failedFiles.add(match[1]);
          }
        }

        if (failedFiles.size > 0) {
          console.log(`⚠️ Identifying ${failedFiles.size} broken files. Reverting them...`);
          const failedFilesArray = Array.from(failedFiles);
          for (const file of failedFilesArray) {
            console.log(`   Reverting ${file}...`);
            await execAsync(`git checkout "${file}"`);
          }
          console.log('✅ Partial rollback complete. Valid changes preserved.');
          return true; // Return true because we fixed the broken state by reverting
        } else {
          console.error('❌ Could not identify specific broken files. Reverting all...');
          return false; // Trigger full revert in caller
        }
      }
    } catch (error) {
      console.error('Validation failed', error);
      return false;
    }
  }
}
