'use client';

import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Add ingredients',
      description: 'Add ingredients with costs and suppliers. Enter your current prices.',
      example: "Add 'Tomatoes' at $2.50/kg",
      color: '#29E7CD',
    },
    {
      number: 2,
      title: 'Create recipes',
      description:
        'Build recipes with portions and yields. PrepFlow calculates costs automatically.',
      example: "Create 'Margherita Pizza' recipe",
      color: '#3B82F6',
    },
    {
      number: 3,
      title: 'See COGS & performance',
      description:
        "View dish COGS and contribution margin instantly. Classify as Chef's Kiss, Hidden Gem, Bargain Bucket, or Burnt Toast.",
      example: 'See $4.20 COGS → Classify as "Chef\'s Kiss" → Price at $18.00',
      color: '#D925C7',
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">How it works</h2>
        <p className="mt-4 text-fluid-lg text-gray-300">From idea to menu in minutes, not meetings</p>
      </div>

      <div className="mt-12 grid gap-8 desktop:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector arrow for desktop */}
            {index < steps.length - 1 && (
              <div className="absolute top-14 right-0 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent desktop:block" />
            )}

            <div className="text-center">
              <div
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full text-fluid-xl font-bold"
                style={{
                  backgroundColor: `${step.color}20`,
                  color: step.color,
                }}
              >
                {step.number}
              </div>
              <h3 className="mb-2 text-fluid-xl font-semibold">{step.title}</h3>
              <p className="mb-3 text-gray-300">{step.description}</p>
              <div className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f]/30 p-3">
                <p className="text-fluid-sm text-gray-400">{step.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow summary */}
      <div className="mt-12 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-6">
          <p className="text-fluid-lg font-medium text-white">
            Add ingredients → Create recipes → See COGS & performance
          </p>
          <p className="mt-2 text-fluid-sm text-gray-400">
            That's it. No spreadsheets, no guesswork, no 2 AM formula errors.
          </p>
        </div>
      </div>
    </section>
  );
}
