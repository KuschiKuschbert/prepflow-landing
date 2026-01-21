import { logger } from '@/lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import type { RefactoringPlan } from '../types';
import { analyzeItem } from './analyzer';

export function parseDebtFile(): RefactoringPlan[] {
  const plans: RefactoringPlan[] = [];
  const debtPath = path.join(process.cwd(), 'docs/DEBT.md');

  if (!fs.existsSync(debtPath)) return plans;

  try {
    const content = fs.readFileSync(debtPath, 'utf-8');
    const lines = content.split('\n');
    let currentPriority = 'low';

    for (const line of lines) {
      if (line.includes('## High Priority')) {
        currentPriority = 'high';
        continue;
      } else if (line.includes('## Medium Priority')) {
        currentPriority = 'medium';
        continue;
      } else if (line.includes('## Low Priority')) {
        currentPriority = 'low';
        continue;
      }

      if (line.trim().startsWith('- [ ]')) {
        const cleanLine = line.replace('- [ ]', '').trim();
        const plan = analyzeItem(cleanLine, currentPriority);
        if (plan) plans.push(plan);
      }
    }
  } catch (error) {
    logger.error('Failed to parse DEBT.md', { error });
  }
  return plans;
}
