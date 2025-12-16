'use client';

import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, Globe, Lock, Shield, Check } from 'lucide-react';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function ControlPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="desktop:p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="desktop:grid-cols-2 grid items-center gap-12">
          <div>
            <h3 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
              Get Your Menu Clarity Tool
            </h3>
            <p className="text-fluid-lg mt-4 text-[var(--foreground-secondary)]">
              Simple, powerful, and designed to give you the insights you need to make better
              decisions.
            </p>

            {/* Refund Policy */}
            <div className="mt-6 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
              <div className="text-center">
                <h4 className="text-fluid-sm mb-2 font-semibold text-[var(--primary)]">
                  Our Refund Policy
                </h4>
                <p className="text-fluid-sm leading-relaxed text-[var(--foreground-secondary)]">
                  PrepFlow is a digital product with instant access. That said, we want you to feel
                  confident. If PrepFlow isn&apos;t what you expected, you can request a full refund
                  within 7 days of purchase. No hoops, no hassle — just reply to your purchase email
                  and let us know. After 7 days, all sales are final.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Google Sheet template — ready to use immediately
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">Automated COGS, GP%, GP$ per item</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">
                  Popularity & profit classes (Chef&apos;s Kiss etc.)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">AI Method Generator for cooking optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">Comprehensive setup guide and resources</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span className="text-[var(--foreground-secondary)]">7-day refund policy</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/80 p-8 text-center shadow-lg">
            <p className="text-fluid-4xl mt-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text font-extrabold tracking-tight text-transparent">
              AUD $29
            </p>
            <p className="text-fluid-sm text-[var(--foreground-subtle)]">one-time purchase · Lifetime access</p>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fluid-base mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-8 py-4 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/25"
            >
              Start Now — Get Menu Clarity Today
            </a>
            <p className="text-fluid-sm mt-4 text-[var(--foreground-subtle)]">Secure checkout via Gumroad</p>
            <p className="text-fluid-xs mt-2 text-[var(--foreground-muted)]">
              Not satisfied in 7 days? Full refund.
            </p>
            <p className="text-fluid-xs mt-2 flex items-center justify-center gap-1 text-[var(--primary)]">
              <Icon icon={Globe} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
              Global pricing available in USD, EUR, GBP, AUD
            </p>

            {/* Trust Indicators */}
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <div className="text-fluid-xs flex items-center justify-center gap-4 text-[var(--foreground-muted)]">
                <div className="flex items-center gap-1">
                  <Icon icon={Lock} size="xs" className="text-[var(--color-success)]" aria-hidden={true} />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon={Shield} size="xs" className="text-[var(--color-info)]" aria-hidden={true} />
                  <span>Privacy Focused</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon={Check} size="xs" className="text-[var(--accent)]" aria-hidden={true} />
                  <span>20 years of real kitchen experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
