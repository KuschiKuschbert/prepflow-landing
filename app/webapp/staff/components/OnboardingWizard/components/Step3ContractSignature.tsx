import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CheckCircle } from 'lucide-react';
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface Step3ContractSignatureProps {
  signatureData: string | null;
  onSignatureSave: (dataURL: string) => void;
  onSignatureClear: () => void;
}

/**
 * Step 3: Contract Signature component
 */
export function Step3ContractSignature({
  signatureData,
  onSignatureSave,
  onSignatureClear,
}: Step3ContractSignatureProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL();
      onSignatureSave(dataURL);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onSignatureClear();
    }
  };

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
        <Button variant="secondary" onClick={handleClear} size="sm">
          Clear
        </Button>
        <Button variant="primary" onClick={handleSave} size="sm">
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
}
