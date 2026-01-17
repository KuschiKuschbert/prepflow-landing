import { Gap, TemperatureViolations } from '../types';

export function checkTemperatureViolations(violations?: TemperatureViolations): Gap[] {
  const gaps: Gap[] = [];

  if (violations?.total_violations && violations.total_violations > 0) {
    gaps.push({
      type: 'temperature_violations',
      severity: 'high',
      count: violations.total_violations,
      description: `${violations.total_violations} temperature violation(s) detected`,
    });
  }

  return gaps;
}
