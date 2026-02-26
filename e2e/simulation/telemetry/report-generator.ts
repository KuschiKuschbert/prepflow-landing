/**
 * Simulation report generator - outputs SIMULATION_REPORT.md and SIMULATION_REPORT.json.
 */
import * as fs from 'fs';
import * as path from 'path';
import type { SimulationErrorRecord } from './types';
import { getBottlenecks, getFaultyPaths } from './collector';

/** Patterns to exclude from simulation reports (Auth0/SSO noise, image 4xx, known benign) */
const SIMULATION_REPORT_EXCLUDE: RegExp[] = [
  /ssodata|user\/ssodata/i,
  /_next\/image/i,
  /sso.*warning|sso.*error|sso.*data/i,
  /gravatar\.com/i,
  /api\/admin\/check/i,
  /partytown.*debug|~\/partytown/i,
  // Next.js dev-mode hydration mismatches (SSR/client aria-label differences, date rendering)
  /hydration failed/i,
  /server rendered html didn't match/i,
  // Image layout warnings (known issue with fill + static parent)
  /has "fill" and parent element with invalid "position"/i,
  // Expected app behaviour: no logs found for equipment
  /no logs found for equipment/i,
  // Chunk load failures during hot-reload in dev mode
  /ChunkLoadError|loading chunk.*failed/i,
  // Supabase direct REST 4xx from camelCase column name mismatches (benign - app uses Next.js API route)
  /supabase\.co.*temperature_equipment/i,
  // Square POS integration - excluded from testing scope
  /square_pos_integration/i,
  /api\/features\/square/i,
];

function excludeFromReport(error: SimulationErrorRecord): boolean {
  const msg = (error.message || '').toLowerCase();
  const url = (error.url || '').toLowerCase();
  const combined = `${msg} ${url}`;
  return SIMULATION_REPORT_EXCLUDE.some(p => p.test(combined));
}

export interface SimulationSummary {
  personaCount: number;
  totalErrors: number;
  totalBottlenecks: number;
  totalFaultyPaths: number;
  durationMs?: number;
}

export function generateSimulationReport(
  errors: SimulationErrorRecord[],
  summary: SimulationSummary,
  personaId?: string,
): void {
  const bottlenecks = getBottlenecks();
  const faultyPaths = getFaultyPaths();

  const filteredErrors = errors.filter(e => !excludeFromReport(e));
  const report = {
    summary: {
      ...summary,
      totalErrors: filteredErrors.length,
      totalBottlenecks: bottlenecks.length,
      totalFaultyPaths: faultyPaths.length,
    },
    errors: filteredErrors,
    bottlenecks,
    faultyPaths,
    generatedAt: new Date().toISOString(),
  };

  const outputDir = path.join(process.cwd(), 'e2e', 'simulation', 'reports');
  fs.mkdirSync(outputDir, { recursive: true });
  const suffix = personaId ? `_${personaId}` : '';
  const mdPath = path.join(outputDir, `SIMULATION_REPORT${suffix}.md`);
  const jsonPath = path.join(outputDir, `SIMULATION_REPORT${suffix}.json`);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = buildMarkdownReport(filteredErrors, bottlenecks, faultyPaths, summary);
  fs.writeFileSync(mdPath, md);
}

function buildMarkdownReport(
  errors: SimulationErrorRecord[],
  bottlenecks: ReturnType<typeof getBottlenecks>,
  faultyPaths: ReturnType<typeof getFaultyPaths>,
  summary: SimulationSummary,
): string {
  const lines: string[] = [
    '# Persona Simulation Report',
    '',
    '## Summary',
    '',
    `- Personas: ${summary.personaCount}`,
    `- Total Errors: ${errors.length} (Auth0/SSO/image noise excluded)`,
    `- Bottlenecks: ${bottlenecks.length}`,
    `- Faulty Paths: ${faultyPaths.length}`,
    summary.durationMs != null ? `- Duration: ${(summary.durationMs / 1000).toFixed(1)}s` : '',
    '',
    '---',
    '',
    '## Errors by Persona',
    '',
  ];

  const byPersona = new Map<string, SimulationErrorRecord[]>();
  for (const e of errors) {
    const key = e.personaId ?? 'unknown';
    const list = byPersona.get(key) ?? [];
    list.push(e);
    byPersona.set(key, list);
  }
  for (const [personaId, list] of byPersona) {
    lines.push(`### ${personaId}`);
    lines.push('');
    for (const e of list) {
      lines.push(`- **${e.type}** @ ${e.url}`);
      lines.push(`  ${e.message}`);
      if (e.action) lines.push(`  Action: ${e.action}`);
      lines.push('');
    }
  }

  lines.push('---', '', '## Bottlenecks', '');
  for (const b of bottlenecks) {
    lines.push(
      `- **${b.personaId}** / **${b.action}**: ${b.durationMs}ms (threshold ${b.thresholdMs}ms) @ ${b.url}`,
    );
  }
  lines.push('');

  lines.push('---', '', '## Faulty Paths', '');
  for (const f of faultyPaths) {
    lines.push(`- **${f.personaId}** / **${f.action}** @ ${f.url}`);
    if (f.errorMessage) lines.push(`  Error: ${f.errorMessage}`);
  }

  return lines.join('\n');
}
