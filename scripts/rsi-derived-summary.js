#!/usr/bin/env node

/**
 * RSI Derived Rules Summary
 * Generates docs/rsi/DERIVED_RULES_SUMMARY.md from recent improvements.
 * Usage: npm run rsi:derived-summary
 */

const fs = require('fs');
const path = require('path');

const IMPROVEMENTS_PATH = path.join(process.cwd(), 'docs/rsi/improvements.json');
const OUTPUT_PATH = path.join(process.cwd(), 'docs/rsi/DERIVED_RULES_SUMMARY.md');

const DEFAULT_DAYS = 7;

function main() {
  const args = process.argv.slice(2);
  const days = parseInt(args[0], 10) || DEFAULT_DAYS;

  if (!fs.existsSync(IMPROVEMENTS_PATH)) {
    console.log('No improvements.json found.');
    return;
  }

  const items = JSON.parse(fs.readFileSync(IMPROVEMENTS_PATH, 'utf8')) || [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recent = items.filter(item => {
    const ts = item.timestamp ? new Date(item.timestamp) : null;
    return ts && ts >= cutoff;
  });

  const byType = {};
  for (const item of recent) {
    const t = item.type || 'other';
    if (!byType[t]) byType[t] = [];
    byType[t].push(item);
  }

  const lines = [];
  lines.push('# RSI Derived Rules Summary');
  lines.push('');
  lines.push(`*Auto-generated at ${new Date().toISOString()} from last ${days} days*`);
  lines.push('');
  lines.push(`Total improvements: ${recent.length}`);
  lines.push('');
  lines.push('## By Type');
  lines.push('');

  for (const [type, list] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`### ${type} (${list.length})`);
    lines.push('');
    const seen = new Set();
    for (const item of list) {
      const d = (item.description || '').trim();
      if (d && !seen.has(d)) {
        seen.add(d);
        lines.push(`- ${d}`);
      }
    }
    lines.push('');
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf8');
  console.log(`Generated ${OUTPUT_PATH}`);
}

main();
