#!/usr/bin/env node

/**
 * Cleanup Standards Configuration
 * Centralized configuration for all cleanup standards with references to source MDC files
 */

const STANDARDS_CONFIG = {
  'file-sizes': {
    name: 'File Size Limits',
    source: 'development.mdc#file-size-limits',
    severity: 'critical',
    fixable: false,
    limits: {
      page: 500,
      component: 300,
      api: 200,
      util: 150,
      hook: 100,
      data: 2000,
    },
  },
  breakpoints: {
    name: 'Breakpoint Standards',
    source: 'design.mdc#breakpoint-standards',
    severity: 'warning',
    fixable: true,
    customBreakpoints: ['tablet', 'desktop', 'large-desktop', 'xl', '2xl'],
    rogueBreakpoints: ['sm', 'md', 'lg'],
  },
  'console-logs': {
    name: 'Console.log Migration',
    source: 'development.mdc#console-log-migration',
    severity: 'warning',
    fixable: true,
    targetLogger: 'logger.dev',
  },
  'unused-imports': {
    name: 'Unused Imports',
    source: 'development.mdc#code-quality-standards',
    severity: 'warning',
    fixable: true,
  },
  'typescript-ref-types': {
    name: 'TypeScript Ref Types',
    source: 'core.mdc#typescript-ref-types',
    severity: 'critical',
    fixable: false,
    requiredPattern: 'RefObject<HTMLElement | null>',
  },
  jsdoc: {
    name: 'JSDoc Documentation',
    source: 'development.mdc#jsdoc-requirements',
    severity: 'warning',
    fixable: false,
    requiredFields: ['description', 'param', 'returns'],
  },
  icons: {
    name: 'Icon Standards',
    source: 'design.mdc#icon-standards',
    severity: 'warning',
    fixable: false,
    requiredWrapper: 'components/ui/Icon.tsx',
    allowedLibrary: 'lucide-react',
  },
  naming: {
    name: 'Naming Conventions',
    source: 'development.mdc#naming-conventions',
    severity: 'info',
    fixable: false,
    filePattern: 'kebab-case',
    componentPattern: 'PascalCase',
    functionPattern: 'camelCase',
    constantPattern: 'UPPER_SNAKE_CASE',
  },
  prettier: {
    name: 'Prettier Formatting',
    source: 'development.mdc#prettier-configuration',
    severity: 'warning',
    fixable: true,
  },
  eslint: {
    name: 'ESLint Violations',
    source: 'development.mdc#eslint-configuration',
    severity: 'warning',
    fixable: true,
  },
  'dead-code': {
    name: 'Dead Code Detection',
    source: 'development.mdc#dead-code-removal',
    severity: 'info',
    fixable: true,
  },
  security: {
    name: 'Security Patterns',
    source: 'security.mdc#security-standards',
    severity: 'critical',
    fixable: false,
  },
  performance: {
    name: 'Performance Standards',
    source: 'operations.mdc#performance-standards',
    severity: 'warning',
    fixable: false,
    targets: {
      lcp: 2.5,
      fid: 100,
      cls: 0.1,
      apiResponse: 500,
      bundleSize: 200,
    },
  },
};

/**
 * Get standard configuration
 */
function getStandardConfig(standardName) {
  return STANDARDS_CONFIG[standardName];
}

/**
 * Get all standards
 */
function getAllStandards() {
  return Object.keys(STANDARDS_CONFIG);
}

/**
 * Get fixable standards
 */
function getFixableStandards() {
  return Object.keys(STANDARDS_CONFIG).filter(key => STANDARDS_CONFIG[key].fixable);
}

/**
 * Get standards by severity
 */
function getStandardsBySeverity(severity) {
  return Object.keys(STANDARDS_CONFIG).filter(key => STANDARDS_CONFIG[key].severity === severity);
}

module.exports = {
  STANDARDS_CONFIG,
  getStandardConfig,
  getAllStandards,
  getFixableStandards,
  getStandardsBySeverity,
};
