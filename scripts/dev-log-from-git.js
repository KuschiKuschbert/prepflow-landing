#!/usr/bin/env node

/**
 * Dev Log From Git
 * Appends to docs/DEV_LOG.md from last commit(s).
 * Usage: npm run dev:log:from-git [--yes] [--count=N]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const DOC_PATH = path.join(process.cwd(), 'docs/DEV_LOG.md');

function getCommits(count = 3) {
  try {
    const out = execSync(`git log -${count} --pretty=format:"%s%n%b---" --no-merges`, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024,
    });
    return out
      .split('---')
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => {
        const lines = block
          .split('\n')
          .filter(l => !/^(Co-authored-by|Signed-off-by|Reviewed-by):/i.test(l.trim()));
        const subject = lines[0] || '';
        const body = lines.slice(1).join('\n').trim();
        return { subject, body };
      });
  } catch {
    return [];
  }
}

function getTodaySection() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `## ${y}-${m}-${day}`;
}

function formatBullet(commit) {
  const summary = commit.subject.trim();
  return commit.body ? `- **${summary}**: ${commit.body}` : `- **${summary}**`;
}

function appendBullets(bullets) {
  const today = getTodaySection();
  let content = fs.existsSync(DOC_PATH) ? fs.readFileSync(DOC_PATH, 'utf8') : '# Dev Log\n\n';
  const block = '\n' + bullets.join('\n') + '\n';
  const todayIdx = content.indexOf(today);
  if (todayIdx >= 0) {
    const lineEnd = content.indexOf('\n', todayIdx);
    const insertAfter = lineEnd >= 0 ? lineEnd : content.length;
    const before = content.slice(0, insertAfter);
    const after = content.slice(insertAfter);
    content = before + block + after;
  } else {
    const firstSection = content.match(/\n## \d{4}-\d{2}-\d{2}/);
    const insertAt = firstSection ? content.indexOf(firstSection[0]) : content.length;
    const before = content.slice(0, insertAt);
    const after = content.slice(insertAt);
    content = before + today + '\n\n' + bullets.join('\n') + '\n\n' + after;
  }
  fs.writeFileSync(DOC_PATH, content, 'utf8');
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve((answer || '').trim().toLowerCase());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('--yes');
  const countArg = args.find(a => a.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) || 3 : 3;

  const commits = getCommits(count);
  if (commits.length === 0) {
    console.log('No recent commits. Use: npm run dev:log "summary"');
    return;
  }

  const bullets = commits.map(c => formatBullet(c));
  console.log('Would append to docs/DEV_LOG.md:\n');
  bullets.forEach(b => console.log('  ' + b));
  console.log('');

  if (!yes) {
    const answer = await prompt('Append these to DEV_LOG? (y/n): ');
    if (answer !== 'y' && answer !== 'yes' && answer !== '') {
      console.log('Aborted.');
      return;
    }
  }

  appendBullets(bullets);
  console.log('Appended to docs/DEV_LOG.md');
}

main().catch(console.error);
