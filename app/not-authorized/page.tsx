'use client';

import React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function NotAuthorizedPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-4xl font-extrabold">403 — Not Authorized</h1>
      <p className="mb-6 text-center text-gray-300">
        This kitchen is for staff only. If you are the chef, sign in with the right apron.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => signIn('auth0', { callbackUrl: '/webapp' })}
          className="rounded-2xl bg-[#29E7CD] px-5 py-3 font-semibold text-black hover:bg-[#29E7CD]/90"
        >
          Sign in
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-[#2a2a2a] px-5 py-3 font-semibold hover:bg-[#2a2a2a]/40"
        >
          Back to landing
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">No worries—happens to the best of us. 🍳</p>
    </main>
  );
}
