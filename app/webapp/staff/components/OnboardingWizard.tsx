/**
 * OnboardingWizard Component
 * Multi-step wizard for new employee onboarding (ID upload, contract signing, bank details).
 *
 * @component
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Step1PersonalDetails } from './OnboardingWizard/components/Step1PersonalDetails';
import { Step2IDUpload } from './OnboardingWizard/components/Step2IDUpload';
import { Step3ContractSignature } from './OnboardingWizard/components/Step3ContractSignature';
import { Step4BankDetails } from './OnboardingWizard/components/Step4BankDetails';
import { Step5TaxFileNumber } from './OnboardingWizard/components/Step5TaxFileNumber';
import { WizardProgressBar } from './OnboardingWizard/components/WizardProgressBar';
import { WizardNavigation } from './OnboardingWizard/components/WizardNavigation';
import { useOnboardingWizardState } from './OnboardingWizard/hooks/useOnboardingWizardState';
import { useOnboardingWizardHandlers } from './OnboardingWizard/hooks/useOnboardingWizardHandlers';
import { useWizardNavigation } from './OnboardingWizard/hooks/useWizardNavigation';
import { useWizardSubmission } from './OnboardingWizard/hooks/useWizardSubmission';
import type { OnboardingWizardProps } from './OnboardingWizard/types';

/**
 * OnboardingWizard component for paperless employee onboarding.
 *
 * @param {OnboardingWizardProps} props - Component props
 * @returns {JSX.Element} Rendered onboarding wizard
 */
export function OnboardingWizard({ employee, onComplete, onCancel }: OnboardingWizardProps) {
  const totalSteps = 5;

  const {
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    idFile,
    setIdFile: _setIdFile,
    signatureData,
    setSignatureData,
    bankBSB,
    setBankBSB,
    bankAccount,
    setBankAccount,
    taxFileNumber,
    setTaxFileNumber,
  } = useOnboardingWizardState(employee);

  const { handleNext, handlePrevious } = useWizardNavigation({
    currentStep,
    totalSteps,
    setCurrentStep,
  });

  const { handleFileUpload, handleSignatureSave, handleSignatureClear } =
    useOnboardingWizardHandlers({
      setSignatureData,
    });

  const { handleSubmit } = useWizardSubmission({
    employee,
    idFile,
    signatureData,
    bankBSB,
    bankAccount,
    taxFileNumber,
    setLoading,
    onComplete,
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalDetails employee={employee} />;
      case 2:
        return <Step2IDUpload idFile={idFile} onFileUpload={handleFileUpload} />;
      case 3:
        return (
          <Step3ContractSignature
            signatureData={signatureData}
            onSignatureSave={handleSignatureSave}
            onSignatureClear={handleSignatureClear}
          />
        );
      case 4:
        return (
          <Step4BankDetails
            bankBSB={bankBSB}
            bankAccount={bankAccount}
            onBSBChange={setBankBSB}
            onAccountChange={setBankAccount}
          />
        );
      case 5:
        return (
          <Step5TaxFileNumber
            taxFileNumber={taxFileNumber}
            onTaxFileNumberChange={setTaxFileNumber}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <WizardProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="mb-6 min-h-[400px]">{renderStep()}</div>

      <WizardNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        loading={loading}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </Card>
  );
}
