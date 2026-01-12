#!/usr/bin/env node

/**
 * Code Review Script
 * Reviews code files and suggests improvements
 */

const fs = require('fs');
const path = require('path');
const { reviewCodeFile, generateCodeReviewReport } = require('../../lib/autonomous-developer/code-review/pattern-detector');

/**
 * Review single file
 */
async function reviewFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = await reviewCodeFile(filePath, content);

  if (issues.length === 0) {
    console.log(`✅ No issues found in ${filePath}`);
    return;
  }

  console.log(`\n📋 Code Review: ${filePath}`);
  console.log(`Found ${issues.length} issue(s)\n`);

  const report = generateCodeReviewReport(issues);
  console.log(report);

  // Save report
  const reportDir = path.join(process.cwd(), 'docs/autonomous-developer/code-reviews');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFile = path.join(reportDir, `${path.basename(filePath)}-review.md`);
  fs.writeFileSync(reportFile, report);
  console.log(`\n✅ Report saved to: ${reportFile}`);
}

/**
 * Review multiple files
 */
async function reviewFiles(filePaths) {
  const allIssues = [];

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = await reviewCodeFile(filePath, content);
    allIssues.push(...issues);
  }

  if (allIssues.length === 0) {
    console.log('✅ No issues found in reviewed files');
    return;
  }

  const report = generateCodeReviewReport(allIssues);
  console.log(report);

  // Save combined report
  const reportDir = path.join(process.cwd(), 'docs/autonomous-developer/code-reviews');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFile = path.join(reportDir, `combined-review-${Date.now()}.md`);
  fs.writeFileSync(reportFile, report);
  console.log(`\n✅ Report saved to: ${reportFile}`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const files = args.filter(arg => !arg.startsWith('--'));

  if (files.length === 0) {
    console.log(`
Code Review Script

Usage:
  code-review.js <file1> [file2] [file3] ...

Examples:
  code-review.js app/api/example/route.ts
  code-review.js app/components/*.tsx
    `);
    process.exit(0);
  }

  if (files.length === 1) {
    await reviewFile(files[0]);
  } else {
    await reviewFiles(files);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { reviewFile, reviewFiles };
