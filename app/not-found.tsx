'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-4xl font-extrabold">404 — Page Not Found</h1>
      <p className="mb-6 text-center text-gray-300">
        You walked into the cold room and forgot what you came here for. Happens to the best of us.
        Let's get you back to the kitchen.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-5 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
        >
          Back to home
        </Link>
        <Link
          href="/webapp"
          className="rounded-2xl border border-[#2a2a2a] px-5 py-3 font-semibold hover:bg-[#2a2a2a]/40"
        >
          Go to dashboard
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Pro tip: write it down before you open that door. 🍳
      </p>
    </main>
  );
}
