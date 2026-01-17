import * as fs from 'fs';
import * as path from 'path';

/**
 * Performance Tracker for RSI
 * Tracks execution metrics for RSI tasks to enable optimization.
 */

export interface PerformanceRecord {
  taskId: string;
  taskType: string;
  timestamp: string;
  durationMs: number;
  memoryUsageMb?: number;
  cpuUsagePercent?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

const METRICS_FILE_PATH = path.join(process.cwd(), 'docs/rsi/metrics.json');

export class PerformanceTracker {
  private static startTime: number | null = null;

  static startTimer() {
    this.startTime = performance.now();
  }

  static stopTimer(): number {
    if (this.startTime === null) return 0;
    const duration = performance.now() - this.startTime;
    this.startTime = null;
    return duration;
  }

  static async logPerformance(record: Omit<PerformanceRecord, 'timestamp'>): Promise<void> {
    const timestamp = new Date().toISOString();
    const newRecord: PerformanceRecord = {
      timestamp,
      ...record,
    };

    try {
      // In a real system, we might append to a separate log file or DB.
      // For this simplified version, we'll append to a specific section in metrics.json
      // or a new file if we want to keep it separate.
      // Let's assume we append to the generic metrics file for now,
      // but structured differently or just to a log file.
      // For clarity, let's just log to console for Phase 3 or append to a list in metrics.json if we define a schema.

      // Let's use a dedicated log file for raw performance logs to avoid bloating the main metrics summary.
      const perfLogPath = path.join(process.cwd(), 'docs/rsi/performance-logs.json');

      let logs: PerformanceRecord[] = [];
      if (fs.existsSync(perfLogPath)) {
        const content = fs.readFileSync(perfLogPath, 'utf-8');
        try {
          logs = JSON.parse(content || '[]');
        } catch {
          logs = [];
        }
      }

      logs.push(newRecord);

      // Keep log size manageable? For now, unlimited.
      fs.writeFileSync(perfLogPath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to log RSI performance:', error);
    }
  }

  static async getRecentMetrics(): Promise<PerformanceRecord[]> {
    const perfLogPath = path.join(process.cwd(), 'docs/rsi/performance-logs.json');
    try {
      if (!fs.existsSync(perfLogPath)) return [];
      const content = fs.readFileSync(perfLogPath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (error) {
      console.error('Failed to read RSI performance logs:', error);
      return [];
    }
  }
}
