import React from 'react';

export default function Security() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 backdrop-blur-sm">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Trust & Security
        </h2>
        <p className="mx-auto max-w-3xl text-center text-gray-300">
          Sign in safely. Your data is stored securely and kept private. We only collect what’s
          needed to run your account.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#29E7CD]">Secure sign‑in</h3>
            <p className="text-gray-300">Trusted provider, no shared passwords, clean sign‑out.</p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#3B82F6]">Safe storage</h3>
            <p className="text-gray-300">
              Reliable database, protected access, and regular backups.
            </p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#D925C7]">Privacy first</h3>
            <p className="text-gray-300">
              No unnecessary tracking. Export or delete your data anytime.
            </p>
          </div>
        </div>
        <ul className="mx-auto mt-8 grid max-w-3xl list-inside list-disc gap-2 text-sm text-gray-400">
          <li>Secure by default (HTTPS)</li>
          <li>Only approved accounts can access admin areas</li>
          <li>Sensitive keys are stored safely, never in code</li>
        </ul>
      </div>
    </section>
  );
}
