import { parseDebtFile, resolveDebtItem } from './debt-parser';
import { sortPlans } from './plan-sorter';
import { parseArchitectureReport } from './report-parser';
import { RefactoringPlan } from './types';

export class RefactoringPlanner {
  static async createPlan(): Promise<RefactoringPlan[]> {
    const plans: RefactoringPlan[] = [];

    // 1. Parse DEBT.md
    plans.push(...parseDebtFile());

    // 2. Parse Architecture Analysis Report
    plans.push(...parseArchitectureReport());

    // Sort by impact and type (Spaghetti Code first, then impact score)
    return sortPlans(plans);
  }

  /**
   * Automatically marks a debt item as resolved in DEBT.md
   * Delegate to debt-parser
   */
  static async resolveDebtItem(sourceItem: string): Promise<boolean> {
    return resolveDebtItem(sourceItem);
  }
}
