import React from 'react';

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
        How it works (no spreadsheet acrobatics)
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#29E7CD]/20 text-xl font-bold text-[#29E7CD]">
            1
          </div>
          <h3 className="mb-2 text-xl font-semibold">Add your data</h3>
          <p className="text-gray-300">
            Ingredients, suppliers, recipes. Bring your prices—we do the math.
          </p>
        </div>
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/20 text-xl font-bold text-[#3B82F6]">
            2
          </div>
          <h3 className="mb-2 text-xl font-semibold">Analyze instantly</h3>
          <p className="text-gray-300">
            COGS and contribution margin land immediately. Performance labels follow.
          </p>
        </div>
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D925C7]/20 text-xl font-bold text-[#D925C7]">
            3
          </div>
          <h3 className="mb-2 text-xl font-semibold">Act with confidence</h3>
          <p className="text-gray-300">
            Raise a price, trim a portion, retire the burnt toast. Margins thank you.
          </p>
        </div>
      </div>
    </section>
  );
}
