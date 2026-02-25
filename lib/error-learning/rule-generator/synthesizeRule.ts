/**
 * Synthesize ESLint no-restricted-syntax rules from patterns. Extracted for filesize limit.
 */
import type { KnowledgeBasePattern, KnowledgeBaseRule } from '../knowledge-base';
import { generateRule } from '../rule-manager';

/**
 * Synthesize a highly specific ESLint no-restricted-syntax rule
 * via heuristic-based generator that attempts to create valid selectors
 */
export function synthesizeRestrictedSyntaxRule(pattern: KnowledgeBasePattern): KnowledgeBaseRule {
  let selector = '';
  const badCode = pattern.badPattern ? pattern.badPattern.trim() : '';

  const callMatch = badCode.match(/^(\w+)\s*\(/);
  if (callMatch) {
    selector = `CallExpression[callee.name='${callMatch[1]}']`;
  } else {
    const memberCallMatch = badCode.match(/^(\w+)\.(\w+)\s*\(/);
    if (memberCallMatch) {
      selector = `CallExpression[callee.object.name='${memberCallMatch[1]}'][callee.property.name='${memberCallMatch[2]}']`;
    }
  }

  if (!selector) return generateRule(pattern);

  return {
    id: `rule-${pattern.id}`,
    name: `No generic ${pattern.id}`,
    source: 'rsi-synthesized',
    enforcement: 'automated',
    ruleId: `rsi/no-${pattern.id.toLowerCase()}`,
    description: `Detects ${pattern.id} usage via AST`,
    severity: 'error',
    implementation: `
          module.exports = {
            meta: {
              type: 'problem',
              docs: { description: '${pattern.description}' },
              messages: {
                noRestricted: 'The pattern "${badCode}" is restricted. Use "${pattern.goodPattern || 'alternative'}" instead.'
              }
            },
            create(context) {
              return {
                "${selector}"(node) {
                  context.report({
                    node,
                    messageId: 'noRestricted'
                  });
                }
              };
            }
          };
        `,
  };
}
