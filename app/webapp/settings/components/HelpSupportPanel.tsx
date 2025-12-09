'use client';

import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const userEmail = session?.user?.email || undefined;

  const { recentErrors, loadingErrors, refreshErrors } = useRecentErrors(userEmail);
  const { autoReport, loadingAutoReport, handleAutoReportToggle } = useAutoReport(userEmail);
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
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Help & Support</h2>
        <p className="mt-1 text-sm text-gray-300">
          Get help, report issues, or request new features.
        </p>
      </div>

      <QuickActions onContactFormClick={() => setShowForm(!showForm)} />

      {/* Recent Errors Section */}
      {userEmail && (
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Errors</h3>
            {recentErrors.length > 0 && (
              <span className="text-xs text-gray-400">
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
        <div className="border-t border-[#2a2a2a] pt-4">
          <AutoReportToggle
            enabled={autoReport}
            loading={loadingAutoReport}
            onToggle={handleAutoReportToggle}
          />
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
