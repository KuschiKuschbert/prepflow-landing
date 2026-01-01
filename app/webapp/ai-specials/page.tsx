'use client';
import { useState, useEffect } from 'react';

// Force dynamic rendering to prevent SSR issues with Auth0 SDK
export const dynamic = 'force-dynamic';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { Bot } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { UploadForm } from './components/UploadForm';
import { AISpecialCard } from './components/AISpecialCard';
import { EmptyState } from './components/EmptyState';
import { RecipeScraper } from './components/RecipeScraper';
import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
interface AISpecial {
  id: string;
  image_data: string;
  prompt?: string;
  ai_response: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export default function AISpecialsPage() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  // Initialize with cached data for instant display
  const [aiSpecials, setAiSpecials] = useState<AISpecial[]>(
    () => getCachedData('ai_specials') || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showRecipeScraper, setShowRecipeScraper] = useState(false);
  const userId = 'user-123';

  // Prefetch API on mount
  useEffect(() => {
    prefetchApi(`/api/ai-specials?userId=${userId}`);
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        await fetchAISpecials();
      } catch (err) {
        logger.error('[AISpecialsPage] Error in useEffect:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
  }, []);

  const fetchAISpecials = async () => {
    try {
      const response = await fetch(`/api/ai-specials?userId=${userId}`);
      const result = await response.json();
      if (result.success) {
        setAiSpecials(result.data);
        cacheData('ai_specials', result.data);
      } else {
        setError(result.message || 'Failed to fetch AI specials');
      }
    } catch (err) {
      logger.error('[AISpecialsPage] Error fetching AI specials:', {
        error: err instanceof Error ? err.message : String(err),
        userId,
      });
      setError('Failed to fetch AI specials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select an image file');
      return;
    }

    // Store original state for rollback
    const originalSpecials = [...aiSpecials];

    // Create temporary special for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempSpecial: AISpecial = {
      id: tempId,
      image_data: '',
      prompt: prompt || undefined,
      ai_response: null,
      status: 'processing',
      created_at: new Date().toISOString(),
    };

    // Optimistically add to UI immediately
    setAiSpecials(prev => [tempSpecial, ...prev]);
    setError(null);
    const fileToSubmit = selectedFile;
    const promptToSubmit = prompt;
    setSelectedFile(null);
    setPrompt('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        try {
          const response = await fetch('/api/ai-specials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              imageData,
              prompt: promptToSubmit || undefined,
            }),
          });
          const result = await response.json();
          if (result.success && result.data) {
            // Replace temp special with real one from server
            setAiSpecials(prev =>
              prev.map(special => (special.id === tempId ? result.data : special)),
            );
            showSuccess('Image submitted successfully! Processing your AI special...');
          } else {
            // Error - revert optimistic update
            setAiSpecials(originalSpecials);
            showError(result.message || 'Failed to process image');
          }
        } catch (fetchErr) {
          // Error - revert optimistic update
          setAiSpecials(originalSpecials);
          logger.error('[AISpecialsPage] Error processing image:', {
            error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
            userId,
          });
          showError("Couldn't process that image, chef. Give it another shot.");
        }
      };
      reader.onerror = () => {
        // File read error - revert optimistic update
        setAiSpecials(originalSpecials);
        showError("Couldn't read that image file, chef. Try a different one.");
      };
      reader.readAsDataURL(fileToSubmit);
    } catch (err) {
      // Error - revert optimistic update
      setAiSpecials(originalSpecials);
      logger.error('[AISpecialsPage] Error setting up file reader:', {
        error: err instanceof Error ? err.message : String(err),
        userId,
      });
      showError("Couldn't process that image, chef. Give it another shot.");
    }
  };

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <div className="mb-8">
            <LoadingSkeleton variant="stats" height="64px" />
          </div>
          <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
            <LoadingSkeleton variant="form" height="200px" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton variant="card" count={3} height="120px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }
  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
              <Icon icon={Bot} size="lg" aria-hidden={true} />
              {t('aiSpecials.title', 'AI Specials Generator')}
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
            </p>
          </div>
          <button
            onClick={() => setShowRecipeScraper(!showRecipeScraper)}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            {showRecipeScraper ? 'Hide' : 'Show'} Recipe Database
          </button>
        </div>
        {error && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
            <p className="text-[var(--color-error)]">{error}</p>
          </div>
        )}
        {showRecipeScraper && (
          <div className="mb-6">
            <RecipeScraper />
          </div>
        )}
        <UploadForm
          selectedFile={selectedFile}
          prompt={prompt}
          processing={false}
          onFileSelect={handleFileSelect}
          onPromptChange={setPrompt}
          onSubmit={handleSubmit}
        />
        <div className="space-y-4">
          {aiSpecials.length === 0 ? (
            <EmptyState onUploadClick={() => {}} />
          ) : (
            aiSpecials.map(special => <AISpecialCard key={special.id} special={special} />)
          )}
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
