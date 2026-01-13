import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

/**
 * Codemod Runner
 * Wrapper for jscodeshift execution.
 */

export class CodemodRunner {
  static async run(
    codemodPath: string,
    targetFiles: string[],
    dryRun: boolean = false,
  ): Promise<{ success: boolean; output: string }> {
    const filesStr = targetFiles.join(' ');
    const dryRunFlag = dryRun ? '--dry' : ''; // jscodeshift dry run
    const command = `npx jscodeshift -t ${codemodPath} ${filesStr} --parser=tsx ${dryRunFlag} --print`;

    try {
      console.log(`Executing codemod: ${command}`);
      const { stdout } = await execAsync(command);
      return { success: true, output: stdout };
    } catch (error: any) {
      console.error('Codemod execution failed:', error.message);
      return { success: false, output: error.message };
    }
  }
}
