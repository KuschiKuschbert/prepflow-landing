/**
 * Process a pattern group and persist to knowledge base. Extracted for filesize limit.
 */
import type { KnowledgeBasePattern, KnowledgeBaseRule } from '../knowledge-base';
import { addPatternToKnowledgeBase, addRuleToKnowledgeBase } from '../knowledge-base';
import { generateRule, updateErrorPatternsFile } from '../rule-manager';
import { synthesizeRestrictedSyntaxRule } from './synthesizeRule';

export async function processAndPersistPattern(
  key: string,
  patternData: Omit<KnowledgeBasePattern, 'id'>,
): Promise<{ pattern: KnowledgeBasePattern; rule: KnowledgeBaseRule }> {
  const pattern: KnowledgeBasePattern = { id: key, ...patternData };
  const rule =
    patternData.context && patternData.context.includes('CallExpression')
      ? synthesizeRestrictedSyntaxRule(pattern)
      : generateRule(pattern);

  await addPatternToKnowledgeBase(pattern);
  await addRuleToKnowledgeBase(rule);
  await updateErrorPatternsFile(pattern, rule);
  return { pattern, rule };
}
