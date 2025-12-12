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
import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
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
  // Initialize with cached data for instant display
  const [aiSpecials, setAiSpecials] = useState<AISpecial[]>(
    () => getCachedData('ai_specials') || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const userId = 'user-123';

  // Prefetch API on mount
  useEffect(() => {
    prefetchApi(`/api/ai-specials?userId=${userId}`);
  }, [userId]);

  useEffect(() => {
    fetchAISpecials();
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
    } catch {
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
      setError('Please select an image file');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        const response = await fetch('/api/ai-specials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, imageData, prompt: prompt || undefined }),
        });
        const result = await response.json();
        if (result.success) {
          // Refresh list and cache will be updated by fetchAISpecials
          await fetchAISpecials();
          setSelectedFile(null);
          setPrompt('');
        } else {
          setError(result.message || 'Failed to process image');
        }
        setProcessing(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch {
      setError('Failed to process image');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <div className="mb-8">
            <LoadingSkeleton variant="stats" height="64px" />
          </div>
          <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
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
      <div className="min-h-screen bg-transparent py-8 text-white">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
              <Icon icon={Bot} size="lg" aria-hidden={true} />
              {t('aiSpecials.title', 'AI Specials Generator')}
            </h1>
            <p className="text-gray-400">
              {t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <UploadForm
          selectedFile={selectedFile}
          prompt={prompt}
          processing={processing}
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
