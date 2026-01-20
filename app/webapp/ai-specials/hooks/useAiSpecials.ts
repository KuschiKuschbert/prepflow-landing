'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import type { AISpecial } from '../components/SpecialsGrid';

export function useAiSpecials() {
  const { showSuccess, showError } = useNotification();
  const { user, isLoading: userLoading } = useUser();
  const userEmail = user?.email || null;
  const isAuthenticated = !userLoading && (!!user || !!userEmail);

  const [aiSpecials, setAiSpecials] = useState<AISpecial[]>(
    () => getCachedData('ai_specials') || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      prefetchApi('/api/ai-specials');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      try {
        await fetchAISpecials();
      } catch (err) {
        logger.error('[useAiSpecials] Error in useEffect:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchAISpecials = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view AI specials');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-specials');
      const result = (await response.json()) as {
        success: boolean;
        data: AISpecial[];
        message?: string;
      };
      if (result.success) {
        setAiSpecials(result.data);
        cacheData('ai_specials', result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch AI specials');
      }
    } catch (err) {
      logger.error('[useAiSpecials] Error fetching AI specials:', {
        error: err instanceof Error ? err.message : String(err),
        userEmail,
      });
      setError('Failed to fetch AI specials');
    } finally {
      setLoading(false);
    }
  };

  const submitSpecial = async (file: File, prompt: string) => {
    if (!isAuthenticated) {
      showError('Please log in to submit AI specials');
      return;
    }

    const originalSpecials = [...aiSpecials];
    const tempId = `temp-${Date.now()}`;
    const tempSpecial: AISpecial = {
      id: tempId,
      image_data: '',
      prompt: prompt || undefined,
      ai_response: null,
      status: 'processing',
      created_at: new Date().toISOString(),
    };

    setAiSpecials(prev => [tempSpecial, ...prev]);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        try {
          const response = await fetch('/api/ai-specials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData,
              prompt: prompt || undefined,
            }),
          });
          const result = (await response.json()) as {
            success: boolean;
            data?: AISpecial;
            message?: string;
          };
          if (result.success && result.data) {
            const serverData = result.data;
            setAiSpecials(prev =>
              prev.map(special => (special.id === tempId ? serverData : special)),
            );
            showSuccess('Image submitted successfully! Processing your AI special...');
          } else {
            setAiSpecials(originalSpecials);
            showError(result.message || 'Failed to process image');
          }
        } catch (fetchErr) {
          setAiSpecials(originalSpecials);
          logger.error('[useAiSpecials] Error processing image:', {
            error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
            userEmail,
          });
          showError("Couldn't process that image, chef. Give it another shot.");
        }
      };
      reader.onerror = () => {
        setAiSpecials(originalSpecials);
        showError("Couldn't read that image file, chef. Try a different one.");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setAiSpecials(originalSpecials);
      logger.error('[useAiSpecials] Error setting up file reader:', {
        error: err instanceof Error ? err.message : String(err),
        userEmail,
      });
      showError("Couldn't process that image, chef. Give it another shot.");
    }
  };

  return {
    aiSpecials,
    loading,
    error,
    isAuthenticated,
    userLoading,
    submitSpecial,
  };
}
