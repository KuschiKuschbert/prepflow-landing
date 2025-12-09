import { Icon } from '@/components/ui/Icon';
import { Upload } from 'lucide-react';
import type { DocumentType } from '@/app/webapp/roster/types';

interface Step2IDUploadProps {
  idFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void;
}

/**
 * Step 2: ID Upload component
 */
export function Step2IDUpload({ idFile, onFileUpload }: Step2IDUploadProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Step 2: ID Upload</h3>
      <p className="text-sm text-gray-400">Please upload a photo of your government-issued ID</p>
      <div className="rounded-xl border-2 border-dashed border-[#2a2a2a] p-8 text-center">
        <Icon icon={Upload} size="xl" className="mx-auto mb-4 text-gray-400" aria-hidden={true} />
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => onFileUpload(e, 'id')}
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
}
