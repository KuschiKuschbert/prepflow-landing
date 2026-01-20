export interface RefactoringPlan {
  id: string;
  title: string;
  description: string;
  impactScore: number; // 0-10
  riskScore: number; // 0-10
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  codemodPath?: string;
  targetFiles?: string[];
  sourceDebtItem?: string;
}
