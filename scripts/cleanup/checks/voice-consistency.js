#!/usr/bin/env node

/**
 * Voice Consistency Check Module
 * Integrates voice consistency check into cleanup system
 * Source: .cursor/rules/dialogs.mdc and development.mdc (PrepFlow Voice Guidelines)
 */

const { checkVoiceConsistency, generateReport } = require('../../check-voice-consistency');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

/**
 * Check voice consistency
 */
async function checkVoiceConsistencyModule(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('voice-consistency');

  try {
    // Run voice consistency check
    const voiceViolations = checkVoiceConsistency(files);

    // Convert to cleanup system violation format
    for (const violation of voiceViolations) {
      violations.push(
        createViolation({
          file: violation.file,
          line: violation.line,
          message: violation.message,
          severity: violation.severity === 'warning' ? 'warning' : 'info',
          fixable: violation.fixable || false,
          standard: 'voice-consistency',
          reference:
            'See .cursor/rules/dialogs.mdc (PrepFlow Voice Guidelines) and development.mdc (PrepFlow Voice Guidelines). Use contractions, kitchen metaphors, and avoid technical jargon.',
        }),
      );
    }

    return {
      passed: violations.length === 0,
      violations,
      summary:
        violations.length === 0
          ? '✅ No voice consistency violations found'
          : `ℹ️  ${violations.length} voice consistency violation(s) found`,
    };
  } catch (error) {
    return {
      passed: true,
      violations: [],
      summary: `⏭️  Voice consistency check skipped (error: ${error.message})`,
    };
  }
}

module.exports = {
  name: 'voice-consistency',
  check: checkVoiceConsistencyModule,
};
