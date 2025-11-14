'use client';

import React from 'react';

export default function Resources() {
  const [tourOpen, setTourOpen] = React.useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">Trust & Security</h2>
          <p className="mt-4 text-gray-300">Your recipes are safe, your margins are secure</p>
        </div>

        <div className="mt-8 grid gap-6 desktop:grid-cols-3">
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-fluid-lg font-semibold text-[#29E7CD]">Secure sign‑in</h3>
            <p className="text-gray-300">Trusted provider, no shared passwords, clean sign‑out.</p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-fluid-lg font-semibold text-[#3B82F6]">Safe storage</h3>
            <p className="text-gray-300">
              Reliable database, protected access, and regular backups.
            </p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-fluid-lg font-semibold text-[#D925C7]">Privacy first</h3>
            <p className="text-gray-300">
              No unnecessary tracking. Export or delete your data anytime.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-4 text-center text-fluid-xl font-semibold text-white">Need help?</h3>
          <p className="mb-6 text-center text-gray-300">
            No question too small, no kitchen too big. We're here to help.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:hello@prepflow.org"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all hover:opacity-90"
            >
              Contact Support
            </a>
          </div>
        </div>

        <ul className="mx-auto mt-8 grid max-w-3xl list-inside list-disc gap-2 text-fluid-sm text-gray-400">
          <li>Secure by default (HTTPS)</li>
          <li>Only approved accounts can access admin areas</li>
          <li>Sensitive keys are stored safely, never in code</li>
          <li>QLD-compliant temperature monitoring built-in</li>
        </ul>
      </div>
    </section>
  );
}
