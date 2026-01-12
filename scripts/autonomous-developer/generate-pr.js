#!/usr/bin/env node

/**
 * PR Generation Script
 * Generates PR descriptions and commit messages
 */

const {
  generatePRDescription,
  generateCommitMessage,
  generateChangelogEntry,
} = require('../../lib/autonomous-developer/communication/pr-generator');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generate PR description
 */
async function generatePR(baseBranch = 'main') {
  const pr = await generatePRDescription(baseBranch);

  console.log(`\n📝 PR Description Generated\n`);
  console.log(`Title: ${pr.title}\n`);
  console.log(pr.description);

  if (pr.breakingChanges && pr.breakingChanges.length > 0) {
    console.log(`\n⚠️ Breaking Changes:`);
    pr.breakingChanges.forEach(change => {
      console.log(`  - ${change}`);
    });
  }

  if (pr.testingNotes) {
    console.log(`\n🧪 Testing Notes:`);
    console.log(pr.testingNotes);
  }

  // Save to file
  const prDir = path.join(process.cwd(), 'docs/autonomous-developer/prs');
  if (!fs.existsSync(prDir)) {
    fs.mkdirSync(prDir, { recursive: true });
  }

  const prFile = path.join(prDir, `pr-${Date.now()}.md`);
  const prContent = `# ${pr.title}

${pr.description}

${pr.breakingChanges && pr.breakingChanges.length > 0 ? `## Breaking Changes\n\n${pr.breakingChanges.map(c => `- ${c}`).join('\n')}\n` : ''}

## Testing

${pr.testingNotes}

## Changes

${pr.changes.map(c => `- ${c}`).join('\n')}
`;

  fs.writeFileSync(prFile, prContent);
  console.log(`\n✅ PR description saved to: ${prFile}`);
}

/**
 * Generate commit message
 */
async function generateCommit(files) {
  const message = await generateCommitMessage(files);

  console.log(`\n📝 Suggested Commit Message:\n`);
  console.log(message);

  if (process.argv.includes('--copy')) {
    // Copy to clipboard (macOS)
    try {
      execSync(`echo "${message}" | pbcopy`);
      console.log('\n✅ Copied to clipboard');
    } catch {
      console.log('\n⚠️ Could not copy to clipboard (pbcopy not available)');
    }
  }
}

/**
 * Generate changelog
 */
async function generateChangelog() {
  try {
    const commits = execSync('git log --oneline -10', { encoding: 'utf8' }).trim().split('\n');
    const entries = generateChangelogEntry(commits);

    console.log(`\n📝 Changelog Entries:\n`);

    const byType = entries.reduce((acc, entry) => {
      if (!acc[entry.type]) acc[entry.type] = [];
      acc[entry.type].push(entry);
      return acc;
    }, {} as Record<string, typeof entries>);

    for (const [type, typeEntries] of Object.entries(byType)) {
      console.log(`${type.toUpperCase()}:`);
      typeEntries.forEach(entry => {
        console.log(`  - ${entry.scope ? `(${entry.scope})` : ''} ${entry.description}`);
        if (entry.breaking) {
          console.log(`    ⚠️ BREAKING CHANGE`);
        }
      });
      console.log('');
    }
  } catch (err) {
    console.error('Failed to generate changelog:', err);
  }
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'pr':
      const baseBranch = args[1] || 'main';
      await generatePR(baseBranch);
      break;

    case 'commit':
      const files = args.slice(1);
      await generateCommit(files);
      break;

    case 'changelog':
      await generateChangelog();
      break;

    default:
      console.log(`
PR Generation Script

Usage:
  generate-pr.js pr [base-branch]     Generate PR description
  generate-pr.js commit [files...]     Generate commit message
  generate-pr.js changelog             Generate changelog entries

Examples:
  generate-pr.js pr main
  generate-pr.js commit app/api/route.ts
  generate-pr.js changelog
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { generatePR, generateCommit, generateChangelog };
