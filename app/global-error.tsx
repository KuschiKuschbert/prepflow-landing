'use client';

import React from 'react';
import KitchenOnFire from '@/components/ErrorGame/KitchenOnFire';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <KitchenOnFire />
      </body>
    </html>
  );
}
