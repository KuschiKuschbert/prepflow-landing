'use client';

import { Icon } from '@/components/ui/Icon';
import { FileText, Shield, Cookie, Lock } from 'lucide-react';
import Link from 'next/link';

/**
 * Legal and compliance panel component for settings page.
 * Provides links to legal documents and compliance information.
 *
 * @component
 * @returns {JSX.Element} Legal and compliance panel
 */
export function LegalCompliancePanel() {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Legal & Compliance</h2>
        <p className="mt-1 text-sm text-gray-300">
          Access legal documents and manage your data rights.
        </p>
      </div>

      {/* Legal Documents */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Legal Documents</h3>
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
          <Link
            href="/terms-of-service"
            className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
          >
            <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            <div>
              <p className="font-medium text-white">Terms of Service</p>
              <p className="text-xs text-gray-400">Read our terms and conditions</p>
            </div>
          </Link>

          <Link
            href="/privacy-policy"
            className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
          >
            <Icon icon={Shield} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            <div>
              <p className="font-medium text-white">Privacy Policy</p>
              <p className="text-xs text-gray-400">How we handle your data</p>
            </div>
          </Link>
        </div>
      </div>

      {/* GDPR & Data Rights */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Your Data Rights</h3>
        <p className="text-sm text-gray-400">
          Under GDPR and other privacy laws, you have the right to access, export, and delete your
          data at any time.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon icon={Lock} size="sm" aria-hidden={true} />
          <span>Your data is encrypted and stored securely</span>
        </div>
      </div>
    </div>
  );
}



