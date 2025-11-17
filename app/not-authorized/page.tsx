'use client';

import React from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

export default function NotAuthorizedPage() {
  const handleLogout = async () => {
    // Clear NextAuth session first
    await signOut({ redirect: false });

    // Then redirect to our custom logout API which handles Auth0 logout
    // The API will redirect to Auth0 logout endpoint, which clears Auth0 session
    // Auth0 will then redirect back to the landing page
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(window.location.origin + '/')}`;
  };

  const handleSignIn = async () => {
    // Clear NextAuth session
    await signOut({ redirect: false });

    // Sign in with prompt to show login screen
    signIn('auth0', {
      callbackUrl: '/webapp',
      authorizationParams: {
        prompt: 'login',
      },
    });
  };

  const handleCreateAccount = async () => {
    // Clear NextAuth session
    await signOut({ redirect: false });

    // Sign in with signup hint
    signIn('auth0', {
      callbackUrl: '/webapp',
      authorizationParams: {
        prompt: 'login',
        screen_hint: 'signup',
      },
    });
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
          onClick={async e => {
            // Clear NextAuth session when going back to landing
            await signOut({ redirect: false });
          }}
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
