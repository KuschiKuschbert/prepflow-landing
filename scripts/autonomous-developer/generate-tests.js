#!/usr/bin/env node

/**
 * Test Generation Script
 * Generates test cases from error patterns and coverage gaps
 */

const fs = require('fs');
const path = require('path');
const {
  generateTestsFromErrors,
  detectCoverageGaps,
  generateTestFileFromGaps,
} = require('../../lib/autonomous-developer/testing/test-generator');

/**
 * Generate tests from errors
 */
async function generateFromErrors(errorIds) {
  const testCases = await generateTestsFromErrors(errorIds);

  if (testCases.length === 0) {
    console.log('No test cases generated');
    return;
  }

  console.log(`\n✅ Generated ${testCases.length} test case(s)\n`);

  for (const testCase of testCases) {
    console.log(`📝 ${testCase.name}`);
    console.log(`   Type: ${testCase.type}`);
    console.log(`   Source: ${testCase.source}`);
    if (testCase.relatedError) {
      console.log(`   Related Error: ${testCase.relatedError}`);
    }
    console.log(`\n${testCase.testCode}\n`);
  }

  // Save test files
  const testDir = path.join(process.cwd(), '__tests__/generated');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  for (const testCase of testCases) {
    const fileName = `${testCase.name.replace(/\s+/g, '-').toLowerCase()}.test.ts`;
    const filePath = path.join(testDir, fileName);
    fs.writeFileSync(filePath, testCase.testCode);
    console.log(`✅ Saved: ${filePath}`);
  }
}

/**
 * Detect and generate tests for coverage gaps
 */
async function generateForCoverageGaps(sourceFiles, testFiles) {
  const gaps = detectCoverageGaps(sourceFiles, testFiles);

  if (gaps.length === 0) {
    console.log('✅ No coverage gaps detected');
    return;
  }

  console.log(`\n📊 Found ${gaps.length} coverage gap(s)\n`);

  for (const gap of gaps) {
    console.log(`📁 ${gap.file}`);
    console.log(`   Coverage: ${gap.coverage.toFixed(1)}%`);
    console.log(`   Missing Tests: ${gap.missingTests.length}`);
    console.log(`   Functions: ${gap.functions.length}\n`);

    if (gap.missingTests.length > 0) {
      const testFile = generateTestFileFromGaps(gap);
      const testFilePath = gap.file.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1');
      const testDir = path.dirname(testFilePath);
      
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }

      fs.writeFileSync(testFilePath, testFile);
      console.log(`✅ Generated test file: ${testFilePath}\n`);
    }
  }
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'from-errors':
      const errorIds = args.slice(1);
      if (errorIds.length === 0) {
        console.error('Usage: generate-tests.js from-errors <error-id1> [error-id2] ...');
        process.exit(1);
      }
      await generateFromErrors(errorIds);
      break;

    case 'coverage':
      const sourceFiles = args.slice(1).filter(f => !f.includes('.test.') && !f.includes('.spec.'));
      const testFiles = args.slice(1).filter(f => f.includes('.test.') || f.includes('.spec.'));
      await generateForCoverageGaps(sourceFiles, testFiles);
      break;

    default:
      console.log(`
Test Generation Script

Usage:
  generate-tests.js from-errors <error-id1> [error-id2] ...
  generate-tests.js coverage <source-file1> [source-file2] ... <test-file1> [test-file2] ...

Examples:
  generate-tests.js from-errors error-123 error-456
  generate-tests.js coverage app/api/route.ts __tests__/route.test.ts
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

module.exports = { generateFromErrors, generateForCoverageGaps };
