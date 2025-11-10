'use client';

import { ReactNode } from 'react';

interface GadgetsCardProps {
  children: ReactNode;
}

export function GadgetsCard({ children }: GadgetsCardProps) {
  return (
    <div className="gadgets-card-container mx-auto w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg sm:rounded-3xl">
      <div className="flex h-full w-full flex-col overflow-hidden">{children}</div>
    </div>
  );
}
