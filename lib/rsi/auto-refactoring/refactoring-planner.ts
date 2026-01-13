import fs from 'fs';
import path from 'path';

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

export class RefactoringPlanner {
  static async createPlan(): Promise<RefactoringPlan[]> {
    const debtPath = path.join(process.cwd(), 'docs/DEBT.md');
    if (!fs.existsSync(debtPath)) {
      console.warn('⚠️ docs/DEBT.md not found. using fallback logic.');
      return [];
    }

    const content = fs.readFileSync(debtPath, 'utf-8');
    const plans: RefactoringPlan[] = [];

    // Parse DEBT.md
    // Looks for: - [ ] **[WEB]** ...
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

      // Match unchecked items: - [ ]
      if (line.trim().startsWith('- [ ]')) {
        const cleanLine = line.replace('- [ ]', '').trim();
        const plan = this.analyzeItem(cleanLine, currentPriority);
        if (plan) {
          plans.push(plan);
        }
      }
    }

    // Sort by impact (High priority first)
    return plans.sort((a, b) => b.impactScore - a.impactScore);
  }

  private static analyzeItem(itemText: string, priority: string): RefactoringPlan | null {
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
        codemodPath: 'scripts/codemods/no-any.js', // Hypothetical codemod
        targetFiles: this.extractPath(itemText) || ['app/**/*.ts'],
        sourceDebtItem: itemText,
      };
    }

    // 2. "console.log" or "logging"
    if (
      itemText.toLowerCase().includes('console.log') ||
      itemText.toLowerCase().includes('log.d')
    ) {
      return {
        id: `remove-logs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Remove Logs: ${title}`,
        description: itemText,
        impactScore: impactScore - 1, // Slightly lower impact than types
        riskScore: 1,
        status: 'pending',
        codemodPath: 'scripts/codemods/console-migration.js',
        targetFiles: this.extractPath(itemText) || ['app/**/*.{ts,tsx}'],
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

  private static extractPath(text: string): string[] | undefined {
    // Look for paths like `app/api/` or `components/` in the text
    const match = text.match(/`([^`]+)`/);
    if (
      match &&
      (match[1].includes('/') || match[1].endsWith('.ts') || match[1].endsWith('.tsx'))
    ) {
      // If it looks like a path
      let cleanPath = match[1];
      // Wildcard output for robustness
      if (cleanPath.endsWith('/')) return [`${cleanPath}**/*.{ts,tsx}`];
      return [cleanPath];
    }
    return undefined;
  }
}
