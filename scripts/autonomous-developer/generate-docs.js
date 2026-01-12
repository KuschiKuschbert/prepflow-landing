#!/usr/bin/env node

/**
 * Documentation Generation Script
 * Auto-generates and updates documentation
 */

const fs = require('fs');
const path = require('path');
const {
  detectMissingJSDoc,
  autoGenerateJSDoc,
  detectOutdatedDocs,
  generateREADME,
} = require('../../lib/autonomous-developer/documentation/doc-generator');

/**
 * Generate docs for file
 */
async function generateDocsForFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n📝 Documentation Analysis: ${filePath}\n`);

  // Detect missing JSDoc
  const missingJSDoc = await detectMissingJSDoc(filePath, content);
  if (missingJSDoc.length > 0) {
    console.log(`Found ${missingJSDoc.length} missing JSDoc(s):\n`);
    missingJSDoc.forEach(gap => {
      console.log(`  - ${gap.description}`);
      console.log(`    Severity: ${gap.severity}`);
      console.log(`    Suggested:\n${gap.suggestedContent}\n`);
    });
  } else {
    console.log('✅ All functions/classes have JSDoc');
  }

  // Detect outdated docs
  const outdated = await detectOutdatedDocs(filePath, content);
  if (outdated.length > 0) {
    console.log(`Found ${outdated.length} outdated documentation(s):\n`);
    outdated.forEach(gap => {
      console.log(`  - ${gap.description}`);
      console.log(`    Suggestion: ${gap.suggestedContent}\n`);
    });
  }

  // Auto-generate if requested
  if (process.argv.includes('--auto-fix')) {
    console.log('\n🔧 Auto-generating documentation...');
    const updatedContent = await autoGenerateJSDoc(filePath);
    
    // Backup original
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content);
    console.log(`✅ Backup saved to: ${backupPath}`);

    // Write updated
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Documentation generated for: ${filePath}`);
  }
}

/**
 * Generate README for component/utility
 */
async function generateReadmeForFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const readme = generateREADME(filePath, content);

  const readmePath = path.join(path.dirname(filePath), 'README.md');
  fs.writeFileSync(readmePath, readme);
  console.log(`✅ Generated README: ${readmePath}`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const filePath = args[1];

  switch (command) {
    case 'analyze':
      if (!filePath) {
        console.error('Usage: generate-docs.js analyze <file>');
        process.exit(1);
      }
      await generateDocsForFile(filePath);
      break;

    case 'generate':
      if (!filePath) {
        console.error('Usage: generate-docs.js generate <file>');
        process.exit(1);
      }
      await generateDocsForFile(filePath);
      break;

    case 'readme':
      if (!filePath) {
        console.error('Usage: generate-docs.js readme <file>');
        process.exit(1);
      }
      await generateReadmeForFile(filePath);
      break;

    default:
      console.log(`
Documentation Generation Script

Usage:
  generate-docs.js analyze <file>     Analyze documentation gaps
  generate-docs.js generate <file> --auto-fix  Auto-generate documentation
  generate-docs.js readme <file>     Generate README for component/utility

Examples:
  generate-docs.js analyze app/api/route.ts
  generate-docs.js generate app/api/route.ts --auto-fix
  generate-docs.js readme lib/utils/helper.ts
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

module.exports = { generateDocsForFile, generateReadmeForFile };
