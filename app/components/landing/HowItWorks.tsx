import React from 'react';

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
        From pantry to profit in three steps
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#29E7CD]/20 text-xl font-bold text-[#29E7CD]">
            1
          </div>
          <h3 className="mb-2 text-xl font-semibold">Add your data</h3>
          <p className="text-gray-300">
            Ingredients, suppliers, recipes. You bring prices; we cook the math.
          </p>
        </div>
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/20 text-xl font-bold text-[#3B82F6]">
            2
          </div>
          <h3 className="mb-2 text-xl font-semibold">Analyze instantly</h3>
          <p className="text-gray-300">
            COGS and margin appear instantly. Performance labels do the talking.
          </p>
        </div>
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D925C7]/20 text-xl font-bold text-[#D925C7]">
            3
          </div>
          <h3 className="mb-2 text-xl font-semibold">Act with confidence</h3>
          <p className="text-gray-300">
            Raise a price, trim a portion, or retire the burnt toast. Margins smile.
          </p>
        </div>
      </div>
    </section>
  );
}
