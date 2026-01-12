#!/usr/bin/env node

/**
 * Refactoring Suggestions Script
 * Detects refactoring opportunities and technical debt
 */

const fs = require('fs');
const path = require('path');
const {
  detectRefactoringOpportunities,
  analyzeComplexity,
  getPrioritizedDebt,
  addTechnicalDebt,
} = require('../../lib/autonomous-developer/refactoring/technical-debt-tracker');

/**
 * Analyze file for refactoring opportunities
 */
async function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Detect opportunities
  const opportunities = detectRefactoringOpportunities(filePath, content);
  const complexity = analyzeComplexity(content);

  console.log(`\n🔍 Refactoring Analysis: ${filePath}\n`);

  // Complexity metrics
  console.log('Complexity Metrics:');
  console.log(`  - Cyclomatic Complexity: ${complexity.cyclomaticComplexity.toFixed(1)}`);
  console.log(`  - Max Nesting: ${complexity.maxNesting}`);
  console.log(`  - Function Count: ${complexity.functionCount}`);
  console.log(`  - Avg Function Length: ${complexity.averageFunctionLength.toFixed(1)} lines`);
  console.log(`  - Duplicate Blocks: ${complexity.duplicateBlocks}\n`);

  // Opportunities
  if (opportunities.length === 0) {
    console.log('✅ No refactoring opportunities detected');
  } else {
    console.log(`Found ${opportunities.length} refactoring opportunity(ies):\n`);

    for (const opp of opportunities) {
      console.log(`📌 ${opp.type.toUpperCase()}`);
      console.log(`   Lines: ${opp.lines.start}-${opp.lines.end}`);
      console.log(`   Description: ${opp.description}`);
      console.log(`   Impact: ${opp.estimatedImpact}`);
      console.log(`   Suggestion: ${opp.suggestion}\n`);

      // Add to technical debt
      await addTechnicalDebt({
        file: filePath,
        line: opp.lines.start,
        type: opp.type === 'extract-function' ? 'code-smell' : 'complexity',
        description: opp.description,
        severity: opp.estimatedImpact === 'high' ? 'high' : 'medium',
        estimatedEffort: opp.estimatedImpact,
        suggestedRefactoring: opp.suggestion,
      });
    }
  }

  // Show prioritized debt
  const debt = await getPrioritizedDebt(5);
  if (debt.length > 0) {
    console.log('\n📊 Top Technical Debt Items:');
    debt.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.file}:${item.line} - ${item.description} (Priority: ${item.priority})`);
    });
  }
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  if (!filePath) {
    console.log(`
Refactoring Suggestions Script

Usage:
  refactoring-suggestions.js <file>

Examples:
  refactoring-suggestions.js app/api/example/route.ts
    `);
    process.exit(0);
  }

  await analyzeFile(filePath);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { analyzeFile };
