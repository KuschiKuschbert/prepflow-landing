#!/usr/bin/env node

/**
 * ID Usage Audit Script
 *
 * Checks for:
 * 1. Consistent ID field naming (id vs ingredientId vs recipeId)
 * 2. React key prop usage patterns
 * 3. Potential duplicate key issues
 * 4. Index-based keys (should be avoided when possible)
 * 5. Null/undefined ID handling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WEBAPP_DIR = path.join(__dirname, '../app/webapp');
const COMPONENTS_DIR = path.join(__dirname, '../components');

const issues = {
  indexKeys: [],
  duplicateKeys: [],
  inconsistentIds: [],
  nullUndefinedIds: [],
  missingKeys: [],
};

function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...findFiles(fullPath, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  const lines = content.split('\n');

  // Check for index-based keys (potential issue)
  const indexKeyPattern = /key=\{.*index.*\}/g;
  const indexKeyMatches = [...content.matchAll(indexKeyPattern)];
  if (indexKeyMatches.length > 0) {
    indexKeyMatches.forEach(match => {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.indexKeys.push({
        file: relativePath,
        line: lineNum,
        code: lines[lineNum - 1]?.trim(),
        issue: 'Using index as key (can cause React rendering issues)',
      });
    });
  }

  // Check for .map() without key prop
  const mapPattern = /\.map\([^)]*\)\s*=>/g;
  const mapMatches = [...content.matchAll(mapPattern)];
  mapMatches.forEach(match => {
    const lineNum = content.substring(0, match.index).split('\n').length;
    const mapLine = lines[lineNum - 1];

    // Check if next few lines have a key prop
    const nextLines = lines.slice(lineNum - 1, lineNum + 5).join('\n');
    if (!nextLines.includes('key=') && !nextLines.includes('key:')) {
      issues.missingKeys.push({
        file: relativePath,
        line: lineNum,
        code: mapLine?.trim(),
        issue: 'Map function without key prop',
      });
    }
  });

  // Check for inconsistent ID patterns
  const idPatterns = {
    simpleId: /\.id\b/g,
    ingredientId: /\.ingredientId\b/g,
    ingredient_id: /\.ingredient_id\b/g,
    recipeId: /\.recipeId\b/g,
    recipe_id: /\.recipe_id\b/g,
    dishId: /\.dishId\b/g,
    dish_id: /\.dish_id\b/g,
  };

  const foundPatterns = Object.entries(idPatterns)
    .filter(([_, pattern]) => pattern.test(content))
    .map(([name]) => name);

  if (foundPatterns.length > 1) {
    issues.inconsistentIds.push({
      file: relativePath,
      patterns: foundPatterns,
      issue: 'Multiple ID naming patterns found in same file',
    });
  }

  // Check for null/undefined ID handling
  const nullIdPattern = /id\s*\|\|\s*['"`]|id\s*\?\s*\.|id\s*===\s*null|id\s*===\s*undefined/g;
  if (nullIdPattern.test(content)) {
    const matches = [...content.matchAll(nullIdPattern)];
    matches.forEach(match => {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.nullUndefinedIds.push({
        file: relativePath,
        line: lineNum,
        code: lines[lineNum - 1]?.trim(),
        issue: 'Null/undefined ID handling found',
      });
    });
  }

  // Check for potential duplicate keys (same ID used multiple times in map)
  const keyPattern = /key=\{([^}]+)\}/g;
  const keyMatches = [...content.matchAll(keyPattern)];
  const keyValues = keyMatches.map(m => m[1].trim());

  // Find duplicate key expressions
  const keyCounts = {};
  keyValues.forEach(key => {
    keyCounts[key] = (keyCounts[key] || 0) + 1;
  });

  Object.entries(keyCounts).forEach(([key, count]) => {
    if (
      count > 1 &&
      !key.includes('index') &&
      !key.includes('recipeId') &&
      !key.includes('dishId')
    ) {
      issues.duplicateKeys.push({
        file: relativePath,
        key,
        count,
        issue: `Same key expression used ${count} times (may cause duplicates if IDs overlap)`,
      });
    }
  });
}

function generateReport() {
  console.log('\n🔍 ID Usage Audit Report\n');
  console.log('='.repeat(80));

  // Index-based keys
  if (issues.indexKeys.length > 0) {
    console.log(`\n⚠️  Index-Based Keys (${issues.indexKeys.length} found)`);
    console.log('-'.repeat(80));
    issues.indexKeys.slice(0, 20).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.code}`);
      console.log(`    → ${issue.issue}\n`);
    });
    if (issues.indexKeys.length > 20) {
      console.log(`  ... and ${issues.indexKeys.length - 20} more\n`);
    }
  }

  // Missing keys
  if (issues.missingKeys.length > 0) {
    console.log(`\n❌ Missing Keys (${issues.missingKeys.length} found)`);
    console.log('-'.repeat(80));
    issues.missingKeys.slice(0, 20).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.code}`);
      console.log(`    → ${issue.issue}\n`);
    });
    if (issues.missingKeys.length > 20) {
      console.log(`  ... and ${issues.missingKeys.length - 20} more\n`);
    }
  }

  // Inconsistent IDs
  if (issues.inconsistentIds.length > 0) {
    console.log(`\n🔄 Inconsistent ID Patterns (${issues.inconsistentIds.length} found)`);
    console.log('-'.repeat(80));
    issues.inconsistentIds.forEach(issue => {
      console.log(`  ${issue.file}`);
      console.log(`    Patterns: ${issue.patterns.join(', ')}`);
      console.log(`    → ${issue.issue}\n`);
    });
  }

  // Duplicate keys
  if (issues.duplicateKeys.length > 0) {
    console.log(`\n🔑 Potential Duplicate Keys (${issues.duplicateKeys.length} found)`);
    console.log('-'.repeat(80));
    issues.duplicateKeys.slice(0, 20).forEach(issue => {
      console.log(`  ${issue.file}`);
      console.log(`    Key: ${issue.key}`);
      console.log(`    → ${issue.issue}\n`);
    });
    if (issues.duplicateKeys.length > 20) {
      console.log(`  ... and ${issues.duplicateKeys.length - 20} more\n`);
    }
  }

  // Null/undefined IDs
  if (issues.nullUndefinedIds.length > 0) {
    console.log(`\n⚠️  Null/Undefined ID Handling (${issues.nullUndefinedIds.length} found)`);
    console.log('-'.repeat(80));
    issues.nullUndefinedIds.slice(0, 20).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.code}`);
      console.log(`    → ${issue.issue}\n`);
    });
    if (issues.nullUndefinedIds.length > 20) {
      console.log(`  ... and ${issues.nullUndefinedIds.length - 20} more\n`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Summary:');
  console.log(`  Index-based keys: ${issues.indexKeys.length}`);
  console.log(`  Missing keys: ${issues.missingKeys.length}`);
  console.log(`  Inconsistent ID patterns: ${issues.inconsistentIds.length}`);
  console.log(`  Potential duplicate keys: ${issues.duplicateKeys.length}`);
  console.log(`  Null/undefined ID handling: ${issues.nullUndefinedIds.length}`);
  console.log('\n');

  // Recommendations
  console.log('💡 Recommendations:');
  console.log('  1. Use composite keys for items that may appear multiple times:');
  console.log('     key={`${recipeId}-${ingredientId}`}');
  console.log('  2. Avoid index-based keys when possible');
  console.log('  3. Use consistent ID field naming (prefer camelCase: ingredientId)');
  console.log('  4. Always handle null/undefined IDs with fallbacks');
  console.log('  5. Use unique identifiers (UUIDs) when available\n');
}

// Main execution
console.log('🔍 Scanning codebase for ID usage patterns...\n');

const webappFiles = findFiles(WEBAPP_DIR);
const componentFiles = findFiles(COMPONENTS_DIR);
const allFiles = [...webappFiles, ...componentFiles];

console.log(`Found ${allFiles.length} files to analyze...\n`);

allFiles.forEach(file => {
  try {
    analyzeFile(file);
  } catch (err) {
    console.error(`Error analyzing ${file}:`, err.message);
  }
});

generateReport();

// Exit with error code if critical issues found
const criticalIssues = issues.missingKeys.length + issues.duplicateKeys.length;
process.exit(criticalIssues > 0 ? 1 : 0);

