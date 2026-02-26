import type { OnboardingDocument } from '@/lib/types/roster';

interface BuildDocumentsParams {
  idFileUrl: string | null;
  signatureData: string | null;
  bankBSB: string;
  bankAccount: string;
  taxFileNumber: string;
}

/**
 * Build onboarding documents array from form data
 */
export function buildDocuments({
  idFileUrl,
  signatureData,
  bankBSB,
  bankAccount,
  taxFileNumber,
}: BuildDocumentsParams): Partial<OnboardingDocument>[] {
  const documents: Partial<OnboardingDocument>[] = [];

  if (idFileUrl) {
    documents.push({
      document_type: 'id',
      file_url: idFileUrl,
    });
  }

  if (signatureData) {
    documents.push({
      document_type: 'contract',
      signature_data: signatureData,
      signed_at: new Date().toISOString(),
    });
  }

  if (bankBSB && bankAccount) {
    documents.push({
      document_type: 'bank_details',
    });
  }

  if (taxFileNumber) {
    documents.push({
      document_type: 'tax_form',
    });
  }

  return documents;
}
