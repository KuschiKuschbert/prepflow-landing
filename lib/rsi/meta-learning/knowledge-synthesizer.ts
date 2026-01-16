import { RuleGenerator } from '../rule-evolution/rule-generator';
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
        // Delegate to RuleGenerator (which now has LLM powers)
        const rule = await RuleGenerator.generateFromInsight(insight);

        if (rule) {
          // Adapt GeneratedRule to SynthesizedRule interface if needed, or just push compatible object
          // Since GeneratedRule is different, we map it or push it.
          // However, the interface return type is SynthesizedRule[].
          // We should unify these types in a real refactor, but for now allows mapping.
          rules.push({
            id: rule.id,
            description: rule.description,
            ruleLogic: rule.definition, // Mapping definition to ruleLogic
            derivedFrom: [insight.patternId],
          });
        } else {
            // Fallback for continuity / safety
            const safePatternId = insight.patternId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
            rules.push({
              id: `rule-${safePatternId}-${Date.now()}`,
              description: `Auto-generated rule: Prioritize '${insight.patternId}' fixes (${(insight.confidence * 100).toFixed(0)}% success).`,
              ruleLogic: `if (issue.type === '${insight.patternId}') { prioritize(); }`,
              derivedFrom: [insight.patternId],
            });
        }
      }
    }

    return rules;
  }
}
