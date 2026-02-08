'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Copy, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * System information panel component for settings page.
 * Displays app version, build info, and browser information.
 *
 * @component
 * @returns {JSX.Element} System information panel
 */
export function SystemInformationPanel() {
  const [copied, setCopied] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    appVersion: '0.1.1',
    browser: '',
    os: '',
    userAgent: '',
  });

  useEffect(() => {
    // Get browser and OS info
    const initialInfo = detectSystemInfo();
    setSystemInfo(prev => ({ ...prev, ...initialInfo }));

    // Fetch latest Android version from Supabase
    const fetchAndroidVersion = async () => {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'android_version')
          .single();

        if (data?.value) {
          // Remove quotes if the JSONB value is a stringified string
          const version =
            typeof data.value === 'string' ? data.value.replace(/^"|"$/g, '') : String(data.value);
          setSystemInfo(prev => ({ ...prev, appVersion: version }));
        }
      } catch (e) {
        logger.error('Failed to fetch android version', { error: e });
      }
    };

    fetchAndroidVersion();
  }, []);

  const copySystemInfo = async () => {
    const info = `PrepFlow System Information
App Version: ${systemInfo.appVersion}
Browser: ${systemInfo.browser}
OS: ${systemInfo.os}
User Agent: ${systemInfo.userAgent}
Environment: ${process.env.NODE_ENV || 'unknown'}`;

    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('[SystemInformationPanel.tsx] Clipboard error (using fallback):', {
        error: error instanceof Error ? error.message : String(error),
      });

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = info;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-fluid-xl tablet:text-fluid-2xl font-semibold text-[var(--foreground)]">
          System Information
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Technical details for support and troubleshooting.
        </p>
      </div>

      <div className="space-y-3">
        <InfoRow label="App Version" value={systemInfo.appVersion} />
        <InfoRow label="Browser" value={systemInfo.browser} />
        <InfoRow label="Operating System" value={systemInfo.os} />
        <InfoRow
          label="Environment"
          value={process.env.NODE_ENV || 'unknown'}
          valueClassName="capitalize"
        />
      </div>

      <button
        onClick={copySystemInfo}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/20 px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--surface)]/40"
      >
        {copied ? (
          <>
            <Icon
              icon={CheckCircle}
              size="sm"
              className="text-[var(--color-success)]"
              aria-hidden={true}
            />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Icon icon={Copy} size="sm" aria-hidden={true} />
            <span>Copy System Info</span>
          </>
        )}
      </button>

      <div className="flex items-start gap-2 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3">
        <Icon icon={Info} size="sm" className="mt-0.5 text-[var(--primary)]" aria-hidden={true} />
        <p className="text-xs text-[var(--foreground-muted)]">
          Copy this information when contacting support to help us troubleshoot issues faster.
        </p>
      </div>
    </div>
  );
}

function detectSystemInfo() {
  if (typeof navigator === 'undefined') {
    return { browser: 'Unknown', os: 'Unknown', userAgent: '' };
  }
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

  // Detect OS
  if (userAgent.indexOf('Win') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

  return { browser, os, userAgent };
}

function InfoRow({
  label,
  value,
  valueClassName = '',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/20 p-4">
      <div>
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
        <p className={`text-sm font-medium text-[var(--foreground)] ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
