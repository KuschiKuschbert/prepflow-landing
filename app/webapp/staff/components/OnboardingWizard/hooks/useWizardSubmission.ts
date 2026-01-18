import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { Employee } from '@/app/webapp/roster/types';
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
      // Build documents array
      const _documents = buildDocuments({
        idFile,
        signatureData,
        bankBSB,
        bankAccount,
        taxFileNumber,
      });

      // Update employee with bank details and TFN
      const updateResponse = await fetch(`/api/staff/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bank_account_bsb: bankBSB,
          bank_account_number: bankAccount,
          tax_file_number: taxFileNumber,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update employee details');
      }

      // TODO: Save onboarding documents via API

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
