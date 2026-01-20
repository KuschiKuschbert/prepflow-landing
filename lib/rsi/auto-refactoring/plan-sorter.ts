import type { RefactoringPlan } from './types';

export function sortPlans(plans: RefactoringPlan[]): RefactoringPlan[] {
  return plans.sort((a, b) => {
    // 1. Favor explicit debt items (manually added)
    const aIsExplicit = !a.sourceDebtItem?.includes('Architecture Report');
    const bIsExplicit = !b.sourceDebtItem?.includes('Architecture Report');
    if (aIsExplicit && !bIsExplicit) return -1;
    if (!aIsExplicit && bIsExplicit) return 1;

    // 2. Then favor Spaghetti Code
    const aIsSpaghetti = a.title.includes('Spaghetti');
    const bIsSpaghetti = b.title.includes('Spaghetti');
    if (aIsSpaghetti && !bIsSpaghetti) return -1;
    if (!aIsSpaghetti && bIsSpaghetti) return 1;

    return b.impactScore - a.impactScore;
  });
}
