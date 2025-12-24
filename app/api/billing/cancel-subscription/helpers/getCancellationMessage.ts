/**
 * Get cancellation message based on EU status and cancellation type
 *
 * @param {boolean} isEU - Whether user is EU customer
 * @param {boolean} immediate - Whether cancellation is immediate
 * @returns {string} Cancellation message
 */
export function getCancellationMessage(isEU: boolean, immediate: boolean): string {
  if (isEU) {
    return immediate
      ? 'Subscription cancelled immediately. As an EU customer, you can cancel at any time without penalty.'
      : 'Subscription will be cancelled at the end of the billing period. As an EU customer, you can cancel at any time without penalty.';
  }
  return immediate
    ? 'Subscription cancelled immediately'
    : 'Subscription will be cancelled at the end of the billing period';
}
