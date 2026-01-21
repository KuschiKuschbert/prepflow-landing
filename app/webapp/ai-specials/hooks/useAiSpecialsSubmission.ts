import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction } from 'react';
import type { AISpecial } from '../components/SpecialsGrid';

interface UseAiSpecialsSubmissionProps {
  isAuthenticated: boolean;
  userEmail: string | null;
  aiSpecials: AISpecial[];
  setAiSpecials: Dispatch<SetStateAction<AISpecial[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function useAiSpecialsSubmission({
  isAuthenticated,
  userEmail,
  aiSpecials,
  setAiSpecials,
  setError,
}: UseAiSpecialsSubmissionProps) {
  const { showSuccess, showError } = useNotification();

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

  return { submitSpecial };
}
