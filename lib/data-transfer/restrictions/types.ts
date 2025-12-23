export interface TransferRestrictionResult {
  allowed: boolean;
  restricted: boolean;
  countryCode: string | null;
  reason?: string;
  requiresConsent: boolean;
  consentGiven: boolean;
}

