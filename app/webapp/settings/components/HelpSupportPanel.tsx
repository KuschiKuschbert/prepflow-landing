'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { QuickActions } from './HelpSupportPanel/components/QuickActions';
import { RecentErrorsList } from './HelpSupportPanel/components/RecentErrorsList';
import { AutoReportToggle } from './HelpSupportPanel/components/AutoReportToggle';
import { PrivacyNotice } from './HelpSupportPanel/components/PrivacyNotice';
import { SupportForm } from './HelpSupportPanel/components/SupportForm';
import { useRecentErrors } from './HelpSupportPanel/hooks/useRecentErrors';
import { useAutoReport } from './HelpSupportPanel/hooks/useAutoReport';
import { useSupportForm } from './HelpSupportPanel/hooks/useSupportForm';

/**
 * Help and support panel component for settings page.
 * Provides links to support resources and contact options.
 *
 * @component
 * @returns {JSX.Element} Help and support panel
 */
export function HelpSupportPanel() {
  const { user } = useUser();
  const userEmail = user?.email || undefined;

  const { recentErrors, loadingErrors, refreshErrors } = useRecentErrors(userEmail);
  const { autoReport, handleAutoReportToggle } = useAutoReport(userEmail);
  const {
    formData,
    setFormData,
    submitting,
    showForm,
    setShowForm,
    handleSubmit,
    handleReportError,
    resetForm,
  } = useSupportForm(userEmail, refreshErrors);

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Help & Support</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Get help, report issues, or request new features.
        </p>
      </div>

      <QuickActions onContactFormClick={() => setShowForm(!showForm)} />

      {/* Recent Errors Section */}
      {userEmail && (
        <div className="border-t border-[var(--border)] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Errors</h3>
            {recentErrors.length > 0 && (
              <span className="text-xs text-[var(--foreground-muted)]">
                {recentErrors.length} error{recentErrors.length !== 1 ? 's' : ''} in last 7 days
              </span>
            )}
          </div>
          <RecentErrorsList
            errors={recentErrors}
            loading={loadingErrors}
            onReportError={handleReportError}
          />
        </div>
      )}

      {/* Auto-Report Toggle */}
      {userEmail && (
        <div className="border-t border-[var(--border)] pt-4">
          <AutoReportToggle enabled={autoReport} onToggle={handleAutoReportToggle} />
        </div>
      )}

      <PrivacyNotice />

      {/* Support Form */}
      {showForm && (
        <SupportForm
          formData={formData}
          submitting={submitting}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}
    </div>
  );
}
