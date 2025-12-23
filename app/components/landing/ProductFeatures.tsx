'use client';

import Image from 'next/image';

export default function ProductFeatures() {
  const features = [
    {
      name: 'Dashboard',
      description: 'See your kitchen at a glance',
      screenshot: '/images/dashboard-screenshot.png',
      alt: 'PrepFlow Dashboard showing kitchen overview',
      color: '#29E7CD',
    },
    {
      name: 'Recipes',
      description: 'Build recipes with live cost calculations',
      screenshot: '/images/cogs-calculator-screenshot.png',
      alt: 'PrepFlow Recipe management with ingredient costs',
      color: '#3B82F6',
    },
    {
      name: 'Performance Analysis',
      description: "Chef's Kiss, Hidden Gem, Bargain Bucket, Burnt Toast",
      screenshot: '/images/performance-analysis-screenshot.png',
      alt: 'PrepFlow Performance Analysis Dashboard showing KPIs, categorization tables, popularity charts, scatter plot analysis, and profit margin bar charts',
      color: '#D925C7',
    },
    {
      name: 'Temperature Monitoring',
      description: 'QLD-compliant monitoring with smart thresholds',
      screenshot: '/images/temperature-monitoring-screenshot.png',
      alt: 'PrepFlow Temperature Monitoring showing equipment status dashboard with color-coded cards',
      color: '#29E7CD',
    },
    {
      name: 'Ingredients & Stock',
      description: 'Track costs, suppliers, and par levels',
      screenshot: '/images/ingredients-management-screenshot.png',
      alt: 'PrepFlow Ingredients and stock management',
      color: '#3B82F6',
    },
  ];

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 tablet:px-8 desktop:px-10 large-desktop:px-12 py-16 tablet:py-20 desktop:py-24 large-desktop:py-28 xl:px-20 xl:py-32 2xl:px-24"
    >
      <div className="text-center">
        <h2 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
          Everything you need
        </h2>
        <p className="text-fluid-lg mt-4 text-gray-300">
          From ingredients to pricing decisions, all in one place
        </p>
      </div>

      <div className="mt-12 space-y-16 tablet:space-y-18 desktop:space-y-20 large-desktop:space-y-24 xl:space-y-28">
        {features.map((feature, index) => (
          <div
            key={feature.name}
            className="desktop:grid-cols-2 desktop:items-center grid gap-8 tablet:gap-10 desktop:gap-12 large-desktop:gap-14 xl:gap-16"
          >
            {/* Screenshot */}
            <div className={index % 2 === 1 ? 'desktop:order-2' : ''}>
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-2 shadow-xl">
                <Image
                  src={feature.screenshot}
                  alt={feature.alt}
                  width={600}
                  height={400}
                  className="w-full rounded-xl"
                />
              </div>
            </div>

            {/* Description */}
            <div className={index % 2 === 1 ? 'desktop:order-1' : ''}>
              <h3
                className="text-fluid-2xl desktop:text-fluid-3xl font-bold"
                style={{ color: feature.color }}
              >
                {feature.name}
              </h3>
              <p className="text-fluid-lg mt-4 text-gray-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
