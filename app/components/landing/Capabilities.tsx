import React from 'react';

export default function Capabilities() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
        Core capabilities
      </h2>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-2 text-xl font-semibold text-[#29E7CD]">COGS</h3>
          <p className="text-gray-300">
            Accurate dish costing and contribution margin, always current.
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-2 text-xl font-semibold text-[#3B82F6]">Recipes</h3>
          <p className="text-gray-300">
            Standardised recipes with portions, yields, and live costs.
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-2 text-xl font-semibold text-[#D925C7]">Performance</h3>
          <p className="text-gray-300">
            Clear classification of high performers and underperformers.
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-2 text-xl font-semibold text-[#29E7CD]">Temperature</h3>
          <p className="text-gray-300">
            QLD‑compliant defaults: fridges 0–5°C, hot ≥60°C, freezers −24 to −18°C.
          </p>
        </div>
      </div>
    </section>
  );
}
