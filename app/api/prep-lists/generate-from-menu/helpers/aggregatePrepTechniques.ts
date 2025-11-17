/**
 * Aggregate prep techniques from multiple recipes into section-level prep techniques
 *
 * NOTE: This file re-exports from shared utilities for backward compatibility.
 * New code should import from '@/app/webapp/prep-lists/utils/prepTechniques' instead.
 */

// Re-export from shared utilities
export {
  aggregatePrepTechniques,
  addPrepNotesToIngredients,
} from '@/app/webapp/prep-lists/utils/prepTechniques';
