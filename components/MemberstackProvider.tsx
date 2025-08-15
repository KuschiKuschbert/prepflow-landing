'use client';

import { MemberstackProvider as MSProvider } from '@memberstack/react';
import { memberstackConfig } from '../lib/memberstack';

interface MemberstackProviderProps {
  children: React.ReactNode;
}

export default function MemberstackProvider({ children }: MemberstackProviderProps) {
  return (
    <MSProvider config={memberstackConfig}>
      {children}
    </MSProvider>
  );
}
