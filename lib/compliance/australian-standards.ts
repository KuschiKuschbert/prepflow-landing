/**
 * Australian Standards Compliance Utilities
 * Helper functions for Australian food safety compliance standards
 */

/**
 * Format date in Australian format (DD/MM/YYYY)
 *
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatAustralianDate(date: string | Date | null): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Check if a qualification is required for a specific role
 *
 * @param {string} role - Employee role
 * @param {string} qualificationName - Qualification name
 * @returns {boolean} Whether qualification is required
 */
export function isQualificationRequired(role: string | null, qualificationName: string): boolean {
  // Food Safety Supervisor is required for all food handlers in most Australian states
  if (qualificationName.toLowerCase().includes('food safety supervisor')) {
    return true;
  }

  // Food Handler Certificate is required for all food handlers
  if (qualificationName.toLowerCase().includes('food handler')) {
    return true;
  }

  // RSA is required if serving alcohol (could be role-based in future)
  if (qualificationName.toLowerCase().includes('rsa')) {
    return false; // Optional unless role requires it
  }

  return false;
}

/**
 * Validate expiry date for a qualification
 *
 * @param {string | null} expiryDate - Expiry date
 * @param {string} issueDate - Issue date
 * @returns {boolean} Whether expiry date is valid (after issue date)
 */
export function validateExpiryDate(expiryDate: string | null, issueDate: string): boolean {
  if (!expiryDate) return true; // No expiry is valid
  const expiry = new Date(expiryDate);
  const issue = new Date(issueDate);
  return expiry > issue;
}

/**
 * Calculate renewal reminder date
 *
 * @param {string | null} expiryDate - Expiry date
 * @param {number} daysBefore - Days before expiry to remind
 * @returns {Date | null} Reminder date
 */
export function calculateRenewalReminder(
  expiryDate: string | null,
  daysBefore: number = 30,
): Date | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const reminderDate = new Date(expiry);
  reminderDate.setDate(reminderDate.getDate() - daysBefore);
  return reminderDate;
}

/**
 * Get days until expiry
 *
 * @param {string | null} expiryDate - Expiry date
 * @returns {number | null} Days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get expiry status
 *
 * @param {string | null} expiryDate - Expiry date
 * @returns {'expired' | 'expiring_soon' | 'valid'} Expiry status
 */
export function getExpiryStatus(expiryDate: string | null): 'expired' | 'expiring_soon' | 'valid' {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  if (daysUntilExpiry === null) return 'valid';
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 90) return 'expiring_soon';
  return 'valid';
}

/**
 * Format currency in Australian dollars
 *
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatAUD(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount);
}

