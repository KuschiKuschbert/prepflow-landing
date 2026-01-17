import { exec } from 'child_process';
import util from 'util';
import { runArchitectureAnalysis } from './architecture-analysis';
import { runPredictiveAnalysis } from './predictive-analysis';
import { SafetyChecker } from './safety/safety-checker';
import { PerformanceTracker } from './self-optimization/performance-tracker';

const execAsync = util.promisify(exec);

export interface OrchestratorConfig {
  dryRun?: boolean;
  modules: {
    autoFix: boolean;
    selfOptimize: boolean;
    metaLearning: boolean;
    ruleEvolution: boolean;
    autoRefactor: boolean;
    predictiveAnalysis: boolean;
    architectureAnalysis: boolean;
  };
}

export class RSIOrchestrator {
  static async run(config: OrchestratorConfig) {
    console.log('🤖 RSI Orchestrator Initializing...');

    // 1. Safety Check (Global Gate)
    if (!config.dryRun) {
      const isClean = await SafetyChecker.isGitClean();
      if (!isClean) {
        console.error('❌ Git working directory is not clean. Aborting RSI run.');
        return;
      }
    }

    PerformanceTracker.startTimer();

    try {
      // 2. Auto-Fixer
      if (config.modules.autoFix) {
        console.log('\n--- Module: Auto-Fixer ---');
        await this.runScript('rsi:fix', config.dryRun);
      }

      // 3. Self-Optimization
      if (config.modules.selfOptimize) {
        console.log('\n--- Module: Self-Optimization ---');
        await this.runScript('rsi:optimize', config.dryRun);
      }

      // 4. Meta-Learning
      if (config.modules.metaLearning) {
        console.log('\n--- Module: Meta-Learning ---');
        await this.runScript('rsi:evolve', config.dryRun);
      }

      // 5. Rule Evolution
      if (config.modules.ruleEvolution) {
        console.log('\n--- Module: Rule Evolution ---');
        await this.runScript('rsi:rule', config.dryRun, ['generate']);
      }

      // 6. Auto-Refactoring (Expensive, usually separate)
      if (config.modules.autoRefactor) {
        console.log('\n--- Module: Auto-Refactoring ---');
        await this.runScript('rsi:refactor', config.dryRun);
      }

      // 7. Predictive Analysis (merged from autonomous-developer)
      if (config.modules.predictiveAnalysis) {
        console.log('\n--- Module: Predictive Analysis ---');
        await runPredictiveAnalysis(config.dryRun);
      }

      // 8. Architecture Analysis (merged from autonomous-developer)
      if (config.modules.architectureAnalysis) {
        console.log('\n--- Module: Architecture Analysis ---');
        await runArchitectureAnalysis(config.dryRun);
      }
    } catch (error) {
      console.error('RSI Run failed:', error);
    } finally {
      const duration = PerformanceTracker.stopTimer();
      await PerformanceTracker.logPerformance({
        taskId: 'orchestrator-run',
        taskType: 'full-cycle',
        durationMs: duration,
        success: true,
      });

      // 9. Generate Dashboard Report
      try {
        const { RSIDashboard } = await import('./observability/dashboard');
        await RSIDashboard.generateReport();
      } catch (dashError) {
        console.error('Failed to generate dashboard:', dashError);
      }

      console.log(`\n✅ RSI Cycle Complete (${(duration / 1000).toFixed(2)}s)`);
    }
  }

  private static async runScript(
    scriptName: string,
    dryRun: boolean | undefined,
    args: string[] = [],
  ) {
    const dryRunFlag = dryRun ? '-- --dry-run' : '';
    const argsStr = args.join(' ');
    const command = `npm run ${scriptName} ${dryRunFlag} ${argsStr}`;

    console.log(`> Executing: ${command}`);
    try {
      const { stdout, stderr } = await execAsync(command);
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error: unknown) {
      console.error(`Script ${scriptName} failed:`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(errorMessage);
      // Don't throw, allow valid modules to finish?
      // For now, let's keep going.
    }
  }
}
