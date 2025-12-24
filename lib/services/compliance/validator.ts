/**
 * Australian Hospitality Compliance Validator
 * Validates shifts against Australian hospitality industry rules and regulations.
 *
 * @module compliance/validator
 */

// Re-export all validation functions
export { validateShift } from './validator/validateShift';
export { validateEmployeeShifts } from './validator/validateEmployeeShifts';
export { validateShiftAvailability } from './validator/validateShiftAvailability';
export { validateShiftSkills } from './validator/validateShiftSkills';
export { createValidationWarnings } from './validator/createValidationWarnings';

// Re-export constants
export { COMPLIANCE_RULES } from './validator/constants';
