'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantBPricing({ t, handleEngagement }: PricingProps) {
  return (
    <section id="pricing" className="py-20">
      <div className="desktop:p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="mb-12 text-center">
          <h3 className="text-fluid-3xl desktop:text-fluid-4xl mb-4 font-bold tracking-tight">
            Why Choose PrepFlow?
          </h3>
          <p className="text-fluid-lg text-[var(--foreground-secondary)]">
            Compare the cost and value of different solutions
          </p>
        </div>

        <div className="desktop:grid-cols-3 grid gap-8">
          {/* Other Solutions */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/80 p-6 text-center">
            <h4 className="text-fluid-xl mb-4 font-semibold text-[var(--foreground-secondary)]">
              Other Restaurant Software
            </h4>
            <p className="text-fluid-3xl mb-2 font-bold text-[var(--foreground-muted)]">$500+</p>
            <p className="text-fluid-sm mb-4 text-[var(--foreground-subtle)]">per month</p>
            <ul className="text-fluid-sm space-y-2 text-left text-[var(--foreground-muted)]">
              <li>• Complex setup</li>
              <li>• Monthly fees</li>
              <li>• Learning curve</li>
              <li>• Limited customization</li>
            </ul>
          </div>

          {/* Consultants */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/80 p-6 text-center">
            <h4 className="text-fluid-xl mb-4 font-semibold text-[var(--foreground-secondary)]">
              Consultants
            </h4>
            <p className="text-fluid-3xl mb-2 font-bold text-[var(--foreground-muted)]">$2,000+</p>
            <p className="text-fluid-sm mb-4 text-[var(--foreground-subtle)]">per project</p>
            <ul className="text-fluid-sm space-y-2 text-left text-[var(--foreground-muted)]">
              <li>• Expensive</li>
              <li>• One-time analysis</li>
              <li>• No ongoing support</li>
              <li>• Limited availability</li>
            </ul>
          </div>

          {/* PrepFlow */}
          <div className="rounded-2xl border border-[var(--color-info)]/30 bg-gradient-to-br from-[var(--color-info)]/10 to-[var(--primary)]/10 p-6 text-center">
            <h4 className="text-fluid-xl mb-4 font-semibold text-[var(--button-active-text)]">
              PrepFlow
            </h4>
            <p className="text-fluid-3xl mb-2 font-bold text-[var(--color-info)]">AUD $29</p>
            <p className="text-fluid-sm mb-4 text-[var(--foreground-secondary)]">one-time</p>
            <ul className="text-fluid-sm space-y-2 text-left text-[var(--foreground-secondary)]">
              <li>• Simple setup</li>
              <li>• No monthly fees</li>
              <li>• Easy to use</li>
              <li>• Lifetime access</li>
            </ul>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fluid-sm mt-6 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[var(--color-info)] to-[var(--primary)] px-6 py-3 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-[var(--color-info)]/25 hover:shadow-xl"
            >
              Choose PrepFlow
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-fluid-sm text-[var(--foreground-muted)]">
            7-day refund policy · Secure checkout · 20 years of kitchen experience
          </p>
        </div>
      </div>
    </section>
  );
}
