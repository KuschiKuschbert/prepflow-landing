'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-4xl font-extrabold">500 — Printer's Holding Dockets</h1>
      <p className="mb-6 text-center text-gray-300">
        The kitchen printer decided to hold onto all the dockets mid-service. Classic move. Give us
        a sec while we sort it out.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-5 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
        >
          Unjam printer
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-[#2a2a2a] px-5 py-3 font-semibold hover:bg-[#2a2a2a]/40"
        >
          Back to home
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        At least it's not during the Saturday night rush. 🍳
      </p>
    </main>
  );
}
