/**
 * Learning Strategy Interface
 * Defines how RSI analyzes success patterns.
 */

export interface LearningInsight {
  patternId: string;
  type: string;
  confidence: number;
  insight: string;
  sourceFiles: string[];
}

export interface LearningStrategy {
  name: string;
  analyze(history: any[]): Promise<LearningInsight[]>;
}

export class FrequencyAnalysisStrategy implements LearningStrategy {
  name = 'Frequency Analysis';

  async analyze(history: any[]): Promise<LearningInsight[]> {
    // Mock implementation for Phase 4
    // In reality, this would group successful fixes by type/pattern
    // and identify high-frequency successful patterns.

    // Example: "We fixed 10 'any' types in api routes successfully."

    return [
      {
        patternId: 'fix-any-types',
        type: 'frequency',
        confidence: 0.85,
        insight: 'Replacing "any" with specific interfaces has 100% success rate in API routes.',
        sourceFiles: [],
      },
    ];
  }
}
