/**
 * Confidence Scorer for RSI
 * Determines the confidence level of a proposed change.
 */

export enum ConfidenceLevel {
  HIGH = 'HIGH', // > 90%: Auto-apply
  MEDIUM = 'MEDIUM', // 70-90%: Auto-apply with validation
  LOW = 'LOW', // < 70%: Create PR
}

export interface ConfidenceScore {
  score: number;
  level: ConfidenceLevel;
  reasons: string[];
}

export class ConfidenceScorer {
  /**
   * Calculate confidence score for a change
   * @param changeType - Type of change (e.g., 'refactor', 'fix', 'optimization')
   * @param complexity - Complexity score (0-1)
   * @param coverage - Test coverage impact (0-1)
   * @param riskFactors - List of potential risks
   */
  static score(
    changeType: string,
    complexity: number,
    coverage: number,
    riskFactors: string[] = [],
  ): ConfidenceScore {
    let score = 1.0;
    const reasons: string[] = [];

    // Base score by type
    switch (changeType) {
      case 'format':
      case 'lint':
        score = 0.99;
        reasons.push('Safe change type: formatting/linting');
        break;
      case 'refactor':
        score = 0.85;
        reasons.push('Standard refactoring risk');
        break;
      case 'logic-fix':
        score = 0.75;
        reasons.push('Logic changes require validation');
        break;
      case 'optimization':
        score = 0.7;
        reasons.push('Optimization carries regression risk');
        break;
      default:
        score = 0.6;
        reasons.push('Unknown change type');
    }

    // Complexity penalty
    if (complexity > 0.7) {
      score -= 0.15;
      reasons.push('High complexity penalty');
    } else if (complexity > 0.4) {
      score -= 0.05;
      reasons.push('Medium complexity penalty');
    }

    // Coverage bonus/penalty
    if (coverage > 0.8) {
      score += 0.05;
      reasons.push('High test coverage bonus');
    } else if (coverage < 0.5) {
      score -= 0.1;
      reasons.push('Low test coverage penalty');
    }

    // Risk factors
    if (riskFactors.length > 0) {
      score -= riskFactors.length * 0.1;
      reasons.push(`Risk factors penalty: ${riskFactors.length} detected`);
    }

    // Clamp score
    score = Math.max(0, Math.min(1, score));

    // Determine level
    let level = ConfidenceLevel.LOW;
    if (score >= 0.9) {
      level = ConfidenceLevel.HIGH;
    } else if (score >= 0.7) {
      level = ConfidenceLevel.MEDIUM;
    }

    return {
      score,
      level,
      reasons,
    };
  }

  /**
   * Create a ConfidenceScore from a raw value (0-1)
   * Used when providers already know their confidence level
   */
  static scoreFromValue(value: number, reason?: string): ConfidenceScore {
    const score = Math.max(0, Math.min(1, value));
    const reasons: string[] = reason ? [reason] : [`Provider confidence: ${(score * 100).toFixed(0)}%`];

    let level = ConfidenceLevel.LOW;
    if (score >= 0.9) {
      level = ConfidenceLevel.HIGH;
    } else if (score >= 0.7) {
      level = ConfidenceLevel.MEDIUM;
    }

    return { score, level, reasons };
  }
}
