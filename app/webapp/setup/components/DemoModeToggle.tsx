'use client';

import { useEffect, useState } from 'react';

export default function DemoModeToggle() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )pf_demo=([^;]*)/);
    setEnabled(match?.[1] === '1');
  }, []);

  const setCookie = (on: boolean) => {
    const value = on ? '1' : '0';
    const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toUTCString();
    document.cookie = `pf_demo=${value}; Path=/; Expires=${expires}`;
    setEnabled(on);
    // Reload to let server routes pick up cookie on first request
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Demo Mode (Read‑only)</h3>
          <p className="text-sm text-gray-400">
            When enabled, recipes and ingredients are served from the built‑in demo dataset. Your
            database is untouched.
          </p>
        </div>
        <button
          onClick={() => setCookie(!enabled)}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
            enabled
              ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white'
              : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
          }`}
          aria-pressed={enabled}
        >
          {enabled ? 'On' : 'Off'}
        </button>
      </div>
      {enabled && (
        <div className="mt-3 text-sm text-[#29E7CD]">Demo mode is active for this browser.</div>
      )}
    </div>
  );
}
