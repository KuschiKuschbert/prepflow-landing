import { exec } from 'child_process';
import * as util from 'util';
import { runArchitectureAnalysis } from './architecture-analysis';
import { RSIDashboard } from './observability/dashboard';
import { runPredictiveAnalysis } from './predictive-analysis';
import { SafetyChecker } from './safety/safety-checker';
import { PerformanceTracker } from './self-optimization/performance-tracker';

import { logger } from '@/lib/logger';

const execAsync = util.promisify(exec);

export interface OrchestratorConfig {
  dryRun?: boolean;
  modules: {
    autoFix: boolean;
    selfOptimize: boolean;
    metaLearning: boolean;
    ruleEvolution: boolean;
    skillEvolution: boolean;
    autoRefactor: boolean;
    predictiveAnalysis: boolean;
    architectureAnalysis: boolean;
  };
}

export class RSIOrchestrator {
  static async run(config: OrchestratorConfig) {
    // 1. Safety Check (Global Gate)
    if (!config.dryRun) {
      const isClean = await SafetyChecker.isGitClean();
      if (!isClean) {
        logger.error('❌ Git working directory is not clean. Aborting RSI run.');

        // Log failure to tracked file so it triggers a PR/notification
        await PerformanceTracker.logPerformance({
          taskId: 'orchestrator-safety-check',
          taskType: 'safety-gate',
          durationMs: 0,
          success: false,
          metadata: { error: 'Git working directory not clean' },
        });
        return;
      }
    }

    PerformanceTracker.startTimer();

    try {
      // 2. Auto-Fixer
      if (config.modules.autoFix) {
        await this.runScript('rsi:fix', config.dryRun);
      }

      // 3. Self-Optimization
      if (config.modules.selfOptimize) {
        await this.runScript('rsi:optimize', config.dryRun);
      }

      // 4. Meta-Learning
      if (config.modules.metaLearning) {
        await this.runScript('rsi:evolve', config.dryRun);
      }

      // 5. Rule Evolution
      if (config.modules.ruleEvolution) {
        await this.runScript('rsi:rule', config.dryRun, ['generate']);
      }

      // 5b. Skill Evolution (from error-learning + RSI - runs during rsi:evolve and skill:evolve)
      if (config.modules.skillEvolution) {
        await this.runScript('skill:evolve', config.dryRun, ['--auto-map']);
      }

      // 6. Auto-Refactoring (Expensive, usually separate)
      if (config.modules.autoRefactor) {
        await this.runScript('rsi:refactor', config.dryRun);
      }

      // 7. Predictive Analysis (merged from autonomous-developer)
      if (config.modules.predictiveAnalysis) {
        await runPredictiveAnalysis(config.dryRun);
      }

      // 8. Architecture Analysis (merged from autonomous-developer)
      if (config.modules.architectureAnalysis) {
        await runArchitectureAnalysis(config.dryRun);
      }

      // 9. Final Formatting (Crucial for CI/CD compliance)
      if (!config.dryRun) {
        logger.info('🧹 Running final formatting...');
        await this.runScript('format', false);
      }
    } catch (error) {
      logger.error('RSI Run failed:', error);
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
        await RSIDashboard.generateReport();
      } catch (dashError) {
        logger.error('Failed to generate dashboard:', dashError);
      }
      logger.dev(`\n✅ RSI Cycle Complete (${(duration / 1000).toFixed(2)}s)`);
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
    try {
      const { stdout: _stdout, stderr } = await execAsync(command);
      if (stderr) logger.error(stderr);
    } catch (error: unknown) {
      logger.error(`Script ${scriptName} failed:`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(errorMessage);
      // Don't throw, allow valid modules to finish?
      // For now, let's keep going.
    }
  }
}
