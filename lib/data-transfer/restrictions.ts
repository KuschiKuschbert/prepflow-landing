/**
 * Data Transfer Restrictions
 * Enforces restrictions on data transfers to restricted countries
 */

export type { TransferRestrictionResult } from './restrictions/types';
export { checkTransferRestriction } from './restrictions/helpers/checkTransferRestriction';
export { recordTransferConsent } from './restrictions/helpers/recordConsent';
export { revokeTransferConsent } from './restrictions/helpers/revokeConsent';
