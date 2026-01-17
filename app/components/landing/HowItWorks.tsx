'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Add ingredients',
      description: 'Add ingredients with costs and suppliers. Enter your current prices.',
      example: "Add 'Tomatoes' at $2.50/kg",
      colorClass: 'text-landing-primary',
      bgClass: 'bg-landing-primary/20',
    },
    {
      number: 2,
      title: 'Create recipes',
      description:
        'Build recipes with portions and yields. PrepFlow calculates costs automatically.',
      example: "Create 'Margherita Pizza' recipe",
      colorClass: 'text-landing-secondary',
      bgClass: 'bg-landing-secondary/20',
    },
    {
      number: 3,
      title: 'See COGS & performance',
      description:
        "View dish COGS and contribution margin instantly. Classify as Chef's Kiss, Hidden Gem, Bargain Bucket, or Burnt Toast.",
      example: 'See $4.20 COGS → Classify as "Chef\'s Kiss" → Price at $18.00',
      colorClass: 'text-landing-accent',
      bgClass: 'bg-landing-accent/20',
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
          How it works
        </h2>
        <p className="text-fluid-lg mt-4 text-gray-300">
          From idea to menu in minutes, not meetings
        </p>
      </div>

      <div className="desktop:grid-cols-3 mt-12 grid gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector arrow for desktop */}
            {index < steps.length - 1 && (
              <div className="desktop:block via-border absolute top-14 right-0 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-transparent to-transparent" />
            )}

            <div className="text-center">
              <div
                className={`text-fluid-xl mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full font-bold ${step.bgClass} ${step.colorClass}`}
              >
                {step.number}
              </div>
              <h3 className="text-fluid-xl mb-2 font-semibold">{step.title}</h3>
              <p className="mb-3 text-gray-300">{step.description}</p>
              <div className="border-border bg-surface/30 rounded-lg border p-3">
                <p className="text-fluid-sm text-gray-400">{step.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow summary */}
      <div className="mt-12 text-center">
        <div className="border-border from-landing-primary/10 to-landing-accent/10 mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br p-6">
          <p className="text-fluid-lg font-medium text-white">
            Add ingredients → Create recipes → See COGS & performance
          </p>
          <p className="text-fluid-sm mt-2 text-gray-400">
            That&apos;s it. No spreadsheets, no guesswork, no 2 AM formula errors.
          </p>
        </div>
      </div>
    </section>
  );
}
