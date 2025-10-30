import React from 'react';

export default function Security() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 backdrop-blur-sm">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Trust & Security
        </h2>
        <p className="mx-auto max-w-3xl text-center text-gray-300">
          Auth0 for sign‑in (OAuth2/OIDC). Supabase Postgres with Row‑Level Security. TLS
          everywhere. Minimal data collected. No fluff.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#29E7CD]">Auth0 Sign‑In</h3>
            <p className="text-gray-300">OAuth2/OIDC, SSO ready. Sessions handled by NextAuth.</p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#3B82F6]">Supabase Storage</h3>
            <p className="text-gray-300">
              Postgres + Row‑Level Security. Daily backups. Audited access.
            </p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#D925C7]">Privacy First</h3>
            <p className="text-gray-300">
              No unnecessary trackers. Export/delete on request. You own your data.
            </p>
          </div>
        </div>
        <ul className="mx-auto mt-8 grid max-w-3xl list-inside list-disc gap-2 text-sm text-gray-400">
          <li>TLS (HTTPS) enforced</li>
          <li>JWT sessions; email allowlist for admin routes</li>
          <li>Secrets stored in Vercel, not in code</li>
        </ul>
      </div>
    </section>
  );
}
