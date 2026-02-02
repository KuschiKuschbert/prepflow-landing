import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { DocumentType } from '@/lib/types/roster';

interface UseOnboardingWizardHandlersProps {
  setSignatureData: (data: string | null) => void;
}

/**
 * Hook for onboarding wizard handlers (file upload, signature)
 */
export function useOnboardingWizardHandlers({
  setSignatureData,
}: UseOnboardingWizardHandlersProps) {
  const { showSuccess } = useNotification();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
      const file = event.target.files?.[0];
      if (file && documentType === 'id') {
        // File is handled by parent component state
        // TODO: Upload to Supabase Storage
      }
    },
    [],
  );

  const handleSignatureSave = useCallback(
    (dataURL: string) => {
      setSignatureData(dataURL);
      showSuccess('Signature saved');
    },
    [setSignatureData, showSuccess],
  );

  const handleSignatureClear = useCallback(() => {
    setSignatureData(null);
  }, [setSignatureData]);

  return {
    handleFileUpload,
    handleSignatureSave,
    handleSignatureClear,
  };
}
