#!/usr/bin/env node

/**
 * Violation Tracking Utilities
 * Standardized violation format and tracking
 */

/**
 * Create a violation object
 */
function createViolation({ file, line, column, message, severity, fixable, standard, reference }) {
  return {
    file,
    line: line || undefined,
    column: column || undefined,
    message,
    severity: severity || 'warning',
    fixable: fixable || false,
    standard: standard || 'unknown',
    reference: reference || `See cleanup.mdc for details`,
  };
}

/**
 * Group violations by file
 */
function groupViolationsByFile(violations) {
  const grouped = {};
  for (const violation of violations) {
    if (!grouped[violation.file]) {
      grouped[violation.file] = [];
    }
    grouped[violation.file].push(violation);
  }
  return grouped;
}

/**
 * Group violations by standard
 */
function groupViolationsByStandard(violations) {
  const grouped = {};
  for (const violation of violations) {
    if (!grouped[violation.standard]) {
      grouped[violation.standard] = [];
    }
    grouped[violation.standard].push(violation);
  }
  return grouped;
}

/**
 * Count violations by severity
 */
function countViolationsBySeverity(violations) {
  const counts = { critical: 0, warning: 0, info: 0 };
  for (const violation of violations) {
    counts[violation.severity] = (counts[violation.severity] || 0) + 1;
  }
  return counts;
}

/**
 * Filter violations by severity
 */
function filterViolationsBySeverity(violations, severity) {
  return violations.filter(v => v.severity === severity);
}

module.exports = {
  createViolation,
  groupViolationsByFile,
  groupViolationsByStandard,
  countViolationsBySeverity,
  filterViolationsBySeverity,
};

