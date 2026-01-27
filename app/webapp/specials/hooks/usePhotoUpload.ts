'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

interface AIResponse {
  aiRecord: { id: string };
  suggestions?: string[];
  ingredients?: string[];
}

interface UsePhotoUploadResult {
  submitPhoto: (file: File, prompt: string) => Promise<{ ingredients: string[]; suggestions: string[] } | null>;
  isProcessing: boolean;
  isAuthenticated: boolean;
}

export function usePhotoUpload(): UsePhotoUploadResult {
  const { user, isLoading } = useUser();
  const { showSuccess, showError } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !isLoading && !!user;

  const submitPhoto = async (file: File, prompt: string) => {
    if (!isAuthenticated) {
      showError('Please log in to use the kitchen scanner');
      // Optional: Redirect to login
      window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return null;
    }

    setIsProcessing(true);

    try {
      // 1. Convert File to Data URL
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Submit to API
      const response = await fetch('/api/ai-specials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          prompt: prompt || undefined,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        showSuccess('Ingredients detected! Updating your search...');
        return result.data as { ingredients: string[]; suggestions: string[] };
      } else {
        throw new Error(result.message || 'Failed to process image');
      }

    } catch (err) {
      logger.error('[usePhotoUpload] Error processing image:', {
        error: err instanceof Error ? err.message : String(err),
        email: user?.email,
      });
      showError("Couldn't analyze that image. Please try again.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitPhoto, isProcessing, isAuthenticated };
}
