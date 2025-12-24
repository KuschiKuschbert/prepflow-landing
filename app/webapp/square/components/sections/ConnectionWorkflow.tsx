/**
 * Square Connection Workflow Component
 * Provides workflows for connecting existing Square accounts and creating new ones
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ExternalLink, CheckCircle2, AlertCircle, Info, CreditCard, Shield } from 'lucide-react';

interface ConnectionWorkflowProps {
  onConnectClick: () => void;
}

export function ConnectionWorkflow({ onConnectClick }: ConnectionWorkflowProps) {
  const [showDisclaimers, setShowDisclaimers] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Connect Square POS</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Connect your Square POS system to sync menu items, staff, sales data, and food costs
        </p>
      </div>

      {/* External Tool Disclaimer */}
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[#29E7CD]/10 via-[#D925C7]/10 via-[#FF6B00]/10 to-[#29E7CD]/10 p-6">
        <div className="flex items-start gap-4">
          <Icon icon={Shield} size="lg" className="mt-0.5 text-[var(--primary)]" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              External Service Notice
            </h3>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Square is a third-party payment processing and POS system. PrepFlow integrates with
              Square to sync your data, but Square operates independently and may charge fees for
              their services. We recommend reviewing Square&apos;s pricing and terms before
              connecting.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Options */}
      <div className="tablet:grid-cols-2 grid gap-6">
        {/* Connect Existing Square Account */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
              <Icon icon={CheckCircle2} size="lg" className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                I Have a Square Account
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Connect your existing Square POS account to sync data between Square and PrepFlow.
              </p>
              <button
                onClick={onConnectClick}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Connect with Square
              </button>
            </div>
          </div>
        </div>

        {/* Create New Square Account */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
              <Icon icon={CreditCard} size="lg" className="text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                I Need a Square Account
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Create a new Square account to start accepting payments and managing your POS
                system.
              </p>
              <a
                href="https://squareup.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-6 py-3 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
              >
                Create Square Account
                <Icon icon={ExternalLink} size="sm" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fees Disclaimer */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
        <div className="flex items-start gap-4">
          <Icon icon={AlertCircle} size="lg" className="mt-0.5 text-yellow-400" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-400">Important: Square Fees</h3>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Square charges fees for payment processing and other services. These fees are separate
              from PrepFlow subscription fees. Please review Square&apos;s pricing at{' '}
              <a
                href="https://squareup.com/us/en/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] underline hover:text-[var(--accent)]"
              >
                squareup.com/pricing
              </a>{' '}
              before connecting your account.
            </p>
            <button
              onClick={() => setShowDisclaimers(!showDisclaimers)}
              className="mt-4 text-sm font-medium text-yellow-400 underline hover:text-yellow-300"
            >
              {showDisclaimers ? 'Hide' : 'Show'} More Information
            </button>
            {showDisclaimers && (
              <div className="mt-4 space-y-3 rounded-xl border border-yellow-500/20 bg-[var(--background)] p-4">
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">
                    Square Payment Processing Fees:
                  </h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--foreground-muted)]">
                    <li>In-person payments: Typically 2.6% + $0.10 per transaction</li>
                    <li>Online payments: Typically 2.9% + $0.30 per transaction</li>
                    <li>Keyed-in payments: Typically 3.5% + $0.15 per transaction</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Other Square Services:</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--foreground-muted)]">
                    <li>Square POS hardware: One-time purchase or monthly rental</li>
                    <li>Square Team: Employee management features (may have fees)</li>
                    <li>Square Marketing: Email marketing tools (may have fees)</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    <strong>Note:</strong> Fees are subject to change. Always check Square&apos;s
                    official pricing page for the most current information. PrepFlow doesn&apos;t
                    charge any additional fees for Square integration - you only pay your PrepFlow
                    subscription and Square&apos;s fees directly to Square.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start gap-4">
          <Icon icon={Info} size="lg" className="mt-0.5 text-[var(--primary)]" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">How It Works</h3>
            <ol className="mt-4 space-y-3 text-sm text-[var(--foreground-muted)]">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-semibold text-[var(--primary)]">
                  1
                </span>
                <span>
                  Click &quot;Connect with Square&quot; - you&apos;ll be redirected to Square&apos;s
                  website to login with your Square account
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-semibold text-[var(--primary)]">
                  2
                </span>
                <span>
                  Authorize PrepFlow to access your Square account - PrepFlow will automatically
                  retrieve and store your access token (no manual credential entry needed)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-semibold text-[var(--primary)]">
                  3
                </span>
                <span>
                  Configure sync preferences to choose what data syncs between Square and PrepFlow
                  (menu items, staff, sales data, food costs)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-semibold text-[var(--primary)]">
                  4
                </span>
                <span>
                  Data syncs automatically in the background, keeping your Square POS and PrepFlow
                  data in sync. Your access token refreshes automatically when needed - no manual
                  updates required.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
