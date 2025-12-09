import type { OnboardingDocument } from '@/app/webapp/roster/types';

interface BuildDocumentsParams {
  idFile: File | null;
  signatureData: string | null;
  bankBSB: string;
  bankAccount: string;
  taxFileNumber: string;
}

/**
 * Build onboarding documents array from form data
 */
export function buildDocuments({
  idFile,
  signatureData,
  bankBSB,
  bankAccount,
  taxFileNumber,
}: BuildDocumentsParams): Partial<OnboardingDocument>[] {
  const documents: Partial<OnboardingDocument>[] = [];

  if (idFile) {
    // TODO: Upload ID file to Supabase Storage and get URL
    documents.push({
      document_type: 'id',
      file_url: null, // Will be set after upload
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
