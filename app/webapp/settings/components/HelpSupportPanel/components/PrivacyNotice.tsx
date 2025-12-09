import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useState } from 'react';

/**
 * Privacy notice component (collapsible)
 */
export function PrivacyNotice() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  return (
    <div className="border-t border-[#2a2a2a] pt-4">
      <button
        onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Icon icon={Shield} size="sm" className="text-gray-400" aria-hidden={true} />
          <span className="text-sm font-medium text-gray-300">Privacy & Data Collection</span>
        </div>
        <Icon
          icon={showPrivacyNotice ? ChevronUp : ChevronDown}
          size="sm"
          className="text-gray-400"
          aria-hidden={true}
        />
      </button>
      {showPrivacyNotice && (
        <div className="mt-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 text-sm text-gray-400">
          <p className="mb-2 font-medium text-gray-300">What data is collected?</p>
          <ul className="mb-3 ml-4 list-disc space-y-1">
            <li>Error messages and stack traces</li>
            <li>Browser and device information</li>
            <li>Page URL where error occurred</li>
            <li>Timestamp of the error</li>
          </ul>
          <p className="mb-2 font-medium text-gray-300">Why is it collected?</p>
          <p className="mb-3">
            This data helps us identify and fix bugs, improve app stability, and provide better
            support.
          </p>
          <p className="mb-2 font-medium text-gray-300">Your rights</p>
          <p className="mb-3">
            You can request deletion of your data at any time via{' '}
            <Link href="/webapp/settings" className="text-[#29E7CD] hover:underline">
              Settings → Privacy Controls
            </Link>
            . For more information, see our{' '}
            <Link href="/privacy-policy" className="text-[#29E7CD] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
