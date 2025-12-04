/**
 * OnboardingWizard Component
 * Multi-step wizard for new employee onboarding (ID upload, contract signing, bank details).
 *
 * @component
 */

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Upload, FileText, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import SignatureCanvas from 'react-signature-canvas';
import type { Employee, OnboardingDocument, DocumentType } from '@/app/webapp/roster/types';

interface OnboardingWizardProps {
  employee: Employee;
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

/**
 * OnboardingWizard component for paperless employee onboarding.
 *
 * @param {OnboardingWizardProps} props - Component props
 * @returns {JSX.Element} Rendered onboarding wizard
 */
export function OnboardingWizard({ employee, onComplete, onCancel }: OnboardingWizardProps) {
  const { showSuccess, showError } = useNotification();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  // Form data
  const [idFile, setIdFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [bankBSB, setBankBSB] = useState(employee.bank_account_bsb ?? '');
  const [bankAccount, setBankAccount] = useState(employee.bank_account_number ?? '');
  const [taxFileNumber, setTaxFileNumber] = useState(employee.tax_file_number ?? '');

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: DocumentType,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (documentType === 'id') {
        setIdFile(file);
      }
      // TODO: Upload to Supabase Storage
    }
  };

  const handleSignatureSave = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL();
      setSignatureData(dataURL);
      showSuccess('Signature saved');
    }
  };

  const handleSignatureClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload documents
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
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 1: Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">First Name</label>
                <input
                  type="text"
                  value={employee.first_name}
                  disabled
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Last Name</label>
                <input
                  type="text"
                  value={employee.last_name}
                  disabled
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  value={employee.email}
                  disabled
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 2: ID Upload</h3>
            <p className="text-sm text-gray-400">
              Please upload a photo of your government-issued ID
            </p>
            <div className="rounded-xl border-2 border-dashed border-[#2a2a2a] p-8 text-center">
              <Icon
                icon={Upload}
                size="xl"
                className="mx-auto mb-4 text-gray-400"
                aria-hidden={true}
              />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => handleFileUpload(e, 'id')}
                className="hidden"
                id="id-upload"
              />
              <label
                htmlFor="id-upload"
                className="cursor-pointer rounded-xl bg-[#29E7CD]/10 px-6 py-3 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
              >
                Choose File
              </label>
              {idFile && <p className="mt-4 text-sm text-gray-300">Selected: {idFile.name}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 3: Contract Signature</h3>
            <p className="text-sm text-gray-400">Please sign the employment contract</p>
            <div className="rounded-xl border border-[#2a2a2a] bg-white p-4">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'w-full h-48 border border-gray-300 rounded',
                }}
              />
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleSignatureClear} size="sm">
                Clear
              </Button>
              <Button variant="primary" onClick={handleSignatureSave} size="sm">
                Save Signature
              </Button>
            </div>
            {signatureData && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Icon icon={CheckCircle} size="sm" aria-hidden={true} />
                Signature saved
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 4: Bank Details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">BSB</label>
                <input
                  type="text"
                  value={bankBSB ?? ''}
                  onChange={e => setBankBSB(e.target.value)}
                  placeholder="000-000"
                  maxLength={6}
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Account Number</label>
                <input
                  type="text"
                  value={bankAccount ?? ''}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="00000000"
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 5: Tax File Number</h3>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Tax File Number (TFN)</label>
              <input
                type="text"
                value={taxFileNumber ?? ''}
                onChange={e => setTaxFileNumber(e.target.value)}
                placeholder="000 000 000"
                maxLength={11}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              />
              <p className="mt-2 text-xs text-gray-500">Your TFN is kept secure and encrypted</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
          <div
            className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6 min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePrevious} disabled={loading}>
              Previous
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button variant="primary" onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                  Completing...
                </>
              ) : (
                'Complete Onboarding'
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
