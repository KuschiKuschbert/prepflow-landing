'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { usePrompt } from '@/hooks/usePrompt';
import { logger } from '@/lib/logger';
import { AlertTriangle, Database, Key, User } from 'lucide-react';
import { useState } from 'react';

/**
 * Support tools page component for admin dashboard.
 * Provides admin utilities: user impersonation, password reset, and data export.
 *
 * @component
 * @returns {JSX.Element} Support tools admin page
 */
export default function SupportToolsPage() {
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { showPrompt, InputDialog } = usePrompt();
  const [impersonating, setImpersonating] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleImpersonate = async () => {
    const userId = await showPrompt({
      title: 'Impersonate User',
      message: 'Enter the user ID or email to impersonate:',
      placeholder: 'user@example.com',
      type: 'text',
    });

    if (!userId) return;

    const confirmed = await showConfirm({
      title: 'Impersonate User',
      message: `You are about to impersonate ${userId}. This action will be logged. Continue?`,
      variant: 'warning',
    });

    if (!confirmed) return;

    setImpersonating(true);
    try {
      const response = await fetch('/api/admin/support/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess('Impersonation session created');
        // Redirect to webapp with impersonation token
        window.location.href = `/webapp?impersonate=${data.token}`;
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to impersonate user');
      }
    } catch (error) {
      logger.error('Failed to impersonate:', error);
      showError('Failed to impersonate user');
    } finally {
      setImpersonating(false);
    }
  };

  const handleResetPassword = async () => {
    const userId = await showPrompt({
      title: 'Reset Password',
      message: 'Enter the user ID or email to reset password:',
      placeholder: 'user@example.com',
      type: 'text',
    });

    if (!userId) return;

    const confirmed = await showConfirm({
      title: 'Reset Password',
      message: `Reset password for ${userId}? A reset email will be sent.`,
      variant: 'warning',
    });

    if (!confirmed) return;

    setResettingPassword(true);
    try {
      const response = await fetch('/api/admin/support/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        showSuccess('Password reset email sent');
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to reset password');
      }
    } catch (error) {
      logger.error('Failed to reset password:', error);
      showError('Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const tools = [
    {
      title: 'User Impersonation',
      description: 'Impersonate a user to troubleshoot issues',
      icon: User,
      action: handleImpersonate,
      loading: impersonating,
      color: 'text-[#29E7CD]',
      bgColor: 'bg-[#29E7CD]/10',
    },
    {
      title: 'Password Reset',
      description: 'Send password reset email to a user',
      icon: Key,
      action: handleResetPassword,
      loading: resettingPassword,
      color: 'text-[#D925C7]',
      bgColor: 'bg-[#D925C7]/10',
    },
    {
      title: 'Data Search',
      description: 'Search and find data across your system (coming soon)',
      icon: Database,
      action: () => showError('Data search tool coming soon'),
      loading: false,
      color: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
      disabled: true,
    },
    {
      title: 'System Maintenance',
      description: 'Perform system maintenance tasks (coming soon)',
      icon: AlertTriangle,
      action: () => showError('System maintenance tool coming soon'),
      loading: false,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      disabled: true,
    },
  ];

  return (
    <>
      <ConfirmDialog />
      <InputDialog />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Support Tools</h1>
          <p className="mt-2 text-gray-400">Tools for user support and system maintenance</p>
        </div>

        {/* Tools Grid */}
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
          {tools.map(tool => (
            <button
              key={tool.title}
              onClick={tool.action}
              disabled={tool.loading || tool.disabled}
              className={`rounded-2xl border border-[#2a2a2a] p-6 text-left transition-all ${
                tool.disabled
                  ? 'cursor-not-allowed bg-[#1f1f1f] opacity-50'
                  : 'cursor-pointer bg-[#1f1f1f] hover:border-[#29E7CD]/30 hover:shadow-lg'
              }`}
            >
              <div className={`mb-4 w-fit rounded-lg p-3 ${tool.bgColor}`}>
                <Icon icon={tool.icon} size="lg" className={tool.color} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{tool.title}</h3>
              <p className="text-sm text-gray-400">{tool.description}</p>
              {tool.loading && (
                <div className="mt-4 flex items-center gap-2 text-[#29E7CD]">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent"></div>
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
