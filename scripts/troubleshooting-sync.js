#!/usr/bin/env node

/**
 * Troubleshooting Sync Script
 * Suggests or applies TROUBLESHOOTING_LOG entries from knowledge-base errors.
 * Usage: npm run troubleshooting:suggest
 *        npm run troubleshooting:apply [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(process.cwd(), 'docs/errors/knowledge-base.json');
const LOG_PATH = path.join(process.cwd(), 'docs/TROUBLESHOOTING_LOG.md');

function gatherSuggested(logContent) {
  if (!fs.existsSync(KB_PATH)) return [];
  const kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
  const suggested = [];
  for (const err of kb.errors || []) {
    if (!err.fixes || err.fixes.length === 0) continue;
    const pattern = (err.pattern || err.errorType || '').toString().trim();
    const id = (err.id || '').toString();
    if (logContent.includes(pattern) || (id && logContent.includes(id))) continue;
    const fix = err.fixes[0];
    const solution = (fix.solution || '').trim();
    const prevention = (fix.prevention || '').trim();
    if (!solution) continue;
    const ctx = err.context || {};
    const contextNote =
      typeof ctx === 'object'
        ? Object.entries(ctx)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ')
        : String(ctx);
    suggested.push({
      id,
      pattern,
      errorType: err.errorType,
      category: err.category,
      solution,
      prevention,
      contextNote,
    });
  }
  return suggested;
}

function formatEntry(s) {
  const title = s.pattern || s.id || `${s.errorType}-${s.category}`;
  const fixLines = s.solution
    .split('\n')
    .filter(l => l.trim())
    .map((l, i) => (i === 0 ? `1. ${l.trim()}` : `   ${l.trim()}`))
    .join('\n');
  const symptom =
    s.pattern && !/^[\w-]+$/.test(s.pattern)
      ? s.pattern
      : `Error ${s.id || ''} (${s.errorType}-${s.category})`;
  const rootCause = s.contextNote || 'See knowledge-base context.';
  let block = `## ${title} (${s.errorType}-${s.category})\n\n`;
  block += `**Symptom:** ${symptom}\n\n`;
  block += `**Root Cause:** ${rootCause}\n\n`;
  block += `**Fix:**\n\n${fixLines}\n\n`;
  if (s.prevention) block += `**Derived Rule:** ${s.prevention}\n\n`;
  block += '---\n\n';
  return block;
}

function suggestMode() {
  console.log('Troubleshooting Sync – suggested entries from knowledge base');
  console.log('============================================================\n');
  if (!fs.existsSync(KB_PATH)) {
    console.log('Knowledge base not found.');
    return;
  }
  const logContent = fs.existsSync(LOG_PATH) ? fs.readFileSync(LOG_PATH, 'utf8') : '';
  const suggested = gatherSuggested(logContent);
  if (suggested.length === 0) {
    console.log('All knowledge-base errors appear documented in TROUBLESHOOTING_LOG.');
    return;
  }
  console.log(`Suggested entries (${suggested.length}):\n`);
  for (const s of suggested) {
    console.log(formatEntry(s));
  }
  console.log('Run `npm run troubleshooting:apply` to append, or copy manually.');
}

function applyMode() {
  const dryRun = process.argv.includes('--dry-run');
  console.log('Troubleshooting Apply' + (dryRun ? ' [DRY RUN]' : ''));
  console.log('====================\n');
  if (!fs.existsSync(KB_PATH)) {
    console.log('Knowledge base not found.');
    return;
  }
  const logContent = fs.existsSync(LOG_PATH) ? fs.readFileSync(LOG_PATH, 'utf8') : '';
  const suggested = gatherSuggested(logContent);
  if (suggested.length === 0) {
    console.log('Nothing to apply.');
    return;
  }
  console.log(`Would append ${suggested.length} entr${suggested.length === 1 ? 'y' : 'ies'}.`);
  for (const s of suggested) {
    console.log(`  - ${s.pattern || s.id} (${s.errorType}-${s.category})`);
  }
  if (dryRun) {
    console.log('\nRun without --dry-run to apply.');
    return;
  }
  const blocks = suggested.map(formatEntry).join('');
  const base =
    logContent ||
    '# Troubleshooting Log\n\nFormat: **Symptom** | **Root Cause** | **Fix** | **Derived Rule**\n\n---\n\n';
  const appended = base.trimEnd() + '\n\n' + blocks.trimEnd() + '\n';
  fs.writeFileSync(LOG_PATH, appended, 'utf8');
  console.log(
    `\nAppended ${suggested.length} entr${suggested.length === 1 ? 'y' : 'ies'} to docs/TROUBLESHOOTING_LOG.md`,
  );
}

function main() {
  const apply = process.argv.includes('apply') || process.argv.includes('--apply');
  if (apply) applyMode();
  else suggestMode();
}

main();
