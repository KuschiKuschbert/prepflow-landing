'use client';

import { SignUpModal } from '@memberstack/react';

export default function SignupForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Use the Memberstack sign-up modal below
          </p>
        </div>

        <SignUpModal />
      </div>
    </div>
  );
}
