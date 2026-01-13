/**
 * Rule Generator
 * Converts high-level insights into concrete, enforceable rules.
 */

export interface GeneratedRule {
  id: string;
  name: string;
  description: string;
  type: 'regex' | 'ast' | 'file-structure';
  definition: string; // The actual rule logic (e.g., regex pattern)
  severity: 'error' | 'warning';
  generatedFrom: string; // Insight ID
}

export class RuleGenerator {
  static async generateFromInsight(insight: any): Promise<GeneratedRule | null> {
    // Mock logic: Convert a "Frequency" insight into a rule
    // e.g., Insight: "Replacing 'any' with specific interfaces has 100% success"
    // Rule: Warn on 'any' usage in that context.

    if (insight.insight.includes('Replacing "any"')) {
      return {
        id: `rule-no-any-${Date.now()}`,
        name: 'No Explicit Any in API',
        description: 'Avoid using "any" type in API routes; use specific interfaces.',
        type: 'regex',
        definition: ': \\s*any\\b', // Simple regex to find ': any'
        severity: 'warning',
        generatedFrom: insight.patternId,
      };
    }

    return null;
  }
}
