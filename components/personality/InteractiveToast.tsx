// PrepFlow Personality System - Interactive Toast Component

'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Info, X } from 'lucide-react';

interface InteractiveToastProps {
  message: string;
  tip?: string;
  learnMoreUrl?: string;
  onClose: () => void;
}

export function InteractiveToast({ message, tip, learnMoreUrl, onClose }: InteractiveToastProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="group relative max-w-md rounded-2xl border border-[#29E7CD]/50 bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
          {showTip && tip && (
            <div className="mt-2 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-3">
              <p className="text-xs text-gray-300">{tip}</p>
            </div>
          )}
          {showTip && learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-[#29E7CD] underline hover:text-[#D925C7]"
            >
              Learn more →
            </a>
          )}
        </div>
        <div className="flex gap-2">
          {tip && (
            <button
              onClick={() => setShowTip(!showTip)}
              className="rounded-full p-1.5 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
              aria-label={showTip ? 'Hide tip' : 'Show tip'}
            >
              <Icon icon={Info} size="sm" aria-hidden={true} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close"
          >
            <Icon icon={X} size="sm" aria-hidden={true} />
          </button>
        </div>
      </div>
    </div>
  );
}
