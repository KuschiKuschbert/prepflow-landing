import * as fs from 'fs/promises';
import * as path from 'path';
import type { ArchitectureDecision, DesignPattern } from './types';

const ADR_DIR = path.join(process.cwd(), 'docs/architecture/adr');

function generateADRMarkdown(adr: ArchitectureDecision): string {
  return `# ${adr.id}: ${adr.title}

**Status:** ${adr.status}
**Date:** ${new Date(adr.createdAt).toLocaleDateString()}

## Context

${adr.context}

## Decision

${adr.decision}

## Consequences

${adr.consequences.map(c => `- ${c}`).join('\n')}

## Alternatives Considered

${adr.alternatives.map(a => `- ${a}`).join('\n')}
`;
}

async function saveADR(adr: ArchitectureDecision): Promise<void> {
  await fs.mkdir(ADR_DIR, { recursive: true });
  const filePath = path.join(ADR_DIR, `${adr.id}.md`);
  const markdown = generateADRMarkdown(adr);
  await fs.writeFile(filePath, markdown, 'utf8');
}

/**
 * Generate ADR from detected pattern
 */
export async function generateADRFromPattern(
  pattern: DesignPattern,
  context: string,
): Promise<string> {
  const adrId = `adr-${Date.now()}`;
  const adr: ArchitectureDecision = {
    id: adrId,
    title: `Use ${pattern.name} Pattern`,
    status: 'proposed',
    context,
    decision: `We will use the ${pattern.name} pattern for ${context}`,
    consequences: pattern.benefits,
    alternatives: [`Alternative: ${pattern.name}`, 'Alternative: Different pattern'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveADR(adr);
  return adrId;
}
