'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LogoutButton } from '../LogoutButton';

interface DrawerFooterProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function DrawerFooter({ userName, userEmail }: DrawerFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-[#2a2a2a]/20 bg-[#1f1f1f]/80 px-3 py-2 backdrop-blur-sm">
      {userName && (
        <div className="mb-2 rounded-lg bg-[#2a2a2a]/15 px-2 py-1.5">
          <div className="text-[10px] text-gray-500">Logged in as</div>
          <div className="text-xs font-medium text-white/90" title={userEmail || 'Logged in user'}>
            {userName}
          </div>
        </div>
      )}
      <div className="mb-1.5 text-[10px] tracking-wider text-gray-500 uppercase">Settings</div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">Language</span>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">Account</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
