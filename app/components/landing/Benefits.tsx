import React from 'react';

export default function Benefits() {
  const items = [
    {
      title: 'Accuracy',
      color: '#29E7CD',
      desc: 'No guesswork pricing. Every gram and cent accounted for.',
    },
    {
      title: 'Speed',
      color: '#3B82F6',
      desc: 'From idea → recipe → margin in minutes, not meetings.',
    },
    {
      title: 'Confidence',
      color: '#D925C7',
      desc: "Label dishes Chef's Kiss to Burnt Toast and act with certainty.",
    },
    {
      title: 'Compliance',
      color: '#29E7CD',
      desc: 'QLD-safe temperature rules baked in. Less stress, more service.',
    },
    {
      title: 'Control',
      color: '#3B82F6',
      desc: 'Suppliers, order lists, par levels: your kitchen, organised.',
    },
    {
      title: 'Scale',
      color: '#D925C7',
      desc: 'Standardise recipes and margins so growth doesn’t get messy.',
    },
  ];

  return (
    <section id="benefits" className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
        What all the features add up to
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-300">
        PrepFlow groups a lot of kitchen tooling into a few outcomes: price right, move fast, stay
        compliant, and keep margins smiling.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map(item => (
          <div key={item.title} className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-2 text-xl font-semibold" style={{ color: item.color }}>
              {item.title}
            </h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
