/**
 * Quota Warning Component
 * Displays Gemini quota status warnings
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface QuotaWarningProps {
  geminiQuota: {
    available: boolean;
    error?: string;
    quotaInfo?: string;
  };
}

export function QuotaWarning({ geminiQuota }: QuotaWarningProps) {
  if (geminiQuota.available) {
    return null;
  }

  const isAutoFallback = geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash');
  const IconComponent = isAutoFallback ? AlertCircle : AlertTriangle;
  const iconColor = isAutoFallback ? 'text-yellow-400' : 'text-red-400';
  const borderColor = isAutoFallback
    ? 'border-yellow-500/50 bg-yellow-500/10'
    : 'border-red-500/50 bg-red-500/10';
  const textColor = isAutoFallback ? 'text-yellow-400' : 'text-red-400';
  const title = isAutoFallback
    ? 'Daily Limit Reached - Auto Fallback Active'
    : 'Gemini API Quota Exceeded';

  return (
    <div className={`rounded-2xl border p-4 shadow-lg ${borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon
          icon={IconComponent}
          size="md"
          className={`mt-0.5 flex-shrink-0 ${iconColor}`}
          aria-hidden={true}
        />
        <div className="flex-1">
          <h4 className={`mb-1 font-semibold ${textColor}`}>{title}</h4>
          <p className="mb-2 text-sm text-[var(--foreground-muted)]">
            {geminiQuota.quotaInfo || geminiQuota.error || 'Gemini API quota is not available'}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="https://ai.dev/usage?tab=rate-limit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#29E7CD] hover:underline"
            >
              Check Usage →
            </a>
            <span className="text-[var(--foreground-muted)]">•</span>
            <a
              href="https://ai.google.dev/gemini-api/docs/rate-limits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#29E7CD] hover:underline"
            >
              Rate Limits Docs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
