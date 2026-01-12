import fs from 'fs';
import path from 'path';

/**
 * Effectiveness Tracker for RSI
 * Tracks the outcomes and effectiveness of applied improvements.
 */

export interface FeedbackRecord {
  id: string; // ID of the change being evaluated
  timestamp: string;
  source: 'test' | 'build' | 'user' | 'performance_metric';
  outcome: 'positive' | 'negative' | 'neutral';
  details: string;
  metrics?: Record<string, number>;
}

const FEEDBACK_FILE_PATH = path.join(process.cwd(), 'docs/rsi/feedback.json');

export class EffectivenessTracker {
  /**
   * Log feedback for a specific change
   */
  static async logFeedback(record: Omit<FeedbackRecord, 'timestamp'>): Promise<void> {
    const timestamp = new Date().toISOString();
    const newRecord: FeedbackRecord = {
      timestamp,
      ...record
    };

    try {
      let logs: FeedbackRecord[] = [];
      if (fs.existsSync(FEEDBACK_FILE_PATH)) {
        const content = fs.readFileSync(FEEDBACK_FILE_PATH, 'utf-8');
        logs = JSON.parse(content || '[]');
      }

      logs.push(newRecord);
      fs.writeFileSync(FEEDBACK_FILE_PATH, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to log RSI feedback:', error);
    }
  }

  /**
   * Get all feedback for a specific change ID
   */
  static async getFeedbackForChange(changeId: string): Promise<FeedbackRecord[]> {
    try {
      if (!fs.existsSync(FEEDBACK_FILE_PATH)) return [];
      const content = fs.readFileSync(FEEDBACK_FILE_PATH, 'utf-8');
      const logs: FeedbackRecord[] = JSON.parse(content || '[]');
      return logs.filter(l => l.id === changeId);
    } catch (error) {
      console.error('Failed to read RSI feedback:', error);
      return [];
    }
  }
}
