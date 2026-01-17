/**
 * Risk Assessor
 * Evaluates the risk of a proposed change based on affected paths and change type.
 */
export enum RiskLevel {
  LOW = 'LOW', // Safe to auto-apply and auto-merge
  MEDIUM = 'MEDIUM', // Safe to auto-apply, needs human review for merge
  HIGH = 'HIGH', // Needs human approval before apply
  CRITICAL = 'CRITICAL', // Blocked
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-10
  reasons: string[];
  requiresApproval: boolean;
}

export class RiskAssessor {
  // Paths considered "high risk" (e.g. core business logic, payments)
  private static HIGH_RISK_PATHS = [
    'app/api/billing/',
    'lib/auth/',
    'app/api/auth/',
    'app/api/security/',
  ];

  // Paths considered "safe" for auto-merge
  private static SAFE_PATHS = [
    'docs/rsi/',
    'reports/',
    'rsi.eslint.config',
    'lib/rsi/',
    'scripts/rsi/',
  ];

  static assess(type: string, files: string[]): RiskAssessment {
    let score = 2; // Base risk
    const reasons: string[] = [];

    // 1. Path Risk
    for (const file of files) {
      if (this.HIGH_RISK_PATHS.some(p => file.includes(p))) {
        score += 5;
        reasons.push(`High risk path detected: ${file}`);
      }

      if (!this.SAFE_PATHS.some(p => file.includes(p)) && !file.includes('.eslint')) {
        score += 1; // Generic code change
      }
    }

    // 2. Type Risk
    switch (type) {
      case 'lint-fix':
        score -= 1;
        reasons.push('Low risk change type: lint-fix');
        break;
      case 'cleanup':
        score += 0;
        reasons.push('Standard cleanup');
        break;
      case 'refactor':
        score += 3;
        reasons.push('Refactoring carries regression risk');
        break;
      case 'logic-fix':
        score += 5;
        reasons.push('Direct logic modification');
        break;
    }

    // Clamp score
    score = Math.max(0, Math.min(10, score));

    // Determine level
    let level = RiskLevel.LOW;
    if (score >= 8) level = RiskLevel.HIGH;
    else if (score >= 5) level = RiskLevel.MEDIUM;

    return {
      level,
      score,
      reasons,
      requiresApproval: level === RiskLevel.HIGH,
    };
  }
}
