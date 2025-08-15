'use client';

import { SignInModal } from '@memberstack/react';

export default function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Use the Memberstack sign-in modal below
          </p>
        </div>

        <SignInModal />
      </div>
    </div>
  );
}
