'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center bg-[#0a0a0a] p-6 text-white">
          <h1 className="mb-4 text-4xl font-extrabold">500 — Walk-In Broke Down</h1>
          <p className="mb-6 text-center text-gray-300">
            The entire system crashed harder than when the walk-in dies on a Friday. We're in the
            cold room having a moment. Brb.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-5 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              Call the tech
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            It's fine. Everything's fine. Deep breaths. 🍳
          </p>
        </main>
      </body>
    </html>
  );
}
