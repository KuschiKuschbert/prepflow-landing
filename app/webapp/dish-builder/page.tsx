'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DishBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/webapp/recipes#dishes');
  }, [router]);

  return null;
}
