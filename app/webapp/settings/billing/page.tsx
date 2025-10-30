'use client';

import React from 'react';

export default function BillingSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Billing</h1>
      <p className="text-gray-300">Subscriptions will be available soon.</p>
      <div className="mt-6 flex gap-3">
        <button
          className="rounded-2xl bg-[#29E7CD] px-4 py-2 text-black disabled:opacity-50"
          disabled
        >
          Subscribe / Change plan
        </button>
        <button
          className="rounded-2xl border border-[#2a2a2a] px-4 py-2 disabled:opacity-50"
          disabled
        >
          Manage billing
        </button>
      </div>
    </div>
  );
}
