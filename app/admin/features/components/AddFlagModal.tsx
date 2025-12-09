'use client';

import { useState } from 'react';

interface AddFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flag: { flag_key: string; description: string; enabled: boolean }) => void;
}

/**
 * Add feature flag modal component for admin dashboard.
 * Provides form to create new regular feature flags.
 *
 * @component
 * @param {AddFlagModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSubmit - Callback when flag is submitted
 * @returns {JSX.Element} Add flag modal component
 */
export function AddFlagModal({ isOpen, onClose, onSubmit }: AddFlagModalProps) {
  const [newFlag, setNewFlag] = useState({
    flag_key: '',
    description: '',
    enabled: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!newFlag.flag_key.trim()) return;
    onSubmit(newFlag);
    setNewFlag({ flag_key: '', description: '', enabled: false });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-50 w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-white">Add Feature Flag</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Flag Key</label>
            <input
              type="text"
              value={newFlag.flag_key}
              onChange={e => setNewFlag({ ...newFlag, flag_key: e.target.value })}
              placeholder="feature_name"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Description</label>
            <input
              type="text"
              value={newFlag.description}
              onChange={e => setNewFlag({ ...newFlag, description: e.target.value })}
              placeholder="Optional description"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={newFlag.enabled}
              onChange={e => setNewFlag({ ...newFlag, enabled: e.target.checked })}
              className="rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-[#29E7CD]"
            />
            <label htmlFor="enabled" className="text-sm text-gray-300">
              Enabled by default
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!newFlag.flag_key.trim()}
              className="flex-1 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-[#2a2a2a] px-4 py-2 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
