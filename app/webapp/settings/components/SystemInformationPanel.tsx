'use client';

import { Icon } from '@/components/ui/Icon';
import { Copy, CheckCircle, Info } from 'lucide-react';
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

    setSystemInfo({
      appVersion: '0.1.1', // From package.json
      browser,
      os,
      userAgent,
    });
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
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">System Information</h2>
        <p className="mt-1 text-sm text-gray-300">
          Technical details for support and troubleshooting.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div>
            <p className="text-xs text-gray-500">App Version</p>
            <p className="text-sm font-medium text-white">{systemInfo.appVersion}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div>
            <p className="text-xs text-gray-500">Browser</p>
            <p className="text-sm font-medium text-white">{systemInfo.browser}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div>
            <p className="text-xs text-gray-500">Operating System</p>
            <p className="text-sm font-medium text-white">{systemInfo.os}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div>
            <p className="text-xs text-gray-500">Environment</p>
            <p className="text-sm font-medium text-white capitalize">
              {process.env.NODE_ENV || 'unknown'}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={copySystemInfo}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40"
      >
        {copied ? (
          <>
            <Icon icon={CheckCircle} size="sm" className="text-green-400" aria-hidden={true} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Icon icon={Copy} size="sm" aria-hidden={true} />
            <span>Copy System Info</span>
          </>
        )}
      </button>

      <div className="flex items-start gap-2 rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3">
        <Icon icon={Info} size="sm" className="text-[#29E7CD] mt-0.5" aria-hidden={true} />
        <p className="text-xs text-gray-400">
          Copy this information when contacting support to help us troubleshoot issues faster.
        </p>
      </div>
    </div>
  );
}

