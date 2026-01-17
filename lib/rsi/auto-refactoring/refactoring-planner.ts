import * as fs from 'fs';
import * as path from 'path';

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
    const plans: RefactoringPlan[] = [];

    // 1. Parse DEBT.md
    const debtPath = path.join(process.cwd(), 'docs/DEBT.md');
    if (fs.existsSync(debtPath)) {
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
          const plan = this.analyzeItem(cleanLine, currentPriority);
          if (plan) plans.push(plan);
        }
      }
    }

    // 2. Parse Architecture Analysis Report
    const archPath = path.join(process.cwd(), 'reports/rsi-architecture-analysis.md');
    if (fs.existsSync(archPath)) {
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

          const plan = this.analyzeArchitectureIssue(header, fileName, description, priority);
          if (plan) plans.push(plan);
        }
      }
    }

    // Sort by impact and type (Spaghetti Code first, then impact score)
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

  private static analyzeArchitectureIssue(
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
        codemodPath: 'scripts/codemods/no-any.js', // Original placeholder
        targetFiles: this.extractPath(itemText) || ['app/**/*.ts'],
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
        targetFiles: this.extractPath(itemText) || ['app/api/**/*.ts'],
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
        targetFiles: this.extractPath(itemText) || ['app/**/*.{ts,tsx}', 'lib/**/*.ts'],
        sourceDebtItem: itemText,
      };
    }

    // 4. "console.log" or "logging"
    if (
      itemText.toLowerCase().includes('log') ||
      itemText.toLowerCase().includes('logger')
    ) {
      return {
        id: `sanitize-logs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Sanitize Logs: ${title}`,
        description: itemText,
        impactScore: impactScore - 2,
        riskScore: 1,
        status: 'pending',
        codemodPath: 'lib/rsi/auto-refactoring/codemods/log-sanitization.ts',
        targetFiles: this.extractPath(itemText) || ['app/**/*.{ts,tsx}', 'lib/**/*.ts', '!lib/rsi/**/*'],
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
    // 1. Look for backticked paths: `app/api/`
    const backtickMatch = text.match(/`([^`]+)`/);
    if (backtickMatch) {
      const pathStr = backtickMatch[1];
      if (pathStr.includes('/') || pathStr.endsWith('.ts') || pathStr.endsWith('.tsx')) {
        if (pathStr.endsWith('/')) return [`${pathStr}**/*.{ts,tsx}`];
        return [pathStr];
      }
    }

    // 2. Look for common path patterns without backticks: app/webapp or app/api/ingredients
    const pathRegex =
      /(app\/[a-zA-Z0-9\/\-_]+|components\/[a-zA-Z0-9\/\-_]+|lib\/[a-zA-Z0-9\/\-_]+)/g;
    const matches = text.match(pathRegex);
    if (matches && matches.length > 0) {
      // Return directory paths directly. jscodeshift walks directories recursively by default.
      // This is safer than globbing which depends on shell expansion.
      return matches.map(m => (m.endsWith('/') ? m.slice(0, -1) : m));
    }

    return undefined;
  }

  /**
   * Automatically marks a debt item as resolved in DEBT.md
   * @param sourceItem The exact text of the debt item to search for
   */
  static async resolveDebtItem(sourceItem: string): Promise<boolean> {
    try {
      const debtPath = path.join(process.cwd(), 'docs/DEBT.md');
      if (!fs.existsSync(debtPath)) return false;

      const content = fs.readFileSync(debtPath, 'utf-8');

      // Look for the specific line and mark it as checked
      // We search for the pattern "- [ ] ... sourceItem"
      const lines = content.split('\n');
      const index = lines.findIndex(l => l.includes('- [ ]') && l.includes(sourceItem));

      if (index !== -1) {
        lines[index] = lines[index].replace('- [ ]', '- [x]');
        fs.writeFileSync(debtPath, lines.join('\n'), 'utf-8');
        console.log(`✅ Marked debt item as resolved in DEBT.md: ${sourceItem}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to update DEBT.md:', error);
      return false;
    }
  }
}
