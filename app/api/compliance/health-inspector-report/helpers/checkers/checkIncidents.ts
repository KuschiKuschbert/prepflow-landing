import { Gap, Incidents } from '../types';

export function checkIncidents(incidents?: Incidents): Gap[] {
  const gaps: Gap[] = [];

  if (incidents?.unresolved && incidents.unresolved.length > 0) {
    gaps.push({
      type: 'unresolved_incidents',
      severity: 'medium',
      count: incidents.unresolved.length,
      description: `${incidents.unresolved.length} unresolved incident(s) require attention`,
    });
  }

  return gaps;
}
