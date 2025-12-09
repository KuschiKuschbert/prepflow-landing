import { useState } from 'react';
import type { Employee } from '@/app/webapp/roster/types';
import type { WizardStep } from '../types';

/**
 * Hook for managing onboarding wizard state
 */
export function useOnboardingWizardState(employee: Employee) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [bankBSB, setBankBSB] = useState(employee.bank_account_bsb ?? '');
  const [bankAccount, setBankAccount] = useState(employee.bank_account_number ?? '');
  const [taxFileNumber, setTaxFileNumber] = useState(employee.tax_file_number ?? '');

  return {
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    idFile,
    setIdFile,
    signatureData,
    setSignatureData,
    bankBSB,
    setBankBSB,
    bankAccount,
    setBankAccount,
    taxFileNumber,
    setTaxFileNumber,
  };
}
