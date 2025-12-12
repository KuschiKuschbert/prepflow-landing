'use client';

import React from 'react';
import Link from 'next/link';

export default function NotAuthorizedPage() {
  const handleLogout = async () => {
    // Logout via Auth0 SDK - redirects to Auth0 logout then back to home
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleSignIn = async () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  const handleCreateAccount = async () => {
    // Redirect to Auth0 login (Auth0 handles signup flow)
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-4xl font-extrabold">403 — Not Authorized</h1>
      <p className="mb-6 text-center text-gray-300">
        This kitchen is for staff only. Need to sign in or create a new account? Grab your apron and
        let&apos;s get you set up.
      </p>
      <div className="tablet:flex-row tablet:justify-center flex flex-col gap-3">
        <button
          onClick={handleCreateAccount}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-5 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
        >
          Create new account
        </button>
        <button
          onClick={handleSignIn}
          className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-5 py-3 font-semibold hover:bg-[#2a2a2a]/60"
        >
          Sign in
        </button>
        <button
          onClick={handleLogout}
          className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20"
        >
          Logout
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-[#2a2a2a] px-5 py-3 text-center font-semibold hover:bg-[#2a2a2a]/40"
        >
          Back to landing
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Looks like you need to clock in first. Happens to the best of us. 🍳
      </p>
    </main>
  );
}
