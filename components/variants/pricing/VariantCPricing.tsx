'use client';

import { Icon } from '@/components/ui/Icon';
import { BarChart3, Calculator, Globe, Bot } from 'lucide-react';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantCPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="desktop:p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="desktop:grid-cols-2 grid items-center gap-12">
          <div>
            <h3 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
              Everything You Need
            </h3>
            <p className="text-fluid-lg mt-4 text-[var(--foreground-secondary)]">
              One comprehensive tool for complete menu profitability analysis.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/20">
                  <Icon icon={BarChart3} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Complete Dashboard</h4>
                  <p className="text-fluid-sm text-[var(--foreground-muted)]">
                    COGS, GP%, profit analysis, and performance metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/20">
                  <Icon icon={Calculator} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Recipe Builder</h4>
                  <p className="text-fluid-sm text-[var(--foreground-muted)]">
                    Automated calculations with yield and waste tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/20">
                  <Icon icon={Globe} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">GST Ready</h4>
                  <p className="text-fluid-sm text-[var(--foreground-muted)]">
                    Australian tax compliance and multi-currency support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/20">
                  <Icon icon={Bot} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">AI Insights</h4>
                  <p className="text-fluid-sm text-[var(--foreground-muted)]">
                    Smart suggestions for margin improvement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/80 p-8 text-center">
            <p className="text-fluid-4xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text font-extrabold tracking-tight text-transparent">
              AUD $29
            </p>
            <p className="text-fluid-sm mb-6 text-[var(--foreground-subtle)]">One-time purchase · Lifetime access</p>

            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fluid-base inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/25"
            >
              Get Complete Access
            </a>

            <div className="mt-6 text-center">
              <p className="text-fluid-sm text-[var(--foreground-subtle)]">7-day refund policy</p>
              <p className="text-fluid-xs mt-2 text-[var(--foreground-muted)]">Secure checkout via Gumroad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
