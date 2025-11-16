#!/usr/bin/env node

/**
 * Automatic CHANGELOG Generator
 * Generates CHANGELOG.md based on git commits using Conventional Commits format
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');

// Conventional commit types to emoji mapping
const TYPE_EMOJI = {
  feat: '🚀',
  fix: '🐛',
  docs: '📚',
  style: '💎',
  refactor: '♻️',
  perf: '⚡',
  test: '🧪',
  chore: '🔧',
  ci: '⚙️',
  build: '📦',
  revert: '⏪',
};

// Category labels
const CATEGORIES = {
  feat: 'Features',
  fix: 'Fixes',
  docs: 'Documentation',
  style: 'Style',
  refactor: 'Refactors',
  perf: 'Performance',
  test: 'Tests',
  chore: 'Chores',
  ci: 'CI/CD',
  build: 'Build',
  revert: 'Reverts',
};

// Get git commits since last tag or all commits if no tag
function getCommits() {
  try {
    // Try to get commits since last tag
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', {
      encoding: 'utf-8',
    }).trim();

    const since = lastTag ? `--since=${lastTag}` : '';
    const commits = execSync(`git log ${since} --pretty=format:"%H|%s|%b" --no-merges`, {
      encoding: 'utf-8',
    }).trim();

    return commits ? commits.split('\n') : [];
  } catch (err) {
    console.error('Error getting commits:', err.message);
    return [];
  }
}

// Parse commit message
function parseCommit(commitLine) {
  const [hash, subject, ...bodyParts] = commitLine.split('|');
  const body = bodyParts.join('|');

  // Match conventional commit format: type(scope): subject
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);

  if (!match) {
    return {
      hash: hash?.substring(0, 7),
      type: 'chore',
      scope: null,
      subject: subject || commitLine,
      body: body || '',
      raw: subject,
    };
  }

  const [, type, scope, message] = match;

  return {
    hash: hash?.substring(0, 7),
    type: type.toLowerCase(),
    scope: scope || null,
    subject: message,
    body: body || '',
    raw: subject,
  };
}

// Group commits by type
function groupCommits(commits) {
  const groups = {};

  commits.forEach(commit => {
    const type = commit.type || 'chore';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(commit);
  });

  return groups;
}

// Generate changelog entry
function generateChangelog() {
  const commits = getCommits();

  if (commits.length === 0) {
    console.log('No new commits found');
    return;
  }

  const parsedCommits = commits.map(parseCommit);
  const grouped = groupCommits(parsedCommits);

  // Get current date
  const date = new Date().toISOString().split('T')[0];

  // Get version from package.json
  let version = 'Unreleased';
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    version = pkg.version || 'Unreleased';
  } catch (err) {
    // Ignore
  }

  // Build changelog entry
  let changelog = `## [${version}] - ${date}\n\n`;

  // Add entries by category
  Object.keys(CATEGORIES).forEach(type => {
    if (grouped[type] && grouped[type].length > 0) {
      const emoji = TYPE_EMOJI[type] || '•';
      const category = CATEGORIES[type];
      changelog += `### ${emoji} ${category}\n\n`;

      grouped[type].forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        changelog += `- ${scope}${commit.subject} (${commit.hash})\n`;
        if (commit.body.trim()) {
          const bodyLines = commit.body.trim().split('\n');
          bodyLines.forEach(line => {
            if (line.trim()) {
              changelog += `  ${line.trim()}\n`;
            }
          });
        }
      });

      changelog += '\n';
    }
  });

  // Read existing changelog
  let existingChangelog = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    existingChangelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');

    // Remove "Unreleased" section if it exists
    existingChangelog = existingChangelog.replace(/## \[Unreleased\].*?(?=## |$)/s, '');
  } else {
    existingChangelog =
      '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }

  // Prepend new entry
  const newChangelog = existingChangelog + changelog;

  // Write changelog
  fs.writeFileSync(CHANGELOG_PATH, newChangelog, 'utf-8');

  console.log(`✅ Generated CHANGELOG.md with ${parsedCommits.length} commits`);
  console.log(`   Categories: ${Object.keys(grouped).join(', ')}`);
}

// Run if called directly
if (require.main === module) {
  generateChangelog();
}

module.exports = { generateChangelog };
