import { exec } from 'child_process';
import * as util from 'util';

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
const { stdout, stderr } = await execAsync(command);
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      return { success: true, output: stdout };
    } catch (error: unknown) {
      const err = error as Error & { stdout?: string; stderr?: string };
      console.error('Codemod execution failed:', err.message);
      if (err.stdout) console.log(err.stdout);
      if (err.stderr) console.error(err.stderr);
      return { success: false, output: err.message };
    }
  }
}
