import fs from 'fs';
import path from 'path';

/**
 * A/B Tester for RSI
 * Framework for running experiments on RSI strategies.
 */

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'stopped';
  startDate: string;
  endDate?: string;
  variants: ['A', 'B']; // Simplified to 2 variants
  metrics: {
    A: { count: number; successes: number; score: number };
    B: { count: number; successes: number; score: number };
  };
  winner?: 'A' | 'B' | null;
}

const EXPERIMENTS_FILE_PATH = path.join(process.cwd(), 'docs/rsi/experiments.json');

export class ABTester {
  /**
   * Get assignment for a specific experiment (A or B)
   * Determining assignment could be random or consistent based on a context hash.
   */
  static getVariant(experimentId: string, contextId: string = 'global'): 'A' | 'B' {
    // Simple deterministic assignment based on hash of string
    let hash = 0;
    const str = `${experimentId}:${contextId}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
  }

  static async recordResult(experimentId: string, variant: 'A' | 'B', success: boolean, scoreDelta: number = 0) {
    try {
      if (!fs.existsSync(EXPERIMENTS_FILE_PATH)) return;

      const content = fs.readFileSync(EXPERIMENTS_FILE_PATH, 'utf-8');
      const experiments: Experiment[] = JSON.parse(content || '[]');

      const expIndex = experiments.findIndex(e => e.id === experimentId && e.status === 'active');
      if (expIndex === -1) return;

      const exp = experiments[expIndex];
      exp.metrics[variant].count++;
      if (success) exp.metrics[variant].successes++;
      exp.metrics[variant].score += scoreDelta;

      fs.writeFileSync(EXPERIMENTS_FILE_PATH, JSON.stringify(experiments, null, 2));

    } catch (error) {
      console.error(`Failed to record A/B result for ${experimentId}:`, error);
    }
  }

  static async createExperiment(name: string, description: string): Promise<string> {
      // Stub for creating new experiments
      const id = name.toLowerCase().replace(/\s+/g, '-');
      // Logic to save new experiment...
      return id;
  }
}
