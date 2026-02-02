/**
 * Rule Generation System
 * Generates rules from fix patterns to prevent similar errors
 */

import type { KnowledgeBasePattern, KnowledgeBaseRule } from './knowledge-base';
import {
  addPatternToKnowledgeBase,
  addRuleToKnowledgeBase,
  loadKnowledgeBase,
} from './knowledge-base';
import { extractPattern } from './pattern-extractor';
import { generateRule, updateErrorPatternsFile } from './rule-manager';

const MIN_FIX_COUNT_FOR_RULE = 3;

/**
 * Generate rules from knowledge base
 */
export async function generateRulesFromKnowledgeBase(): Promise<{
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}> {
  const kb = await loadKnowledgeBase();
  const newPatterns: KnowledgeBasePattern[] = [];
  const newRules: KnowledgeBaseRule[] = [];

  // Group errors by pattern
  const errorGroups: Record<string, typeof kb.errors> = {};

  for (const error of kb.errors) {
    const patternKey = `${error.errorType}-${error.category}`;
    if (!errorGroups[patternKey]) {
      errorGroups[patternKey] = [];
    }
    errorGroups[patternKey].push(error);
  }

  // Generate patterns from error groups with multiple fixes
  for (const [patternKey, errors] of Object.entries(errorGroups)) {
    // Collect all fixes for this pattern
    const allFixes = errors.flatMap(err =>
      err.fixes.map(fix => ({
        solution: fix.solution,
        prevention: fix.prevention,
      })),
    );

    if (allFixes.length >= MIN_FIX_COUNT_FOR_RULE) {
      // Check if pattern already exists
      const existingPattern = kb.patterns.find(p => p.id === patternKey);

      if (!existingPattern) {
        // Extract pattern
        const patternData = extractPattern(allFixes);

        if (patternData) {
          const pattern: KnowledgeBasePattern = {
            id: patternKey,
            ...patternData,
          };

          // Add to knowledge base
          await addPatternToKnowledgeBase(pattern);
          newPatterns.push(pattern);

          // Generate rule
          const rule = generateRule(pattern);
          await addRuleToKnowledgeBase(rule);
          newRules.push(rule);

          // Update error-patterns.mdc
          await updateErrorPatternsFile(pattern, rule);
        }
      }
    }
  }

  return { patterns: newPatterns, rules: newRules };
}

/**
 * Generate rules from recent fixes
 */
/**
 * Generate rules from recent fixes
 */
export async function generateRulesFromRecentFixes(days = 7): Promise<{
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}> {
  const kb = await loadKnowledgeBase();
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get recent fixes
  const recentFixes = kb.errors.flatMap(err =>
    err.fixes
      .filter(fix => new Date(fix.documentedAt) >= cutoffDate)
      .map(fix => ({
        errorType: err.errorType,
        category: err.category,
        solution: fix.solution,
        prevention: fix.prevention,
        badCode: err.pattern, // Assuming err.pattern contains the bad code snippet
      })),
  );

  // Group by error type and category
  const fixGroups: Record<string, typeof recentFixes> = {};

  for (const fix of recentFixes) {
    const key = `${fix.errorType}-${fix.category}`;
    if (!fixGroups[key]) {
      fixGroups[key] = [];
    }
    fixGroups[key].push(fix);
  }

  const newPatterns: KnowledgeBasePattern[] = [];
  const newRules: KnowledgeBaseRule[] = [];

  // Generate patterns for groups with enough fixes
  for (const [key, fixes] of Object.entries(fixGroups)) {
    if (fixes.length >= MIN_FIX_COUNT_FOR_RULE) {
      const patternData = extractPattern(
        fixes.map(f => ({
          solution: f.solution,
          prevention: f.prevention,
          badCode: f.badCode,
        })),
      );

      if (patternData) {
        const pattern: KnowledgeBasePattern = {
          id: key,
          ...patternData,
        };

        await addPatternToKnowledgeBase(pattern);
        newPatterns.push(pattern);

        // Enhanced Rule Generation using AST heuristics if available
        let rule: KnowledgeBaseRule;
        if (patternData.context && patternData.context.includes('CallExpression')) {
          // Attempt to synthesize a no-restricted-syntax rule
          rule = synthesizeRestrictedSyntaxRule(pattern);
        } else {
          rule = generateRule(pattern);
        }

        await addRuleToKnowledgeBase(rule);
        newRules.push(rule);

        await updateErrorPatternsFile(pattern, rule);
      }
    }
  }

  return { patterns: newPatterns, rules: newRules };
}

/**
 * Synthesize a highly specific ESLint no-restricted-syntax rule
 * This is a heuristic-based generator that attempts to create valid selectors
 */
function synthesizeRestrictedSyntaxRule(pattern: KnowledgeBasePattern): KnowledgeBaseRule {
  // 1. naive heuristic: if the bad pattern is a function call "foo()"
  // we want a selector like CallExpression[callee.name='foo']
  let selector = '';
  const badCode = pattern.badPattern ? pattern.badPattern.trim() : '';

  // Check for Simple CallExpression: foo()
  const callMatch = badCode.match(/^(\w+)\s*\(/);
  if (callMatch) {
    const funcName = callMatch[1];
    selector = `CallExpression[callee.name='${funcName}']`;
  }

  // Check for MemberExpression Call: foo.bar()
  const memberCallMatch = badCode.match(/^(\w+)\.(\w+)\s*\(/);
  if (memberCallMatch) {
    const obj = memberCallMatch[1];
    const prop = memberCallMatch[2];
    selector = `CallExpression[callee.object.name='${obj}'][callee.property.name='${prop}']`;
  }

  // Fallback to basic regex if no AST selector could be built
  if (!selector) {
    return generateRule(pattern);
  }

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
