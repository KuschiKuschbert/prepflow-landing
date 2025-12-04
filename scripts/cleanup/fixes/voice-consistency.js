#!/usr/bin/env node

/**
 * Voice Consistency Fix Module
 * Auto-fixes simple voice consistency issues (contractions)
 */

const fs = require('fs');
const path = require('path');
const { checkVoiceConsistency } = require('../../check-voice-consistency');

// Contraction replacements
const CONTRACTION_REPLACEMENTS = [
  { from: /\bcannot\b/gi, to: "can't" },
  { from: /\bwill not\b/gi, to: "won't" },
  { from: /\byou will\b/gi, to: "you'll" },
  { from: /\bit is\b/gi, to: "it's" },
  { from: /\bthat is\b/gi, to: "that's" },
  { from: /\bthere is\b/gi, to: "there's" },
  { from: /\bdo not\b/gi, to: "don't" },
  { from: /\bdoes not\b/gi, to: "doesn't" },
  { from: /\bdid not\b/gi, to: "didn't" },
  { from: /\bhave not\b/gi, to: "haven't" },
  { from: /\bhas not\b/gi, to: "hasn't" },
  { from: /\bshould not\b/gi, to: "shouldn't" },
  { from: /\bcould not\b/gi, to: "couldn't" },
  { from: /\bwould not\b/gi, to: "wouldn't" },
];

/**
 * Read file content
 */
function readFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Write file content
 */
function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
}

/**
 * Fix contractions in a string
 */
function fixContractions(text) {
  let fixed = text;
  for (const replacement of CONTRACTION_REPLACEMENTS) {
    fixed = fixed.replace(replacement.from, replacement.to);
  }
  return fixed;
}

/**
 * Fix voice consistency issues in file
 */
function fixVoiceInFile(filePath) {
  const content = readFile(filePath);
  if (!content) {
    return { fixed: false, changes: [] };
  }

  let newContent = content;
  const changes = [];

  // Find all user-facing strings and fix contractions
  // Check notification calls
  const notificationPattern =
    /(showSuccess|showError|showWarning|showInfo|showAlert)\(['"`]([^'"`]+)['"`]\)/gi;
  newContent = newContent.replace(notificationPattern, (match, func, text) => {
    const fixed = fixContractions(text);
    if (fixed !== text) {
      changes.push(`Fixed contraction in ${func}: "${text}" → "${fixed}"`);
      return `${func}('${fixed}')`;
    }
    return match;
  });

  // Check dialog props
  const dialogPattern =
    /(title|message|confirmLabel|cancelLabel|placeholder):\s*['"`]([^'"`]+)['"`]/gi;
  newContent = newContent.replace(dialogPattern, (match, prop, text) => {
    const fixed = fixContractions(text);
    if (fixed !== text) {
      changes.push(`Fixed contraction in ${prop}: "${text}" → "${fixed}"`);
      return `${prop}: '${fixed}'`;
    }
    return match;
  });

  // Check aria labels and placeholders
  const ariaPattern = /(aria-label|aria-describedby|placeholder|title|alt)=['"`]([^'"`]+)['"`]/gi;
  newContent = newContent.replace(ariaPattern, (match, attr, text) => {
    const fixed = fixContractions(text);
    if (fixed !== text) {
      changes.push(`Fixed contraction in ${attr}: "${text}" → "${fixed}"`);
      return `${attr}='${fixed}'`;
    }
    return match;
  });

  if (changes.length > 0) {
    writeFile(filePath, newContent);
    return { fixed: true, changes };
  }

  return { fixed: false, changes: [] };
}

/**
 * Fix voice consistency issues
 */
async function fixVoiceConsistency(files = null) {
  const changes = [];
  const errors = [];

  try {
    // Get violations from check
    const violations = checkVoiceConsistency(files);

    // Group by file
    const filesToFix = {};
    for (const violation of violations) {
      if (violation.fixable && violation.violation?.type === 'missing-contraction') {
        if (!filesToFix[violation.file]) {
          filesToFix[violation.file] = [];
        }
        filesToFix[violation.file].push(violation);
      }
    }

    // Fix each file
    for (const [filePath, fileViolations] of Object.entries(filesToFix)) {
      try {
        const result = fixVoiceInFile(filePath);
        if (result.fixed) {
          changes.push({
            file: filePath,
            changes: result.changes.join(', '),
          });
        }
      } catch (error) {
        errors.push({
          file: filePath,
          error: error.message,
        });
      }
    }

    return {
      fixed: errors.length === 0,
      changes,
      errors,
    };
  } catch (error) {
    return {
      fixed: false,
      changes,
      errors: [{ file: 'unknown', error: error.message }],
    };
  }
}

module.exports = {
  name: 'voice-consistency',
  fix: fixVoiceConsistency,
};
