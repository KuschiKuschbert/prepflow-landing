/**
 * RSI Architecture Analysis Module
 * Merged from autonomous-developer/architecture/adr-generator.ts
 *
 * Detects design patterns and anti-patterns, generates ADRs.
 */

import { logger } from '@/lib/logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { detectAntiPatterns } from './anti-patterns';
import { detectDesignPatterns } from './design-patterns';
import { AntiPattern, DesignPattern } from './types';

export * from './adr';
export * from './anti-patterns';
export * from './design-patterns';
export * from './types';

/**
 * Main entry point for RSI orchestrator
 */
export async function runArchitectureAnalysis(dryRun = false): Promise<void> {
  const rootDir = process.cwd();
  const reportsDir = path.join(rootDir, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  const dirsToScan = ['app', 'lib', 'components'];
  const allPatterns: Record<string, DesignPattern[]> = {};
  const allAntiPatterns: AntiPattern[] = [];

  // Helper to recursively scan directories
  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          await scanDir(fullPath);
        }
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf8');
        const relativePath = path.relative(rootDir, fullPath);

        const patterns = detectDesignPatterns(content, relativePath);
        if (patterns.length > 0) {
          allPatterns[relativePath] = patterns;
        }

        const antiPatterns = detectAntiPatterns(content, relativePath);
        if (antiPatterns.length > 0) {
          allAntiPatterns.push(...antiPatterns);
        }
      }
    }
  }

  if (dryRun) {
    logger.dev('  [DRY RUN] Would scan directories:', dirsToScan.join(', '));
    return;
  }

  for (const dir of dirsToScan) {
    const fullDir = path.join(rootDir, dir);
    try {
      if (
        await fs
          .stat(fullDir)
          .then(s => s.isDirectory())
          .catch(() => false)
      ) {
        await scanDir(fullDir);
      }
    } catch (_e) {
      logger.warn(`  Could not scan ${dir}, skipping...`);
    }
  }

  // Generate Report
  const reportPath = path.join(reportsDir, 'rsi-architecture-analysis.md');
  let markdown = '# 🏗️ RSI Architecture Analysis Report\n\n';
  markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
  markdown += `**Detected Design Patterns:** ${Object.values(allPatterns).reduce((acc, p) => acc + p.length, 0)}\n`;
  markdown += `**Detected Anti-Patterns:** ${allAntiPatterns.length}\n\n`;

  markdown += '## ⚠️ Anti-Patterns Detected\n\n';
  if (allAntiPatterns.length === 0) {
    markdown += '✅ No anti-patterns detected.\n\n';
  } else {
    for (const ap of allAntiPatterns) {
      markdown += `### ${ap.name} (${ap.severity.toUpperCase()})\n`;
      markdown += `**File:** \`${ap.file}\`\n`;
      markdown += `**Description:** ${ap.description}\n`;
      markdown += `**Suggestion:** ${ap.suggestion}\n\n`;
    }
  }

  markdown += '## 🧩 Design Patterns Usage\n\n';
  if (Object.keys(allPatterns).length === 0) {
    markdown += 'No specific design patterns detected.\n';
  } else {
    for (const [file, patterns] of Object.entries(allPatterns)) {
      markdown += `**${file}**\n`;
      for (const p of patterns) {
        markdown += `- **${p.name}** (${p.type}): ${p.description}\n`;
      }
      markdown += '\n';
    }
  }

  await fs.writeFile(reportPath, markdown, 'utf8');
}
