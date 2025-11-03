'use client';

import { useEffect, useState } from 'react';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function AutosaveGlobalIndicator() {
  // Default to saved so the indicator is visible even before first edit
  const [status, setStatus] = useState<Status>('saved');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onStatus = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        status: Status;
        entityType?: string;
        entityId?: string;
        error?: string;
      };
      setStatus(detail.status);
      setError(detail.status === 'error' ? detail.error || null : null);

      if (detail.status === 'saved') {
        const t = setTimeout(() => setStatus('idle'), 1500);
        return () => clearTimeout(t);
      }
      return undefined;
    };

    window.addEventListener('autosave:status', onStatus as EventListener);
    return () => window.removeEventListener('autosave:status', onStatus as EventListener);
  }, []);

  const color = status === 'saving' ? '#29E7CD' : status === 'saved' ? '#22c55e' : '#ef4444';
  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved to PrepFlow' : 'Save error';

  return (
    <span
      aria-live="polite"
      className="ml-2 inline-flex items-center gap-1 rounded-full border border-[#2a2a2a] px-2 py-0.5 text-xs text-gray-300"
      title={status === 'saved' ? 'All changes saved to PrepFlow' : undefined}
    >
      {/* Cloud save icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 text-gray-400"
        aria-hidden="true"
      >
        <path d="M6 19a4 4 0 0 1-.88-7.91A6 6 0 0 1 17.92 9H18a4 4 0 0 1 .8 7.94L18.5 17H7a2 2 0 1 0-.06 4H17a1 1 0 1 0 0-2H6z" />
      </svg>
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
      {status === 'error' && error && (
        <span className="max-w-[140px] truncate text-[10px] text-gray-400">{error}</span>
      )}
    </span>
  );
}

export default AutosaveGlobalIndicator;
