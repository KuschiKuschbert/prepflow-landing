import * as fs from 'fs';
import * as path from 'path';

/**
 * Change Tracker for RSI
 * Logs all automated changes for audit and rollback purposes.
 */

export interface ChangeRecord {
  id: string;
  timestamp: string;
  type: string;
  files: string[];
  description: string;
  confidenceScore: number;
  status: 'applied' | 'failed' | 'rolled_back';
  metadata?: Record<string, any>;
}

const LOG_FILE_PATH = path.join(process.cwd(), 'docs/rsi/improvements.json');

export class ChangeTracker {
  static async logChange(record: Omit<ChangeRecord, 'id' | 'timestamp'>): Promise<string> {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const newRecord: ChangeRecord = {
      id,
      timestamp,
      ...record,
    };

    try {
      let logs: ChangeRecord[] = [];
      if (fs.existsSync(LOG_FILE_PATH)) {
        const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
        logs = JSON.parse(content || '[]');
      }

      logs.push(newRecord);
      fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));

      return id;
    } catch (error) {
      console.error('Failed to log RSI change:', error);
      throw error;
    }
  }

  static async updateStatus(id: string, status: ChangeRecord['status']): Promise<void> {
    try {
      if (!fs.existsSync(LOG_FILE_PATH)) return;

      const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      const logs: ChangeRecord[] = JSON.parse(content || '[]');

      const index = logs.findIndex(l => l.id === id);
      if (index !== -1) {
        logs[index].status = status;
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
      }
    } catch (error) {
      console.error('Failed to update RSI change status:', error);
    }
  }

  static async getHistory(): Promise<ChangeRecord[]> {
    try {
      if (!fs.existsSync(LOG_FILE_PATH)) return [];
      const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (error) {
      console.error('Failed to read RSI history:', error);
      return [];
    }
  }
  static async getRecentChanges(): Promise<ChangeRecord[]> {
    return this.getHistory();
  }
}
