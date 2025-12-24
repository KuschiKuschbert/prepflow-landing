'use client';

/**
 * Hook for selecting which error message to display
 * Alternates between kitchen fire and train off track messages
 */

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { logger } from '@/lib/logger';

// Dynamically import error components to reduce initial bundle size
const KitchenOnFire = dynamic(() => import('./KitchenOnFire'), {
  ssr: false,
});

const TrainOffTrack = dynamic(() => import('./TrainOffTrack'), {
  ssr: false,
});

type ErrorMessageType = 'kitchen-fire' | 'train-off-track';

/**
 * Selects which error message component to display
 * Alternates between kitchen fire and train off track
 */
export const useErrorMessageSelector = () => {
  const selectedMessage = useMemo<ErrorMessageType>(() => {
    if (typeof window === 'undefined') {
      // Server-side: default to kitchen fire
      return 'kitchen-fire';
    }

    try {
      const lastMessage = localStorage.getItem('PF_LAST_ERROR_MESSAGE') as ErrorMessageType | null;

      if (!lastMessage || (lastMessage !== 'kitchen-fire' && lastMessage !== 'train-off-track')) {
        // No previous message or invalid value: randomly select
        const random = Math.random();
        const newMessage: ErrorMessageType = random < 0.5 ? 'kitchen-fire' : 'train-off-track';
        localStorage.setItem('PF_LAST_ERROR_MESSAGE', newMessage);
        return newMessage;
      }

      // Toggle to the other message
      const newMessage: ErrorMessageType =
        lastMessage === 'kitchen-fire' ? 'train-off-track' : 'kitchen-fire';
      localStorage.setItem('PF_LAST_ERROR_MESSAGE', newMessage);
      return newMessage;
    } catch (error) {
      logger.error('[useErrorMessageSelector.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // If localStorage fails, default to kitchen fire
      return 'kitchen-fire';
    }
  }, []);

  const ErrorComponent = useMemo(() => {
    return selectedMessage === 'kitchen-fire' ? KitchenOnFire : TrainOffTrack;
  }, [selectedMessage]);

  return ErrorComponent;
};
