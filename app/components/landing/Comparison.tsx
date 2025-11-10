'use client';

export default function Comparison() {
  const comparisons = [
    {
      title: 'vs Spreadsheets',
      benefit: 'No formula errors, automatic updates',
      description:
        'Stop fighting with Excel at 2 AM. PrepFlow calculates everything automatically and updates in real-time.',
      color: '#29E7CD',
      icon: '📊',
    },
    {
      title: 'vs Manual Methods',
      benefit: 'Save hours every week',
      description: 'From hours of calculations to minutes. Focus on cooking, not spreadsheets.',
      color: '#3B82F6',
      icon: '⏱️',
    },
    {
      title: 'vs Generic Tools',
      benefit: 'Built for kitchens, not offices',
      description:
        'Designed specifically for restaurant workflows. QLD-compliant temperature monitoring, kitchen-focused features.',
      color: '#D925C7',
      icon: '🍳',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why PrepFlow?</h2>
        <p className="mt-4 text-lg text-gray-300">Built for kitchens, not spreadsheets</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {comparisons.map(comparison => (
          <div
            key={comparison.title}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6 transition-all hover:border-[#2a2a2a]/60 hover:bg-[#1f1f1f]/70"
          >
            <div className="mb-4 text-4xl">{comparison.icon}</div>
            <h3 className="mb-2 text-xl font-semibold" style={{ color: comparison.color }}>
              {comparison.title}
            </h3>
            <p className="mb-3 font-medium text-white">{comparison.benefit}</p>
            <p className="text-sm text-gray-400">{comparison.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
