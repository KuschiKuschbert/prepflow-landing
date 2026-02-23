'use client';

import { Icon } from '@/lib/ui/Icon';
import { Share2, Link2, Mail, FileText, Check } from 'lucide-react';
import { isWebShareAPIAvailable } from '../share-utils';

interface ShareOptionsProps {
  copied: boolean;
  pdfAvailable: boolean;
  onCopyLink: () => void;
  onWebShare: () => void;
  onEmailClick: () => void;
  onPDFShare: () => void;
}

export function ShareOptions({
  copied,
  pdfAvailable,
  onCopyLink,
  onWebShare,
  onEmailClick,
  onPDFShare,
}: ShareOptionsProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onCopyLink}
        className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
      >
        <Icon
          icon={copied ? Check : Link2}
          size="md"
          className={copied ? 'text-[#29E7CD]' : 'text-gray-400'}
          aria-hidden={true}
        />
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{copied ? 'Copied!' : 'Copy Link'}</div>
          <div className="text-xs text-gray-400">Copy URL to clipboard</div>
        </div>
      </button>

      {isWebShareAPIAvailable() && (
        <button
          onClick={onWebShare}
          className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
        >
          <Icon icon={Share2} size="md" className="text-gray-400" aria-hidden={true} />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Share</div>
            <div className="text-xs text-gray-400">Use device share menu</div>
          </div>
        </button>
      )}

      <button
        onClick={onEmailClick}
        className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
      >
        <Icon icon={Mail} size="md" className="text-gray-400" aria-hidden={true} />
        <div className="flex-1">
          <div className="text-sm font-medium text-white">Email</div>
          <div className="text-xs text-gray-400">Send via email</div>
        </div>
      </button>

      {pdfAvailable && (
        <button
          onClick={onPDFShare}
          className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
        >
          <Icon icon={FileText} size="md" className="text-gray-400" aria-hidden={true} />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">PDF</div>
            <div className="text-xs text-gray-400">Share as PDF</div>
          </div>
        </button>
      )}
    </div>
  );
}
