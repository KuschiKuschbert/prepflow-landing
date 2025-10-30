import React from 'react';

export default function Security() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 backdrop-blur-sm">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Trust & Security
        </h2>
        <p className="mx-auto max-w-3xl text-center text-gray-300">
          Sign in with Auth0. Data stored in Supabase. We respect privacy and keep things simple—no
          hype, just secure access and clear control.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#29E7CD]">Auth0 Sign‑In</h3>
            <p className="text-gray-300">Reliable authentication with industry standards.</p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#3B82F6]">Supabase Storage</h3>
            <p className="text-gray-300">Managed Postgres with strong security defaults.</p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#D925C7]">Privacy First</h3>
            <p className="text-gray-300">Minimal data collection; you own your information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
