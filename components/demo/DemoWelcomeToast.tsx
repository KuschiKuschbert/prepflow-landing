'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

const DEMO_EMAIL = 'demo@prepflow.org';

export function DemoWelcomeToast() {
  const { user } = useUser();

  useEffect(() => {
    if (user?.email === DEMO_EMAIL) {
      // Small delay to ensure it pops up after initial load
      const timer = setTimeout(() => {
        toast('Welcome to the Demo! 🍽️', {
          description: 'Your test kitchen is freshly plated up and ready for service.',
          duration: 6000,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return null;
}
