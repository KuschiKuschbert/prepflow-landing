import { logger } from '@/lib/logger';
import { exec } from 'child_process';
import util from 'util';
import { EffectivenessTracker } from '../feedback/effectiveness-tracker';
import { ChangeTracker } from '../safety/change-tracker';
import { ConfidenceLevel, ConfidenceScorer } from '../safety/confidence-scorer';
import { SafetyChecker } from '../safety/safety-checker';
import { FixProvider, FixSuggestion } from './fix-provider';

const execAsync = util.promisify(exec);

export interface AutoFixOptions {
  files?: string[];
  dryRun?: boolean;
  minConfidence?: ConfidenceLevel;
}

export class FixOrchestrator {
  private providers: FixProvider[] = [];

  registerProvider(provider: FixProvider) {
    this.providers.push(provider);
  }

  async run(options: AutoFixOptions = {}) {
    logger.info('🤖 RSI Auto-Fixer Starting...');

    // 1. Safety Check
    if (!options.dryRun) {
      const isClean = await SafetyChecker.isGitClean();
      if (!isClean) {
        console.error('❌ Git working directory is not clean. Aborting auto-fix.');
        return;
      }
    }

    // 2. Scan for Fixes
    const allSuggestions: FixSuggestion[] = [];
    for (const provider of this.providers) {
      logger.info(`Scanning with ${provider.name}...`);
      try {
        const suggestions = await provider.scan(options.files);
        allSuggestions.push(...suggestions);
      } catch (err) {
        console.error(`Error scanning with ${provider.name}:`, err);
      }
    }

    if (allSuggestions.length === 0) {
      logger.info('✅ No issues found.');
      return;
    }

    logger.info(`Found ${allSuggestions.length} potential fixes.`);

    // 3. Process Suggestions
    for (const suggestion of allSuggestions) {
      await this.processSuggestion(suggestion, options);
    }
  }

  private async processSuggestion(suggestion: FixSuggestion, options: AutoFixOptions) {
    // Use the confidence score from the provider (they know their fix quality best)
    const score = ConfidenceScorer.scoreFromValue(suggestion.confidenceScore);

    // Check Threshold (default: accept MEDIUM and HIGH confidence)
    const minConfidence = options.minConfidence ?? ConfidenceLevel.MEDIUM;
    if (score.level === ConfidenceLevel.LOW && minConfidence !== ConfidenceLevel.LOW) {
      logger.info(
        `⚠️ Skipping Low Confidence fix: ${suggestion.description} (${score.score.toFixed(2)})`,
      );
      return;
    }

    // Dry Run
    if (options.dryRun) {
      logger.info(
        `[DRY RUN] Would apply: ${suggestion.description} (${score.level}, ${score.score.toFixed(2)})`,
      );
      return;
    }

    // Apply Fix
    logger.info(`Applying fix: ${suggestion.description}...`);
    try {
      const success = await suggestion.apply();

      if (success) {
        // Verify (if available)
        let verified = true;
        if (suggestion.verify) {
          verified = await suggestion.verify();
        }

        if (verified) {
          // Commit
          await this.commitChange(suggestion);

          // Track
          const changeId = await ChangeTracker.logChange({
            type: suggestion.type,
            files: [suggestion.file],
            description: suggestion.description,
            confidenceScore: score.score,
            status: 'applied',
          });

          // Log Feedback (Optimistic)
          await EffectivenessTracker.logFeedback({
            id: changeId,
            source: 'performance_metric', // Placeholder source
            outcome: 'positive',
            details: 'Auto-fix applied successfully',
          });

          logger.info(`✅ Fixed & Committed: ${suggestion.description}`);
        } else {
          console.error(
            `❌ Verification failed for: ${suggestion.description}. Rolling back file.`,
          );
          await execAsync(`git checkout -- ${suggestion.file}`);
        }
      } else {
        console.error(`❌ Failed to apply fix: ${suggestion.description}`);
        await execAsync(`git checkout -- ${suggestion.file}`); // Ensure clean state
      }
    } catch (error) {
      console.error(`💥 Exception applying fix ${suggestion.description}:`, error);
      await execAsync(`git checkout -- ${suggestion.file}`); // Ensure clean state
    }
  }

  private async commitChange(suggestion: FixSuggestion) {
    // Set CI-safe git identity defaults if not already configured
    const hasEmail = await execAsync('git config user.email').catch(() => null);
    if (!hasEmail)
      await execAsync('git config user.email "github-actions[bot]@users.noreply.github.com"');
    const hasName = await execAsync('git config user.name').catch(() => null);
    if (!hasName) await execAsync('git config user.name "github-actions[bot]"');

    const message = `fix(rsi): ${suggestion.description}\n\n[RSI Auto-Fix] Type: ${suggestion.type}`;
    await execAsync(`git add ${suggestion.file}`);
    await execAsync(`git commit -m "${message}" --no-verify`);
  }
}
