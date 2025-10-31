'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [busy, setBusy] = useState(false);
  const request = async (path: string, method: 'GET' | 'POST') => {
    setBusy(true);
    try {
      const res = await fetch(path, { method });
      const data = await res.json();
      alert(data.message || (res.ok ? 'Done' : 'Error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Settings</h1>
      <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <h2 className="text-xl font-semibold">Privacy controls</h2>
        <p className="text-gray-300">
          You can export or request deletion of your data at any time.
        </p>
        <div className="flex gap-3">
          <button
            disabled={busy}
            className="rounded-2xl border border-[#2a2a2a] px-4 py-2 hover:bg-[#2a2a2a]/40"
            onClick={() => request('/api/account/export', 'GET')}
          >
            Export my data
          </button>
          <button
            disabled={busy}
            className="rounded-2xl border border-[#2a2a2a] px-4 py-2 hover:bg-[#2a2a2a]/40"
            onClick={() => request('/api/account/delete', 'POST')}
          >
            Request deletion
          </button>
        </div>
      </div>
    </div>
  );
}

