#!/usr/bin/env node

/**
 * Architecture Analysis Script
 * Detects design patterns and anti-patterns, generates ADRs
 */

const fs = require('fs');
const path = require('path');
const {
  detectDesignPatterns,
  detectAntiPatterns,
  generateADRFromPattern,
  loadDesignPatterns,
} = require('../../lib/autonomous-developer/architecture/adr-generator');

/**
 * Analyze file for patterns
 */
async function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n🏗️ Architecture Analysis: ${filePath}\n`);

  // Detect design patterns
  const patterns = detectDesignPatterns(content, filePath);
  if (patterns.length > 0) {
    console.log('✅ Design Patterns Detected:');
    patterns.forEach(pattern => {
      console.log(`  - ${pattern.name} (${pattern.type})`);
      console.log(`    Description: ${pattern.description}`);
      console.log(`    Benefits: ${pattern.benefits.join(', ')}`);
      if (pattern.drawbacks.length > 0) {
        console.log(`    Drawbacks: ${pattern.drawbacks.join(', ')}`);
      }
      console.log('');
    });
  }

  // Detect anti-patterns
  const antiPatterns = detectAntiPatterns(content, filePath);
  if (antiPatterns.length > 0) {
    console.log('⚠️ Anti-Patterns Detected:');
    antiPatterns.forEach(anti => {
      console.log(`  - ${anti.name} (${anti.severity})`);
      console.log(`    Description: ${anti.description}`);
      console.log(`    Suggestion: ${anti.suggestion}`);
      if (anti.line) {
        console.log(`    Line: ${anti.line}`);
      }
      console.log('');
    });
  }

  if (patterns.length === 0 && antiPatterns.length === 0) {
    console.log('✅ No significant patterns detected');
  }

  // Generate ADR if pattern detected and requested
  if (process.argv.includes('--generate-adr') && patterns.length > 0) {
    const pattern = patterns[0];
    const adrId = await generateADRFromPattern(pattern, `Code in ${filePath}`);
    console.log(`\n✅ Generated ADR: ${adrId}`);
  }
}

/**
 * List all detected patterns
 */
async function listPatterns() {
  const patterns = await loadDesignPatterns();

  if (patterns.length === 0) {
    console.log('No patterns recorded yet');
    return;
  }

  console.log(`\n📚 Design Patterns (${patterns.length}):\n`);

  const byType = patterns.reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = [];
    acc[p.type].push(p);
    return acc;
  }, {} as Record<string, typeof patterns>);

  for (const [type, typePatterns] of Object.entries(byType)) {
    console.log(`${type.toUpperCase()}:`);
    typePatterns.forEach(p => {
      console.log(`  - ${p.name}: ${p.description}`);
      console.log(`    Used in: ${p.usage.join(', ')}`);
    });
    console.log('');
  }
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'analyze':
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: architecture-analysis.js analyze <file> [--generate-adr]');
        process.exit(1);
      }
      await analyzeFile(filePath);
      break;

    case 'list':
      await listPatterns();
      break;

    default:
      console.log(`
Architecture Analysis Script

Usage:
  architecture-analysis.js analyze <file> [--generate-adr]  Analyze file for patterns
  architecture-analysis.js list                             List all detected patterns

Examples:
  architecture-analysis.js analyze app/api/route.ts
  architecture-analysis.js analyze app/components/MyComponent.tsx --generate-adr
  architecture-analysis.js list
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

module.exports = { analyzeFile, listPatterns };
