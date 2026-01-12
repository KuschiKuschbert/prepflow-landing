import { LearningInsight } from './learning-strategy';

/**
 * Knowledge Synthesizer
 * Aggregates insights into reusable knowledge/rules.
 */

export interface SynthesizedRule {
  id: string;
  description: string;
  ruleLogic: string; // Pseudocode or actual rule object
  derivedFrom: string[]; // Insight IDs
}

export class KnowledgeSynthesizer {
  static async synthesize(insights: LearningInsight[]): Promise<SynthesizedRule[]> {
    const rules: SynthesizedRule[] = [];

    for (const insight of insights) {
      if (insight.confidence > 0.8) {
        rules.push({
          id: `rule-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          description: `Auto-generated rule from insight: ${insight.insight}`,
          ruleLogic: `apply fix when pattern matches '${insight.patternId}'`,
          derivedFrom: [insight.patternId]
        });
      }
    }

    return rules;
  }
}
