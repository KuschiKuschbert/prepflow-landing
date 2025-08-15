'use client';

import { useMember, ProfileModal } from '@memberstack/react';

export default function UserProfile() {
  const { member } = useMember();

  if (!member) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm text-gray-300">{member.auth.email}</p>
        <p className="text-xs text-gray-500">Member</p>
      </div>
      
      <ProfileModal />
    </div>
  );
}
