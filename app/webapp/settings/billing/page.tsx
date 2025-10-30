'use client';

import React from 'react';

export default function BillingSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Billing</h1>
      <p className="text-gray-300">
        Manage your subscription. Choose a plan and open the billing portal.
      </p>
      <div className="mt-6 flex gap-3">
        <form method="post" action="/api/billing/create-checkout-session">
          <input type="hidden" name="tier" value="starter" />
          <button className="rounded-2xl bg-[#29E7CD] px-4 py-2 text-black">
            Subscribe / Change plan (Starter)
          </button>
        </form>
        <form method="post" action="/api/billing/create-portal-session">
          <button className="rounded-2xl border border-[#2a2a2a] px-4 py-2">Manage billing</button>
        </form>
      </div>
    </div>
  );
}
