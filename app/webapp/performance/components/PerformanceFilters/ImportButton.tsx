/**
 * Import button with tooltip.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LANDING_COLORS } from '@/lib/landing-styles';

interface ImportButtonProps {
  onImportClick: () => void;
}

export function ImportButton({ onImportClick }: ImportButtonProps) {
  const [importTooltipVisible, setImportTooltipVisible] = useState(false);
  const importButtonRef = useRef<HTMLButtonElement>(null);
  const [importTooltipPos, setImportTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (importTooltipVisible && importButtonRef.current) {
      const rect = importButtonRef.current.getBoundingClientRect();
      setImportTooltipPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
  }, [importTooltipVisible]);

  return (
    <div className="relative">
      <button
        ref={importButtonRef}
        onClick={onImportClick}
        className="flex items-center justify-center rounded-lg px-1.5 py-1 text-xs font-medium text-[var(--primary-text)] transition-colors"
        style={{ backgroundColor: LANDING_COLORS.primary }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = `${LANDING_COLORS.primary}CC`;
          setImportTooltipVisible(true);
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = LANDING_COLORS.primary;
          setImportTooltipVisible(false);
        }}
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 13.293a1 1 0 011.414 0L10 15.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {importTooltipVisible &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed z-[80] w-48 -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-xs text-[var(--foreground-secondary)] shadow-lg"
            style={{ top: `${importTooltipPos.top - 40}px`, left: `${importTooltipPos.left}px` }}
            onMouseEnter={() => setImportTooltipVisible(true)}
            onMouseLeave={() => setImportTooltipVisible(false)}
          >
            Import sales data from CSV file
            <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-t-[var(--surface)] border-r-transparent border-b-transparent border-l-transparent" />
          </div>,
          document.body,
        )}
    </div>
  );
}
