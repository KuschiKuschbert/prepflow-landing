'use client';

import { useEffect, useState } from 'react';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function AutosaveGlobalIndicator() {
  const [status, setStatus] = useState<Status>('idle');
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

  if (status === 'idle') return null;

  const color = status === 'saving' ? '#29E7CD' : status === 'saved' ? '#22c55e' : '#ef4444';
  const label = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save error';

  return (
    <span
      aria-live="polite"
      className="ml-2 inline-flex items-center gap-1 rounded-full border border-[#2a2a2a] px-2 py-0.5 text-xs text-gray-300"
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
      {status === 'error' && error && (
        <span className="max-w-[140px] truncate text-[10px] text-gray-400">{error}</span>
      )}
    </span>
  );
}

export default AutosaveGlobalIndicator;
