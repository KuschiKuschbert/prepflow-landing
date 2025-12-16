'use client';

import React from 'react';
import { useErrorMessageSelector } from '@/components/ErrorGame/useErrorMessageSelector';
import { usePathname } from 'next/navigation';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const pathname = usePathname();
  const ErrorComponent = useErrorMessageSelector();

  if (
    pathname &&
    (pathname.startsWith('/api/auth') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/auth'))
  ) {
    return (
      <html>
        <body />
      </html>
    );
  }
  return (
    <html>
      <body>
        <ErrorComponent />
      </body>
    </html>
  );
}
