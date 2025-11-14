#!/usr/bin/env node

/**
 * Helper script to refactor responsive breakpoints
 * This script helps identify patterns but manual review is required
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Breakpoint replacement patterns
const breakpointReplacements = [
  // Remove sm: (mobile-first, no sm needed)
  { pattern: /\bsm:/g, replacement: '' },
  // md: → tablet:
  { pattern: /\bmd:/g, replacement: 'tablet:' },
  // lg: → desktop: (but be careful - some lg: might be meant for 1440px+)
  // This needs manual review
  // xl: → large-desktop: (if meant for 1440px+) OR xl: (if meant for 1920px+)
  // This needs manual review
  // 2xl: → xl: (if meant for 1920px+) OR 2xl: (if meant for 2560px+)
  // This needs manual review
];

// Typography replacements
const typographyReplacements = [
  { pattern: /\btext-xs\b/g, replacement: 'text-fluid-xs' },
  { pattern: /\btext-sm\b/g, replacement: 'text-fluid-sm' },
  { pattern: /\btext-base\b/g, replacement: 'text-fluid-base' },
  { pattern: /\btext-lg\b/g, replacement: 'text-fluid-lg' },
  { pattern: /\btext-xl\b/g, replacement: 'text-fluid-xl' },
  { pattern: /\btext-2xl\b/g, replacement: 'text-fluid-2xl' },
  { pattern: /\btext-3xl\b/g, replacement: 'text-fluid-3xl' },
  { pattern: /\btext-4xl\b/g, replacement: 'text-fluid-4xl' },
];

// Table responsive pattern replacements
const tablePatternReplacements = [
  { pattern: /\bhidden\s+lg:block\b/g, replacement: 'hidden tablet:block' },
  { pattern: /\bblock\s+lg:hidden\b/g, replacement: 'block tablet:hidden' },
];

console.log('Responsive breakpoint refactoring helper script');
console.log('================================================');
console.log('\nThis script helps identify patterns for manual refactoring.');
console.log('Manual review is required for all changes.\n');
