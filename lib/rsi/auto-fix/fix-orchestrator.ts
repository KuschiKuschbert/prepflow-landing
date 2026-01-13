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
    console.log('🤖 RSI Auto-Fixer Starting...');

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
      console.log(`Scanning with ${provider.name}...`);
      try {
        const suggestions = await provider.scan(options.files);
        allSuggestions.push(...suggestions);
      } catch (err) {
        console.error(`Error scanning with ${provider.name}:`, err);
      }
    }

    if (allSuggestions.length === 0) {
      console.log('✅ No issues found.');
      return;
    }

    console.log(`Found ${allSuggestions.length} potential fixes.`);

    // 3. Process Suggestions
    for (const suggestion of allSuggestions) {
      await this.processSuggestion(suggestion, options);
    }
  }

  private async processSuggestion(suggestion: FixSuggestion, options: AutoFixOptions) {
    // Score Confidence
    const score = ConfidenceScorer.score(suggestion.type, 0.5, 0.8); // Simplified scoring for now

    // Check Threshold
    if (score.level === ConfidenceLevel.LOW) {
      console.log(
        `⚠️ Skipping Low Confidence fix: ${suggestion.description} (${score.score.toFixed(2)})`,
      );
      return;
    }

    // Dry Run
    if (options.dryRun) {
      console.log(`[DRY RUN] Would apply: ${suggestion.description} (${score.level})`);
      return;
    }

    // Apply Fix
    console.log(`Applying fix: ${suggestion.description}...`);
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

          console.log(`✅ Fixed & Committed: ${suggestion.description}`);
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
    const message = `fix(rsi): ${suggestion.description}\n\n[RSI Auto-Fix] Type: ${suggestion.type}`;
    await execAsync(`git add ${suggestion.file}`);
    await execAsync(`git commit -m "${message}"`);
  }
}
