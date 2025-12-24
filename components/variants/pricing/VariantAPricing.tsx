'use client';

import { Icon } from '@/components/ui/Icon';
import { Check, Globe } from 'lucide-react';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantAPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="desktop:p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="mb-12 text-center">
          <h3 className="text-fluid-3xl desktop:text-fluid-4xl mb-4 font-bold tracking-tight">
            Simple Pricing, Maximum Value
          </h3>
          <p className="text-fluid-lg text-[var(--foreground-secondary)]">
            One tool. One price. Everything you need to optimize your menu profitability.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--primary)]/10 p-8 text-center shadow-lg">
            <div className="mb-6">
              <p className="text-fluid-4xl bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] bg-clip-text font-extrabold tracking-tight text-transparent">
                AUD $29
              </p>
              <p className="text-fluid-lg mt-2 text-[var(--foreground-secondary)]">
                One-time purchase
              </p>
              <p className="text-fluid-sm text-[var(--foreground-subtle)]">
                Lifetime access · No recurring fees
              </p>
            </div>

            <div className="mb-8 grid gap-4 text-left">
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Complete Google Sheets template
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Automated COGS calculations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Profit analysis & menu optimization
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  GST-ready for Australian businesses
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  AI-powered cooking insights
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={Check} size="lg" className="text-[var(--accent)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Setup guide & support resources
                </span>
              </div>
            </div>

            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fluid-base inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] px-8 py-4 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-[var(--accent)]/25 hover:shadow-xl"
            >
              Get PrepFlow Now
            </a>

            <div className="mt-6 text-center">
              <p className="text-fluid-sm text-[var(--foreground-subtle)]">
                7-day refund policy · Secure checkout via Gumroad
              </p>
              <p className="text-fluid-xs mt-2 flex items-center justify-center gap-1 text-[var(--foreground-muted)]">
                <Icon
                  icon={Globe}
                  size="xs"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
                Available in USD, EUR, GBP, AUD
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
