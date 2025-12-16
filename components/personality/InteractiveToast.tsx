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
    <div className="group relative max-w-md rounded-2xl border border-[var(--primary)]/50 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--button-active-text)]">{message}</p>
          {showTip && tip && (
            <div className="mt-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3">
              <p className="text-xs text-[var(--foreground-secondary)]">{tip}</p>
            </div>
          )}
          {showTip && learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-[var(--primary)] underline hover:text-[var(--accent)]"
            >
              Learn more →
            </a>
          )}
        </div>
        <div className="flex gap-2">
          {tip && (
            <button
              onClick={() => setShowTip(!showTip)}
              className="rounded-full p-1.5 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
              aria-label={showTip ? 'Hide tip' : 'Show tip'}
            >
              <Icon icon={Info} size="sm" aria-hidden={true} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <Icon icon={X} size="sm" aria-hidden={true} />
          </button>
        </div>
      </div>
    </div>
  );
}
