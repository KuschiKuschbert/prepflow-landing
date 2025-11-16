/**
 * Calculate compliance status based on expiry date and reminder settings.
 *
 * @param {string | null} expiryDate - Expiry date
 * @param {number} [reminderDaysBefore] - Days before expiry to show reminder
 * @returns {string} Compliance status ('active', 'expired', 'pending_renewal')
 */
export function calculateComplianceStatus(
  expiryDate: string | null,
  reminderDaysBefore?: number,
): string {
  if (!expiryDate) return 'active';
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < today) return 'expired';
  if (reminderDaysBefore) {
    const reminderDate = new Date(expiry);
    reminderDate.setDate(reminderDate.getDate() - reminderDaysBefore);
    if (today >= reminderDate) return 'pending_renewal';
  }
  return 'active';
}
