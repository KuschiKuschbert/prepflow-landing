#!/usr/bin/env node

/**
 * Dev Log Auto-Append Script
 * Appends a bullet to docs/DEV_LOG.md under today's date.
 * Usage: npm run dev:log "Summary of changes"
 *        npm run dev:log "Fix: Resolved auth bug" "Details here"
 */

const fs = require('fs');
const path = require('path');

const DOC_PATH = path.join(process.cwd(), 'docs/DEV_LOG.md');

function getTodaySection() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `## ${y}-${m}-${day}`;
}

function main() {
  const args = process.argv.slice(2);
  const summary = args[0];
  const detail = args.slice(1).join(' ').trim();

  if (!summary || !summary.trim()) {
    console.log('Usage: npm run dev:log "Summary of changes"');
    console.log('       npm run dev:log "Summary" "Optional detail"');
    return;
  }

  const bullet = detail ? `- **${summary.trim()}**: ${detail}` : `- **${summary.trim()}**`;

  const today = getTodaySection();
  let content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '# Dev Log\n\n';

  const todayIdx = content.indexOf(today);
  if (todayIdx >= 0) {
    const lineEnd = content.indexOf('\n', todayIdx);
    const insertAfter = lineEnd >= 0 ? lineEnd : content.length;
    const before = content.slice(0, insertAfter);
    const after = content.slice(insertAfter);
    content = before + '\n' + bullet + after;
  } else {
    const firstSection = content.match(/\n## \d{4}-\d{2}-\d{2}/);
    const insertAt = firstSection ? content.indexOf(firstSection[0]) : content.length;
    const before = content.slice(0, insertAt);
    const after = content.slice(insertAt);
    content = before + today + '\n\n' + bullet + '\n\n' + after;
  }

  fs.writeFileSync(DOC_PATH, content, 'utf8');
  console.log('Appended to docs/DEV_LOG.md');
}

main();
