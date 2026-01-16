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
    const filesStr = targetFiles.map(f => `"${f}"`).join(' ');
    const dryRunFlag = dryRun ? '--dry' : ''; // jscodeshift dry run
    const command = `npx jscodeshift -t ${codemodPath} ${filesStr} --parser=tsx ${dryRunFlag}`;

    try {
      console.log(`Executing codemod: ${command}`);
      const { stdout, stderr } = await execAsync(command);
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      return { success: true, output: stdout };
    } catch (error: any) {
      console.error('Codemod execution failed:', error.message);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(error.stderr);
      return { success: false, output: error.message };
    }
  }
}
