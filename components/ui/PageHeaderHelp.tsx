'use client';

import { Icon } from '@/components/ui/Icon';
import { buildGuideUrl } from '@/lib/page-help/page-help-config';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import type { PageHelpConfig } from '@/lib/page-help/page-help-config';

interface PageHeaderHelpProps {
  config: PageHelpConfig;
  className?: string;
}

/**
 * Help icon with popover for page-level guidance.
 * Shows summary and link to full guide. On-demand only—never proactive.
 */
export function PageHeaderHelp({ config, className = '' }: PageHeaderHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const guideUrl = config.guideId ? buildGuideUrl(config.guideId, config.guideStepIndex) : null;

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        aria-label="Show page help"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={HelpCircle} size="sm" aria-hidden={true} />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 z-[80] mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
          role="dialog"
          aria-label="Page help"
        >
          <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
            {config.helpSummary}
          </p>
          {guideUrl && (
            <Link
              href={guideUrl}
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-block text-sm font-medium text-[var(--primary)] transition-colors hover:underline"
            >
              Open full guide →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
