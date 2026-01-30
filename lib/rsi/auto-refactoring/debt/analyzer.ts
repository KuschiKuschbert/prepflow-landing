import type { RefactoringPlan } from '../types';
import { extractPath } from '../utils';

export function analyzeItem(itemText: string, priority: string): RefactoringPlan | null {
  // Heuristic parsing to map description to codemods

  let impactScore = 5;
  if (priority === 'high') impactScore = 9;
  if (priority === 'medium') impactScore = 6;

  const title = itemText.replace(/\*\*\[.*?\]\*\*/, '').trim(); // Remove **[WEB]** tags

  // 1. "any" types
  if (itemText.toLowerCase().includes('any') && itemText.toLowerCase().includes('type')) {
    return {
      id: `fix-any-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `Fix 'any' Types: ${title}`,
      description: itemText,
      impactScore,
      riskScore: 2,
      status: 'pending',
      codemodPath: 'scripts/codemods/no-any.js', // Original placeholder
      targetFiles: extractPath(itemText) || ['app/**/*.ts'],
      sourceDebtItem: itemText,
    };
  }

  // 2. Zod Validation
  if (itemText.toLowerCase().includes('zod')) {
    return {
      id: `zod-std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `Standardize Zod: ${title}`,
      description: itemText,
      impactScore,
      riskScore: 2,
      status: 'pending',
      codemodPath: 'lib/rsi/auto-refactoring/codemods/zod-standardization.ts',
      targetFiles: extractPath(itemText) || ['app/api/**/*.ts'],
      sourceDebtItem: itemText,
    };
  }

  // 3. Dead Code
  if (
    itemText.toLowerCase().includes('dead code') ||
    itemText.toLowerCase().includes('unused import')
  ) {
    return {
      id: `dead-code-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `Remove Dead Code: ${title}`,
      description: itemText,
      impactScore: impactScore - 1,
      riskScore: 3,
      status: 'pending',
      codemodPath: 'lib/rsi/auto-refactoring/codemods/remove-dead-code.ts',
      targetFiles: extractPath(itemText) || ['app/**/*.{ts,tsx}', 'lib/**/*.ts'],
      sourceDebtItem: itemText,
    };
  }

  // 4. "console.log" or "logging"
  if (itemText.toLowerCase().includes('log') || itemText.toLowerCase().includes('logger')) {
    return {
      id: `sanitize-logs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `Sanitize Logs: ${title}`,
      description: itemText,
      impactScore: impactScore - 2,
      riskScore: 1,
      status: 'pending',
      codemodPath: 'lib/rsi/auto-refactoring/codemods/log-sanitization.ts',
      targetFiles: extractPath(itemText) || ['app/**/*.{ts,tsx}', 'lib/**/*.ts', '!lib/rsi/**/*'],
      sourceDebtItem: itemText,
    };
  }

  // 3. Fallback for manually tracked items (no auto-refactor path yet)
  // We still return them so the system is aware, but without a codemodPath
  return {
    id: `manual-debt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: `Manual Debt: ${title}`,
    description: `Action required: ${itemText}`,
    impactScore: impactScore - 2,
    riskScore: 5,
    status: 'pending',
    sourceDebtItem: itemText,
  };
}
