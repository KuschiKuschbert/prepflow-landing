import type { Employee } from '@/app/webapp/roster/types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { buildDocuments } from '../utils/buildDocuments';

interface UseWizardSubmissionProps {
  employee: Employee;
  idFile: File | null;
  signatureData: string | null;
  bankBSB: string;
  bankAccount: string;
  taxFileNumber: string;
  setLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

/**
 * Hook for wizard submission logic
 */
export function useWizardSubmission({
  employee,
  idFile,
  signatureData,
  bankBSB,
  bankAccount,
  taxFileNumber,
  setLoading,
  onComplete,
}: UseWizardSubmissionProps) {
  const { showSuccess, showError } = useNotification();

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      let idFileUrl: string | null = null;

      // 1. Upload ID file if present
      if (idFile) {
        const fileExt = idFile.name.split('.').pop();
        const fileName = `${employee.id}/id_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('onboarding-docs')
          .upload(fileName, idFile);

        if (uploadError) {
          throw new Error(`Failed to upload ID: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('onboarding-docs')
          .getPublicUrl(fileName);

        idFileUrl = publicUrlData.publicUrl;
      }

      // 2. Build documents payload
      const documents = buildDocuments({
        idFileUrl,
        signatureData,
        bankBSB,
        bankAccount,
        taxFileNumber,
      });

      // 3. Submit entire package to onboarding API
      const response = await fetch('/api/staff/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employee.id,
          bank_account_bsb: bankBSB,
          bank_account_number: bankAccount,
          tax_file_number: taxFileNumber,
          documents,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete onboarding');
      }

      showSuccess('Onboarding completed successfully');
      onComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      showError(errorMessage);
      logger.error('Onboarding submission failed', error);
    } finally {
      setLoading(false);
    }
  }, [
    idFile,
    signatureData,
    bankBSB,
    bankAccount,
    taxFileNumber,
    employee.id,
    setLoading,
    showSuccess,
    showError,
    onComplete,
  ]);

  return {
    handleSubmit,
  };
}
