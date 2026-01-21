import * as fs from 'fs/promises';
import * as path from 'path';
import type { KnowledgeBase } from './types';

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
