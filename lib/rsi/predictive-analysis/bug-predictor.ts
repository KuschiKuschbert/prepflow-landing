import { loadKnowledgeBase } from '../../error-learning/knowledge-base';
import { findSimilarErrors } from '../../error-learning/pattern-matcher';
import type { BugPrediction } from './types';

function calculateBugProbability(
  pattern: { name: string; detection: string },
  similarErrorCount: number,
): number {
  let probability = 0.3;
  probability += Math.min(similarErrorCount * 0.15, 0.5);

  if (pattern.detection.toLowerCase().includes('missing try-catch')) {
    probability += 0.2;
  }

  if (pattern.detection.toLowerCase().includes('missing error handler')) {
    probability += 0.15;
  }

  return Math.min(probability, 0.95);
}

/**
 * Predict bugs in code based on learned patterns
 */
export async function predictBugs(filePath: string, content: string): Promise<BugPrediction[]> {
  const predictions: BugPrediction[] = [];
  const lines = content.split('\n');

  const kb = await loadKnowledgeBase();
  const highRiskPatterns = kb.patterns.filter(p => {
    const errorCount = kb.errors.filter(e => e.preventionRules.includes(p.id)).length;
    return errorCount >= 3;
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const pattern of highRiskPatterns) {
      const detectionKeywords = pattern.detection.toLowerCase().split(/\s+/);
      const hasPattern = detectionKeywords.some(keyword => {
        if (keyword.length < 3) return false;
        return line.toLowerCase().includes(keyword);
      });

      if (hasPattern) {
        const fixKeywords = pattern.fix.toLowerCase().split(/\s+/);
        const hasFix = fixKeywords.some(keyword => {
          if (keyword.length < 3) return false;
          return content.toLowerCase().includes(keyword);
        });

        if (!hasFix) {
          const similarErrors = await findSimilarErrors(
            pattern.detection,
            {
              file: filePath,
              line: lineNum,
              errorType: 'Predicted',
            },
            3,
          );

          const probability = calculateBugProbability(pattern, similarErrors.length);
          const risk =
            probability > 0.7
              ? 'critical'
              : probability > 0.5
                ? 'high'
                : probability > 0.3
                  ? 'medium'
                  : 'low';

          predictions.push({
            file: filePath,
            line: lineNum,
            risk,
            probability,
            predictedError: pattern.description,
            similarErrors: similarErrors.map(e => e.error.id),
            suggestion: pattern.fix,
            confidence: Math.min(similarErrors.length / 5, 1),
          });
        }
      }
    }
  }

  return predictions;
}
