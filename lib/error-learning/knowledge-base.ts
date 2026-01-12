/**
 * Knowledge Base Management
 * Manages structured knowledge base for errors, patterns, and rules
 */

import fs from 'fs/promises';
import path from 'path';

export interface KnowledgeBaseError {
  id: string;
  errorType: string;
  category: string;
  severity: string;
  pattern: string;
  context: {
    file?: string;
    line?: number;
    environment?: string;
    [key: string]: unknown;
  };
  fixes: KnowledgeBaseFix[];
  similarErrors: string[];
  preventionRules: string[];
}

export interface KnowledgeBaseFix {
  id: string;
  solution: string;
  codeChanges?: string;
  prevention: string;
  documentedAt: string;
  documentedBy: 'system' | 'user';
}

export interface KnowledgeBasePattern {
  id: string;
  name: string;
  description: string;
  detection: string;
  fix: string;
  prevention: string;
}

export interface KnowledgeBaseRule {
  id: string;
  name: string;
  source: string;
  enforcement: 'automated' | 'manual';
}

export interface KnowledgeBase {
  version: string;
  lastUpdated: string;
  errors: KnowledgeBaseError[];
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}

const KNOWLEDGE_BASE_FILE = path.join(process.cwd(), 'docs/errors/knowledge-base.json');

/**
 * Load knowledge base
 */
export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  try {
    const content = await fs.readFile(KNOWLEDGE_BASE_FILE, 'utf8');
    return JSON.parse(content) as KnowledgeBase;
  } catch {
    // Return default structure if file doesn't exist
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      errors: [],
      patterns: [],
      rules: [],
    };
  }
}

/**
 * Save knowledge base
 */
export async function saveKnowledgeBase(kb: KnowledgeBase): Promise<void> {
  const dir = path.dirname(KNOWLEDGE_BASE_FILE);
  await fs.mkdir(dir, { recursive: true });
  
  kb.lastUpdated = new Date().toISOString();
  await fs.writeFile(KNOWLEDGE_BASE_FILE, JSON.stringify(kb, null, 2), 'utf8');
}

/**
 * Add error to knowledge base
 */
export async function addErrorToKnowledgeBase(error: Omit<KnowledgeBaseError, 'fixes' | 'similarErrors' | 'preventionRules'>): Promise<void> {
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

/**
 * Get error from knowledge base
 */
export async function getErrorFromKnowledgeBase(errorId: string): Promise<KnowledgeBaseError | null> {
  const kb = await loadKnowledgeBase();
  return kb.errors.find(err => err.id === errorId) || null;
}

/**
 * Get similar errors
 */
export async function getSimilarErrors(errorId: string): Promise<KnowledgeBaseError[]> {
  const kb = await loadKnowledgeBase();
  const error = kb.errors.find(err => err.id === errorId);
  
  if (!error) {
    return [];
  }
  
  return kb.errors.filter(err => error.similarErrors.includes(err.id));
}

/**
 * Search knowledge base
 */
export async function searchKnowledgeBase(query: string): Promise<{
  errors: KnowledgeBaseError[];
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}> {
  const kb = await loadKnowledgeBase();
  const queryLower = query.toLowerCase();
  
  const errors = kb.errors.filter(err =>
    err.pattern.toLowerCase().includes(queryLower) ||
    err.errorType.toLowerCase().includes(queryLower) ||
    err.category.toLowerCase().includes(queryLower),
  );
  
  const patterns = kb.patterns.filter(pattern =>
    pattern.name.toLowerCase().includes(queryLower) ||
    pattern.description.toLowerCase().includes(queryLower) ||
    pattern.detection.toLowerCase().includes(queryLower),
  );
  
  const rules = kb.rules.filter(rule =>
    rule.name.toLowerCase().includes(queryLower) ||
    rule.source.toLowerCase().includes(queryLower),
  );
  
  return { errors, patterns, rules };
}
