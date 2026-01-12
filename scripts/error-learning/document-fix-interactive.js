#!/usr/bin/env node

/**
 * Interactive Fix Documentation CLI
 * Guides developers through documenting fixes
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { documentFix, saveFixMarkdown } = require('../../lib/error-learning/document-fix');

const CAPTURED_ERRORS_FILE = path.join(__dirname, '../../.error-capture/captured-errors.json');
const FIXES_FILE = path.join(__dirname, '../../docs/errors/fixes.json');

/**
 * Load captured errors
 */
function loadCapturedErrors() {
  if (!fs.existsSync(CAPTURED_ERRORS_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(CAPTURED_ERRORS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Create readline interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt for input
 */
function question(rl, query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

/**
 * Select error from list
 */
async function selectError(rl) {
  const errors = loadCapturedErrors().filter(err => err.status !== 'documented');
  
  if (errors.length === 0) {
    console.log('No unresolved errors found.');
    return null;
  }
  
  console.log('\nUnresolved errors:');
  errors.slice(-10).forEach((err, index) => {
    console.log(`  ${index + 1}. ${err.id}: ${err.message.substring(0, 60)}... (${err.source}/${err.errorType})`);
  });
  
  const choice = await question(rl, '\nSelect error number (or enter error ID): ');
  
  if (/^\d+$/.test(choice)) {
    const index = parseInt(choice, 10) - 1;
    if (index >= 0 && index < errors.length) {
      return errors[errors.length - 10 + index];
    }
  } else if (choice) {
    return errors.find(err => err.id === choice);
  }
  
  return null;
}

/**
 * Interactive documentation flow
 */
async function documentFixInteractive(errorId) {
  const rl = createInterface();
  
  try {
    let error = null;
    
    if (errorId) {
      const errors = loadCapturedErrors();
      error = errors.find(err => err.id === errorId);
      
      if (!error) {
        console.log(`Error ${errorId} not found.`);
        rl.close();
        return;
      }
    } else {
      error = await selectError(rl);
      
      if (!error) {
        rl.close();
        return;
      }
    }
    
    console.log(`\n📝 Documenting fix for error: ${error.id}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Source: ${error.source}/${error.errorType}`);
    console.log(`   Category: ${error.category}`);
    
    // Prompt for root cause
    console.log('\n📋 Root Cause Analysis');
    const rootCause = await question(rl, 'What was the root cause of this error? ');
    
    // Prompt for solution
    console.log('\n✅ Solution');
    const solution = await question(rl, 'How was this error fixed? ');
    
    // Prompt for code changes (optional)
    console.log('\n📝 Code Changes (optional)');
    const codeChangesChoice = await question(rl, 'Do you want to include code changes? (y/n): ');
    let codeChanges = null;
    
    if (codeChangesChoice.toLowerCase() === 'y') {
      const gitDiffChoice = await question(rl, 'Paste git diff or description: ');
      if (gitDiffChoice.trim()) {
        codeChanges = gitDiffChoice.trim();
      }
    }
    
    // Prompt for prevention strategies
    console.log('\n🛡️ Prevention Strategies');
    const strategies = [];
    let addMore = true;
    
    while (addMore) {
      const strategy = await question(rl, `Prevention strategy ${strategies.length + 1} (or 'done' to finish): `);
      if (strategy.toLowerCase() === 'done' || !strategy.trim()) {
        addMore = false;
      } else {
        strategies.push(strategy.trim());
      }
    }
    
    if (strategies.length === 0) {
      strategies.push('Review error patterns and add prevention rules');
    }
    
    // Prompt for related errors (optional)
    console.log('\n🔗 Related Errors (optional)');
    const relatedErrorsInput = await question(rl, 'Enter related error IDs (comma-separated, or press enter to skip): ');
    const relatedErrors = relatedErrorsInput
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);
    
    // Document the fix
    console.log('\n💾 Documenting fix...');
    
    const fixId = await documentFix(error.id, {
      rootCause,
      solution,
      codeChanges,
      preventionStrategies: strategies,
      relatedErrors,
      documentedBy: 'user',
    });
    
    // Save markdown documentation
    const fix = {
      errorId: error.id,
      fixId,
      rootCause,
      solution,
      codeChanges,
      preventionStrategies: strategies,
      relatedErrors,
      documentedAt: new Date().toISOString(),
      documentedBy: 'user',
    };
    
    const markdownPath = await saveFixMarkdown(fix);
    
    console.log(`\n✅ Fix documented successfully!`);
    console.log(`   Fix ID: ${fixId}`);
    console.log(`   Markdown: ${markdownPath}`);
    
    // Update error status
    const errors = loadCapturedErrors();
    const errorIndex = errors.findIndex(err => err.id === error.id);
    if (errorIndex >= 0) {
      errors[errorIndex].status = 'documented';
      errors[errorIndex].fixId = fixId;
      fs.writeFileSync(CAPTURED_ERRORS_FILE, JSON.stringify(errors, null, 2));
    }
    
  } catch (err) {
    console.error('\n❌ Error documenting fix:', err);
  } finally {
    rl.close();
  }
}

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const errorId = args[0];
  
  await documentFixInteractive(errorId);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = {
  documentFixInteractive,
};
