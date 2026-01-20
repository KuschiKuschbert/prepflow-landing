import { logger } from '@/lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import type { RefactoringPlan } from './types';

function analyzeArchitectureIssue(
  type: string,
  file: string,
  description: string,
  priority: string,
): RefactoringPlan | null {
  let impactScore = 5;
  if (priority === 'high') impactScore = 8;
  if (priority === 'medium') impactScore = 5;

  // Safety: Do not auto-refactor RSI core files or build artifacts
  if (file.includes('lib/rsi') || file.includes('.next')) return null;

  if (type.includes('Spaghetti Code')) {
    return {
      id: `spaghetti-${Date.now()}-${file.replace(/\//g, '-')}`,
      title: `Fix Spaghetti Code in ${path.basename(file)}`,
      description: `Deep nesting detected: ${description}`,
      impactScore,
      riskScore: 4,
      status: 'pending',
      codemodPath: 'lib/rsi/auto-refactoring/codemods/extract-function.ts',
      targetFiles: [file],
      sourceDebtItem: `Architecture Report: ${type} in ${file}`,
    };
  }

  if (type.includes('Magic Numbers')) {
    return {
      id: `magic-numbers-${Date.now()}-${file.replace(/\//g, '-')}`,
      title: `Extract Magic Numbers in ${path.basename(file)}`,
      description: `Found magic numbers: ${description}`,
      impactScore: impactScore - 1,
      riskScore: 2,
      status: 'pending',
      codemodPath: 'lib/rsi/auto-refactoring/codemods/extract-constants.ts',
      targetFiles: [file],
      sourceDebtItem: `Architecture Report: ${type} in ${file}`,
    };
  }

  return null;
}

export function parseArchitectureReport(): RefactoringPlan[] {
  const plans: RefactoringPlan[] = [];
  const archPath = path.join(process.cwd(), 'reports/rsi-architecture-analysis.md');

  if (!fs.existsSync(archPath)) return plans;

  try {
    const content = fs.readFileSync(archPath, 'utf-8');
    const sections = content.split('### ').slice(1); // Split by anti-pattern entries

    for (const section of sections) {
      const lines = section.split('\n');
      const header = lines[0]; // e.g., "Spaghetti Code (HIGH)"
      const fileLine = lines.find(l => l.startsWith('**File:**'));
      const descLine = lines.find(l => l.startsWith('**Description:**'));

      if (fileLine && descLine) {
        const fileName = fileLine.replace('**File:**', '').trim().replace(/`/g, '');
        const description = descLine.replace('**Description:**', '').trim();
        const priority = header.includes('(HIGH)')
          ? 'high'
          : header.includes('(MEDIUM)')
            ? 'medium'
            : 'low';

        const plan = analyzeArchitectureIssue(header, fileName, description, priority);
        if (plan) plans.push(plan);
      }
    }
  } catch (error) {
    logger.error('Failed to parse architecture report', { error });
  }
  return plans;
}
