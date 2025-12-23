/**
 * Test helpers for export template system
 * Provides utilities for testing exports, templates, and variants
 */

export { mockExportData } from './test-helpers/mockData';
export {
  validateExportHTML,
  validateVariant,
  hasAppropriateBranding,
} from './test-helpers/helpers/validateHTML';
export { extractCSS, extractContent } from './test-helpers/helpers/extractHTML';
export { testTemplateVariants, generateTestReport } from './test-helpers/helpers/testExecution';
