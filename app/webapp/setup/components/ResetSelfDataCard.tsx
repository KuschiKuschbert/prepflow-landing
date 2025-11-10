'use client';

import { useMemo, useState } from 'react';
import { getOrCreateUserId } from '@/lib/user-utils';

interface Props {
  defaultReseed?: boolean;
}

export default function ResetSelfDataCard({ defaultReseed = true }: Props) {
  const userId = useMemo(() => getOrCreateUserId(), []);
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const canConfirm = confirmText === 'RESET' && !loading;

  const handleOpen = () => {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'reset_self_open' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmText('');
    setResult(null);
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setLoading(true);
    setResult(null);

    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'reset_self_confirm' });
    }

    try {
      const res = await fetch('/api/db/reset-self', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, all: true }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || json?.error || 'Reset failed');
      }
      setResult('Success');
      if (typeof window !== 'undefined') {
        (window as any).dataLayer.push({ event: 'reset_self_success' });
      }
      // Auto-close after short delay to confirm success visually
      setTimeout(() => {
        setOpen(false);
        setConfirmText('');
        setResult(null);
      }, 1200);
    } catch (e: any) {
      setResult(e?.message || 'Error');
      if (typeof window !== 'undefined') {
        (window as any).dataLayer.push({ event: 'reset_self_error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-3 text-sm font-semibold text-white">Danger Zone</div>
      <h3 className="mb-2 text-2xl font-bold text-white">Clean the bench (my data)</h3>
      <p className="mb-4 text-gray-400">
        Wipe the kitchen clean: this will clear all demo data in the workspace (ingredients,
        recipes, suppliers, equipment, logs, lists). Use the Populate Clean Test Data button to
        restore the tidy demo set.
      </p>

      <button
        onClick={handleOpen}
        className="rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-4 py-2 text-white transition-all duration-200 hover:opacity-90"
      >
        Clean the bench (my data)
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <h4 className="mb-2 text-xl font-bold text-white">Confirm cleanup</h4>
            <p className="mb-4 text-sm text-gray-400">
              Type <span className="font-mono text-white">RESET</span> to wipe your station. This
              can’t be undone.
            </p>
            <div className="mb-3">
              <input
                aria-label="Type RESET to confirm"
                className="w-full rounded-xl border border-[#2a2a2a] bg-transparent p-2 text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="Type RESET"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="rounded-xl border border-[#2a2a2a] px-4 py-2 text-gray-200 hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`rounded-xl px-4 py-2 text-white ${
                  canConfirm ? 'bg-[#29E7CD] hover:bg-[#29E7CD]/80' : 'bg-[#2a2a2a] text-gray-400'
                }`}
              >
                {loading ? 'Wiping…' : 'Confirm wipe'}
              </button>
            </div>
            {result && <div className="mt-3 text-sm text-gray-300">{result}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
