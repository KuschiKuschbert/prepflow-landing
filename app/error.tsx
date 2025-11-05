'use client';

import React from 'react';
import KitchenOnFire from '@/components/ErrorGame/KitchenOnFire';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return <KitchenOnFire />;
}
