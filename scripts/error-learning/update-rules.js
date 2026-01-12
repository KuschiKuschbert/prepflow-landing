#!/usr/bin/env node

/**
 * Update Rules Script
 * Updates error-patterns.mdc based on knowledge base
 */

const { generateRulesFromKnowledgeBase, generateRulesFromRecentFixes } = require('../../lib/error-learning/rule-generator');

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  try {
    switch (command) {
      case 'all':
        console.log('Generating rules from all fixes...');
        const allResults = await generateRulesFromKnowledgeBase();
        console.log(`✅ Generated ${allResults.patterns.length} pattern(s) and ${allResults.rules.length} rule(s)`);
        break;
        
      case 'recent':
        const days = parseInt(args[1] || '7', 10);
        console.log(`Generating rules from fixes in last ${days} days...`);
        const recentResults = await generateRulesFromRecentFixes(days);
        console.log(`✅ Generated ${recentResults.patterns.length} pattern(s) and ${recentResults.rules.length} rule(s)`);
        break;
        
      default:
        console.log(`
Update Rules Script

Usage:
  update-rules.js [command]

Commands:
  all     Generate rules from all fixes (default)
  recent [days]  Generate rules from recent fixes (default: 7 days)
        `);
        break;
    }
  } catch (err) {
    console.error('Error updating rules:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateRules: generateRulesFromKnowledgeBase,
  updateRulesFromRecent: generateRulesFromRecentFixes,
};
