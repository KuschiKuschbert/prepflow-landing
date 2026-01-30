import { loadKnowledgeBase, saveKnowledgeBase } from './storage';
import type {
  KnowledgeBaseError,
  KnowledgeBaseFix,
  KnowledgeBasePattern,
  KnowledgeBaseRule,
} from './types';

/**
 * Add error to knowledge base
 */
export async function addErrorToKnowledgeBase(
  error: Omit<KnowledgeBaseError, 'fixes' | 'similarErrors' | 'preventionRules'>,
): Promise<void> {
  const kb = await loadKnowledgeBase();

  const kbError: KnowledgeBaseError = {
    ...error,
    fixes: [],
    similarErrors: [],
    preventionRules: [],
  };

  kb.errors.push(kbError);
  await saveKnowledgeBase(kb);
}

/**
 * Add fix to error in knowledge base
 */
export async function addFixToError(errorId: string, fix: KnowledgeBaseFix): Promise<void> {
  const kb = await loadKnowledgeBase();
  const error = kb.errors.find(err => err.id === errorId);

  if (error) {
    error.fixes.push(fix);
    await saveKnowledgeBase(kb);
  }
}

/**
 * Add pattern to knowledge base
 */
export async function addPatternToKnowledgeBase(pattern: KnowledgeBasePattern): Promise<void> {
  const kb = await loadKnowledgeBase();
  kb.patterns.push(pattern);
  await saveKnowledgeBase(kb);
}

/**
 * Add rule to knowledge base
 */
export async function addRuleToKnowledgeBase(rule: KnowledgeBaseRule): Promise<void> {
  const kb = await loadKnowledgeBase();
  kb.rules.push(rule);
  await saveKnowledgeBase(kb);
}

/**
 * Link similar errors
 */
export async function linkSimilarErrors(errorId1: string, errorId2: string): Promise<void> {
  const kb = await loadKnowledgeBase();
  const error1 = kb.errors.find(err => err.id === errorId1);
  const error2 = kb.errors.find(err => err.id === errorId2);

  if (error1 && error2) {
    if (!error1.similarErrors.includes(errorId2)) {
      error1.similarErrors.push(errorId2);
    }
    if (!error2.similarErrors.includes(errorId1)) {
      error2.similarErrors.push(errorId1);
    }
    await saveKnowledgeBase(kb);
  }
}

/**
 * Link prevention rule to error
 */
export async function linkPreventionRule(errorId: string, ruleId: string): Promise<void> {
  const kb = await loadKnowledgeBase();
  const error = kb.errors.find(err => err.id === errorId);

  if (error && !error.preventionRules.includes(ruleId)) {
    error.preventionRules.push(ruleId);
    await saveKnowledgeBase(kb);
  }
}
