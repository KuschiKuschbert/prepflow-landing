'use client';

interface PricingProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function VariantBPricing({ t: _t, handleEngagement: _handleEngagement }: PricingProps) {
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
          <PricingCard
            title="Other Restaurant Software"
            price="$500+"
            period="per month"
            features={['Complex setup', 'Monthly fees', 'Learning curve', 'Limited customization']}
          />

          <PricingCard
            title="Consultants"
            price="$2,000+"
            period="per project"
            features={[
              'Expensive',
              'One-time analysis',
              'No ongoing support',
              'Limited availability',
            ]}
          />

          <PricingCard
            title="PrepFlow"
            price="AUD $29"
            period="one-time"
            features={['Simple setup', 'No monthly fees', 'Easy to use', 'Lifetime access']}
            isHighlighted
            ctaLink="https://7495573591101.gumroad.com/l/prepflow"
            ctaText="Choose PrepFlow"
          />
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

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isHighlighted?: boolean;
  ctaLink?: string;
  ctaText?: string;
}

function PricingCard({
  title,
  price,
  period,
  features,
  isHighlighted = false,
  ctaLink,
  ctaText,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 text-center ${
        isHighlighted
          ? 'border-[var(--color-info)]/30 bg-gradient-to-br from-[var(--color-info)]/10 to-[var(--primary)]/10'
          : 'border-[var(--border)] bg-[var(--muted)]/80'
      }`}
    >
      <h4
        className={`text-fluid-xl mb-4 font-semibold ${
          isHighlighted ? 'text-[var(--button-active-text)]' : 'text-[var(--foreground-secondary)]'
        }`}
      >
        {title}
      </h4>
      <p
        className={`text-fluid-3xl mb-2 font-bold ${
          isHighlighted ? 'text-[var(--color-info)]' : 'text-[var(--foreground-muted)]'
        }`}
      >
        {price}
      </p>
      <p
        className={`text-fluid-sm mb-4 ${
          isHighlighted ? 'text-[var(--foreground-secondary)]' : 'text-[var(--foreground-subtle)]'
        }`}
      >
        {period}
      </p>
      <ul
        className={`text-fluid-sm space-y-2 text-left ${
          isHighlighted ? 'text-[var(--foreground-secondary)]' : 'text-[var(--foreground-muted)]'
        }`}
      >
        {features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
      {isHighlighted && ctaLink && ctaText && (
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fluid-sm mt-6 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[var(--color-info)] to-[var(--primary)] px-6 py-3 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-[var(--color-info)]/25 hover:shadow-xl"
        >
          {ctaText}
        </a>
      )}
    </div>
  );
}
