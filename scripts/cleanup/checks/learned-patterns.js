#!/usr/bin/env node

/**
 * Learned Patterns Check
 * Prevents errors based on learned patterns from knowledge base
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

const KNOWLEDGE_BASE_FILE = path.join(__dirname, '../../../docs/errors/knowledge-base.json');
const FIXES_FILE = path.join(__dirname, '../../../docs/errors/fixes.json');

/**
 * Load knowledge base
 */
function loadKnowledgeBase() {
  if (!fs.existsSync(KNOWLEDGE_BASE_FILE)) {
    return { errors: [], patterns: [], rules: [] };
  }
  
  try {
    const content = fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { errors: [], patterns: [], rules: [] };
  }
}

/**
 * Load fixes
 */
function loadFixes() {
  if (!fs.existsSync(FIXES_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(FIXES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Check for high-risk patterns
 */
function checkForHighRiskPatterns(content, filePath) {
  const violations = [];
  const kb = loadKnowledgeBase();
  const fixes = loadFixes();
  
  // Get patterns that have been fixed multiple times (high risk)
  const highRiskPatterns = kb.patterns.filter(pattern => {
    // Count how many times this pattern has been fixed
    const fixCount = fixes.filter(fix => {
      return fix.solution.toLowerCase().includes(pattern.name.toLowerCase()) ||
             fix.prevention.toLowerCase().includes(pattern.prevention.toLowerCase());
    }).length;
    
    return fixCount >= 3; // High risk if fixed 3+ times
  });
  
  // Check for patterns in code
  for (const pattern of highRiskPatterns) {
    // Simple pattern matching (can be enhanced)
    const detectionKeywords = pattern.detection.toLowerCase().split(/\s+/);
    const hasPattern = detectionKeywords.some(keyword => {
      if (keyword.length < 3) return false;
      return content.toLowerCase().includes(keyword);
    });
    
    if (hasPattern) {
      // Check if fix is already applied
      const fixKeywords = pattern.fix.toLowerCase().split(/\s+/);
      const hasFix = fixKeywords.some(keyword => {
        if (keyword.length < 3) return false;
        return content.toLowerCase().includes(keyword);
      });
      
      if (!hasFix) {
        violations.push({
          type: 'high-risk-pattern',
          pattern: pattern.name,
          message: `High-risk pattern detected: ${pattern.name}. This pattern has caused ${fixes.length} errors. Consider: ${pattern.fix}`,
          line: 1, // Pattern detection doesn't have specific line
        });
      }
    }
  }
  
  return violations;
}

/**
 * Check learned patterns
 */
async function checkLearnedPatterns(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('learned-patterns');
  
  // For now, we'll check all TypeScript/JavaScript files
  // In the future, this could be more targeted
  const filesToCheck = files || [];
  
  // If no files specified, skip (this check is expensive)
  if (filesToCheck.length === 0) {
    return {
      passed: true,
      violations: [],
      summary: '✅ Learned patterns check skipped (no files specified)',
    };
  }
  
  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    
    // Only check TypeScript/JavaScript files
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    const found = checkForHighRiskPatterns(content, file);
    
    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message: violation.message,
          severity: 'warning', // Warning, not critical
          fixable: false,
          standard: standardConfig.source,
          reference: 'See docs/errors/knowledge-base.json for learned patterns',
        }),
      );
    }
  }
  
  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No high-risk patterns detected'
        : `⚠️ ${violations.length} high-risk pattern(s) detected (warnings only)`,
  };
}

module.exports = {
  name: 'learned-patterns',
  check: checkLearnedPatterns,
};
