'use client';
import type { SquareConfig } from '../types';

interface ConnectionWorkflowFormProps {
  config: Partial<SquareConfig>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<SquareConfig>>>;
  saving: boolean;
  onConnect: () => void;
}

export function ConnectionWorkflowForm({
  config,
  setConfig,
  saving,
  onConnect,
}: ConnectionWorkflowFormProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Connect Your Square Account
        </h3>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Choose your environment and click &quot;Connect with Square&quot; to authorize PrepFlow to
          access your Square account.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Environment
          </label>
          <select
            value={config.square_environment || 'sandbox'}
            onChange={e =>
              setConfig({
                ...config,
                square_environment: e.target.value as 'sandbox' | 'production',
              })
            }
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
          >
            <option value="sandbox">Sandbox (Testing)</option>
            <option value="production">Production</option>
          </select>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Use Sandbox for testing, Production for live integration
          </p>
        </div>
        <button
          onClick={onConnect}
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Connecting...' : 'Connect with Square'}
        </button>
      </div>
    </div>
  );
}
