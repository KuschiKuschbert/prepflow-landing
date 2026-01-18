import { exec } from 'child_process';
import * as util from 'util';
import { ChangeTracker } from './change-tracker';

const execAsync = util.promisify(exec);

/**
 * Rollback Manager for RSI
 * Handles reverting automated changes when things go wrong.
 */

export class RollbackManager {
  /**
   * Revert the last commit made by RSI
   */
  static async rollbackLastCommit(): Promise<boolean> {
    try {
      await execAsync('git revert HEAD --no-edit');
      return true;
    } catch (error) {
      console.error('Git revert failed:', error);
      return false;
    }
  }

  /**
   * Discard uncommitted changes
   */
  static async discardChanges(): Promise<boolean> {
    try {
      await execAsync('git reset --hard HEAD');
      return true;
    } catch (error) {
      console.error('Git reset failed:', error);
      return false;
    }
  }

  /**
   * Execute rollback for a specific change ID
   * @param changeId The ID of the change to rollback
   */
  static async rollbackChange(changeId: string): Promise<boolean> {
    try {
      // In a real sophisticated system, we'd map changeId to a git commit hash.
      // For Phase 1, we assume structured rollback via git if it was the last action,
      // or we manually restore files if we tracked content.

      // Strategy: Check if we have uncommitted changes. If so, discard them.
      // If pure git flow, we might need commit hashes in ChangeRecord.

      await this.discardChanges();

      await ChangeTracker.updateStatus(changeId, 'rolled_back');
      return true;
    } catch (error) {
      console.error(`Rollback failed for ${changeId}:`, error);
      return false;
    }
  }
}
