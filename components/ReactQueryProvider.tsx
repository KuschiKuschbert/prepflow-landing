'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools disabled */}
    </QueryClientProvider>
  );
}
