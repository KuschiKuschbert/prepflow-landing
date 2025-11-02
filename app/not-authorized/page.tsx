'use client';

import React from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

export default function NotAuthorizedPage() {
  const handleSignIn = async () => {
    // First, logout from Auth0 to clear their session
    // Redirect to logout API which will clear Auth0 session then redirect back
    const returnTo = `${window.location.origin}/not-authorized?action=signin`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleCreateAccount = async () => {
    // First, logout from Auth0 to clear their session
    // Redirect to logout API which will clear Auth0 session then redirect back
    const returnTo = `${window.location.origin}/not-authorized?action=signup`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  // Handle redirect back from logout
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    if (action === 'signin' || action === 'signup') {
      // Small delay to ensure page is ready
      const timer = setTimeout(() => {
        // Clear NextAuth session and sign in
        signOut({ redirect: false }).then(() => {
          const authParams: { prompt: string; screen_hint?: string } = {
            prompt: 'login', // Force fresh login screen
          };

          if (action === 'signup') {
            authParams.screen_hint = 'signup';
          }

          signIn('auth0', {
            callbackUrl: '/webapp',
            authorizationParams: authParams,
          });
        });
        // Clean up URL
        window.history.replaceState({}, '', '/not-authorized');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-4xl font-extrabold">403 — Not Authorized</h1>
      <p className="mb-6 text-center text-gray-300">
        This kitchen is for staff only. Need to sign in or create a new account? Grab your apron and
        let's get you set up.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
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
        <Link
          href="/"
          onClick={async e => {
            // Clear NextAuth session when going back to landing
            await signOut({ redirect: false });
            // Note: We don't redirect to Auth0 logout here to avoid interrupting navigation
            // The select_account prompt on next login will handle account selection
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
