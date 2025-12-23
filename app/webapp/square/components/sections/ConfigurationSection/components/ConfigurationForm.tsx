'use client';
import { Icon } from '@/components/ui/Icon';
import { Save, Trash2, CheckCircle2 } from 'lucide-react';
import type { SquareConfig } from '../types';

interface ConfigurationFormProps {
  config: Partial<SquareConfig>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<SquareConfig>>>;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export function ConfigurationForm({ config, setConfig, saving, onSave, onDelete }: ConfigurationFormProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-6"
      >
        <div id="square-credentials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Square Connection</h3>
            <div className="flex items-center gap-2">
              <Icon icon={CheckCircle2} size="sm" className="text-green-400" />
              <span className="text-sm text-green-400">Connected</span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              Your Square account is connected via OAuth. PrepFlow automatically manages your access tokens and refreshes
              them when needed.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Environment</label>
            <select
              value={config.square_environment || 'sandbox'}
              onChange={e =>
                setConfig({
                  ...config,
                  square_environment: e.target.value as 'sandbox' | 'production',
                })
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="production">Production</option>
            </select>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">Change environment and reconnect if needed</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Default Location ID (Optional)
            </label>
            <input
              type="text"
              value={config.default_location_id || ''}
              onChange={e => setConfig({ ...config, default_location_id: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="Location ID"
            />
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Your primary Square location ID (found in Square Dashboard)
            </p>
          </div>
        </div>
        <div className="space-y-4 border-t border-[var(--border)] pt-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Sync Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.auto_sync_enabled ?? true}
                onChange={e => setConfig({ ...config, auto_sync_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">Enable automatic syncing</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.sync_menu_items ?? true}
                onChange={e => setConfig({ ...config, sync_menu_items: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">Sync menu items (dishes)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.sync_staff ?? true}
                onChange={e => setConfig({ ...config, sync_staff: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">Sync staff (employees)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.sync_sales_data ?? true}
                onChange={e => setConfig({ ...config, sync_sales_data: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">Sync sales data (orders)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.sync_food_costs ?? true}
                onChange={e => setConfig({ ...config, sync_food_costs: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">Sync food costs</span>
            </label>
          </div>
        </div>
        <div className="space-y-4 border-t border-[var(--border)] pt-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Webhook Settings</h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.webhook_enabled ?? false}
              onChange={e => setConfig({ ...config, webhook_enabled: e.target.checked })}
              className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-sm text-[var(--foreground)]">Enable webhooks for real-time updates</span>
          </label>
          {config.webhook_enabled && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Webhook URL</label>
                <input
                  type="url"
                  value={config.webhook_url || ''}
                  onChange={e => setConfig({ ...config, webhook_url: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  placeholder="https://yourdomain.com/api/webhook/square"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Webhook Secret</label>
                <input
                  type="password"
                  value={config.webhook_secret || ''}
                  onChange={e => setConfig({ ...config, webhook_secret: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  placeholder="Webhook signing secret"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3 border-t border-[var(--border)] pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Icon icon={Save} size="sm" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-medium text-red-400 transition-opacity hover:bg-red-500/20 disabled:opacity-50"
          >
            <Icon icon={Trash2} size="sm" />
            Disconnect Square
          </button>
        </div>
      </form>
    </div>
  );
}

