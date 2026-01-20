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
        fixes.map(f => ({ solution: f.solution, prevention: f.prevention })),
      );

      if (patternData) {
        const pattern: KnowledgeBasePattern = {
          id: key,
          ...patternData,
        };

        await addPatternToKnowledgeBase(pattern);
        newPatterns.push(pattern);

        const rule = generateRule(pattern);
        await addRuleToKnowledgeBase(rule);
        newRules.push(rule);

        await updateErrorPatternsFile(pattern, rule);
      }
    }
  }

  return { patterns: newPatterns, rules: newRules };
}
