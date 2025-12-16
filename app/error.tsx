'use client';

import React from 'react';
import { useErrorMessageSelector } from '@/components/ErrorGame/useErrorMessageSelector';
import { usePathname } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const pathname = usePathname();
  const ErrorComponent = useErrorMessageSelector();

  if (
    pathname &&
    (pathname.startsWith('/api/auth') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/auth'))
  ) {
    return null;
  }
  return <ErrorComponent />;
}
