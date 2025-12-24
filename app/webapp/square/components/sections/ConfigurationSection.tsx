'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Save, Trash2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { ConnectionWorkflow } from './ConnectionWorkflow';
import { useSquareStatus } from '../../hooks/useSquareStatus';
import type { SquareConfig } from './ConfigurationSection/types';
import { fetchSquareConfig } from './ConfigurationSection/helpers/fetchConfig';
import { saveSquareConfig } from './ConfigurationSection/helpers/saveConfig';
import { deleteSquareConfig } from './ConfigurationSection/helpers/deleteConfig';
import { ConnectionWorkflowForm } from './ConfigurationSection/components/ConnectionWorkflowForm';
import { ConfigurationForm } from './ConfigurationSection/components/ConfigurationForm';

export function ConfigurationSection() {
  const { user } = useUser();
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConnectionWorkflow, setShowConnectionWorkflow] = useState(false);
  const [config, setConfig] = useState<Partial<SquareConfig>>({
    square_environment: 'sandbox',
    auto_sync_enabled: true,
    sync_menu_items: true,
    sync_staff: true,
    sync_sales_data: true,
    sync_food_costs: true,
    webhook_enabled: false,
  });

  // Use shared status hook instead of separate API call
  const { status } = useSquareStatus();

  useEffect(() => {
    // Initialize config from shared status data (faster than separate API call)
    if (status?.config) {
      const hasConfig = !!status.config.square_environment;
      setShowConnectionWorkflow(!hasConfig);
      setConfig({
        square_environment: status.config.square_environment || 'sandbox',
        default_location_id: '', // Not in status API
        auto_sync_enabled: status.config.auto_sync_enabled ?? true,
        sync_menu_items: true, // Defaults
        sync_staff: true,
        sync_sales_data: true,
        sync_food_costs: true,
        webhook_enabled: status.config.webhook_enabled ?? false,
        webhook_url: status.config.webhook_url || '',
        webhook_secret: '', // Not exposed in status API for security
      });
      setLoading(false);
    } else if (status !== null) {
      // Status loaded but no config - show connection workflow
      setShowConnectionWorkflow(true);
      setLoading(false);
    }
  }, [status]);

  const fetchConfig = async () => {
    await fetchSquareConfig({ setConfig, setShowConnectionWorkflow, setLoading, showError });
  };

  const handleSave = async () => {
    await saveSquareConfig({
      config,
      setSaving,
      setShowConnectionWorkflow,
      showSuccess,
      showError,
      fetchConfig,
    });
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Square Configuration',
      message:
        "Are you sure you want to delete your Square configuration? This will disconnect your Square POS integration and stop all syncing. This action can't be undone.",
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    await deleteSquareConfig({ setSaving, setConfig, showSuccess, showError });
  };

  const handleOAuthConnect = async () => {
    try {
      setSaving(true);
      const environment = config.square_environment || 'sandbox';
      window.location.href = `/api/square/oauth?environment=${environment}`;
    } catch (error: any) {
      logger.error('[Square Config] OAuth redirect error:', { error: error.message });
      showError('Failed to start Square connection. Give it another go, chef.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton variant="form" className="h-96" />;
  }

  if (showConnectionWorkflow) {
    return (
      <div className="space-y-6">
        <ConnectionWorkflow onConnectClick={handleOAuthConnect} />
        <ConnectionWorkflowForm
          config={config}
          setConfig={setConfig}
          saving={saving}
          onConnect={handleOAuthConnect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Configuration</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Configure your Square POS integration credentials and sync preferences
        </p>
      </div>
      <ConfigurationForm
        config={config}
        setConfig={setConfig}
        saving={saving}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <ConfirmDialog />
    </div>
  );
}
