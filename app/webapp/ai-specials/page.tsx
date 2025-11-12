'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdaptiveContainer } from '../components/AdaptiveContainer';
import { Bot } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
  const [aiSpecials, setAiSpecials] = useState<AISpecial[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchAISpecials();
  }, []);

  const fetchAISpecials = async () => {
    // Disable loading state to prevent skeleton flashes during API errors
    // setLoading(true);
    try {
      const response = await fetch(`/api/ai-specials?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setAiSpecials(result.data);
      } else {
        setError(result.message || 'Failed to fetch AI specials');
      }
    } catch (err) {
      setError('Failed to fetch AI specials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;

        const response = await fetch('/api/ai-specials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            imageData,
            prompt: prompt || undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          await fetchAISpecials();
          setSelectedFile(null);
          setPrompt('');
        } else {
          setError(result.message || 'Failed to process image');
        }

        setProcessing(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Failed to process image');
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'processing':
        return 'text-blue-400 bg-blue-400/10';
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          {/* Header skeleton */}
          <div className="mb-8">
            <LoadingSkeleton variant="stats" height="64px" />
          </div>

          {/* Upload form skeleton */}
          <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
            <LoadingSkeleton variant="form" height="200px" />
          </div>

          {/* Results skeleton */}
          <div className="space-y-4">
            <LoadingSkeleton variant="card" count={3} height="120px" />
          </div>
        </div>
      </AdaptiveContainer>
    );
  }

  return (
    <AdaptiveContainer>
      <div className="min-h-screen bg-transparent py-8 text-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
              <Icon icon={Bot} size="lg" aria-hidden="true" />
              {t('aiSpecials.title', 'AI Specials Generator')}
            </h1>
            <p className="text-gray-400">
              {t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t('aiSpecials.uploadImage', 'Upload Ingredient Image')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('aiSpecials.selectImage', 'Select Image')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                required
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-400">
                  {t('aiSpecials.selectedFile', 'Selected')}: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('aiSpecials.customPrompt', 'Custom Prompt (Optional)')}
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                rows={3}
                placeholder="e.g., Create a vegetarian special using these ingredients"
              />
            </div>

            <button
              type="submit"
              disabled={processing || !selectedFile}
              className="w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{t('aiSpecials.processing', 'Processing...')}</span>
                </div>
              ) : (
                t('aiSpecials.generateSpecials', 'Generate Specials')
              )}
            </button>
          </form>
        </div>

        {/* AI Specials Results */}
        <div className="space-y-4">
          {aiSpecials.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <Icon icon={Bot} size="xl" className="text-[#29E7CD]" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('aiSpecials.noResults', 'No AI Specials Generated')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t(
                  'aiSpecials.noResultsDesc',
                  'Upload an image of your ingredients to generate AI-powered specials',
                )}
              </p>
            </div>
          ) : (
            aiSpecials.map(special => (
              <div
                key={special.id}
                className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start space-x-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                    <Icon icon={Bot} size="lg" className="text-[#29E7CD]" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {t('aiSpecials.aiAnalysis', 'AI Analysis')}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(special.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(special.status)}`}
                      >
                        {special.status.charAt(0).toUpperCase() + special.status.slice(1)}
                      </span>
                    </div>

                    {special.status === 'completed' && special.ai_response && (
                      <div className="space-y-4">
                        {/* Ingredients Detected */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-white">
                            {t('aiSpecials.detectedIngredients', 'Detected Ingredients')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {special.ai_response.ingredients?.map(
                              (ingredient: string, index: number) => (
                                <span
                                  key={index}
                                  className="rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-sm text-[#29E7CD]"
                                >
                                  {ingredient}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Special Suggestions */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-white">
                            {t('aiSpecials.specialSuggestions', 'Special Suggestions')}
                          </h4>
                          <div className="space-y-2">
                            {special.ai_response.suggestions?.map(
                              (suggestion: string, index: number) => (
                                <div
                                  key={index}
                                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3"
                                >
                                  <p className="text-sm text-gray-300">{suggestion}</p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* AI Confidence */}
                        {special.ai_response.confidence && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              {t('aiSpecials.confidence', 'AI Confidence')}:
                            </span>
                            <div className="h-2 flex-1 rounded-full bg-[#2a2a2a]">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
                                style={{ width: `${special.ai_response.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400">
                              {Math.round(special.ai_response.confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {special.status === 'processing' && (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent"></div>
                        <span className="text-sm text-gray-400">
                          {t('aiSpecials.processingImage', 'Processing image with AI...')}
                        </span>
                      </div>
                    )}

                    {special.status === 'failed' && (
                      <div className="text-sm text-red-400">
                        {t(
                          'aiSpecials.processingFailed',
                          'Failed to process image. Please try again.',
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdaptiveContainer>
  );
}
