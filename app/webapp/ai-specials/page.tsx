'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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
  const [loading, setLoading] = useState(true);
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
            prompt: prompt || undefined
          })
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
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'processing': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-4"></div>
            <div className="h-4 bg-[#2a2a2a] rounded-xl w-1/2"></div>
          </div>

          {/* Upload form skeleton */}
          <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-1/3 mb-2"></div>
                  <div className="h-12 bg-[#2a2a2a] rounded-xl"></div>
                </div>
                <div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-1/3 mb-2"></div>
                  <div className="h-20 bg-[#2a2a2a] rounded-xl"></div>
                </div>
                <div className="h-12 bg-[#2a2a2a] rounded-xl w-full"></div>
              </div>
            </div>
          </div>

          {/* Results skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-[#2a2a2a] rounded w-1/4"></div>
                    <div className="h-3 bg-[#2a2a2a] rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-[#2a2a2a] rounded w-2/3"></div>
                      <div className="h-3 bg-[#2a2a2a] rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🤖 {t('aiSpecials.title', 'AI Specials Generator')}</h1>
            <p className="text-gray-400">{t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">{t('aiSpecials.uploadImage', 'Upload Ingredient Image')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('aiSpecials.selectImage', 'Select Image')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                required
              />
              {selectedFile && (
                <p className="text-sm text-gray-400 mt-2">
                  {t('aiSpecials.selectedFile', 'Selected')}: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('aiSpecials.customPrompt', 'Custom Prompt (Optional)')}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                rows={3}
                placeholder="e.g., Create a vegetarian special using these ingredients"
              />
            </div>

            <button
              type="submit"
              disabled={processing || !selectedFile}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('aiSpecials.noResults', 'No AI Specials Generated')}</h3>
              <p className="text-gray-400 mb-6">{t('aiSpecials.noResultsDesc', 'Upload an image of your ingredients to generate AI-powered specials')}</p>
            </div>
          ) : (
            aiSpecials.map((special) => (
              <div
                key={special.id}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{t('aiSpecials.aiAnalysis', 'AI Analysis')}</h3>
                        <p className="text-sm text-gray-400">{new Date(special.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(special.status)}`}>
                        {special.status.charAt(0).toUpperCase() + special.status.slice(1)}
                      </span>
                    </div>

                    {special.status === 'completed' && special.ai_response && (
                      <div className="space-y-4">
                        {/* Ingredients Detected */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">{t('aiSpecials.detectedIngredients', 'Detected Ingredients')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {special.ai_response.ingredients?.map((ingredient: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#29E7CD]/10 text-[#29E7CD] rounded-full text-sm border border-[#29E7CD]/20"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Special Suggestions */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">{t('aiSpecials.specialSuggestions', 'Special Suggestions')}</h4>
                          <div className="space-y-2">
                            {special.ai_response.suggestions?.map((suggestion: string, index: number) => (
                              <div
                                key={index}
                                className="p-3 bg-[#2a2a2a]/30 rounded-xl border border-[#2a2a2a]"
                              >
                                <p className="text-sm text-gray-300">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Confidence */}
                        {special.ai_response.confidence && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{t('aiSpecials.confidence', 'AI Confidence')}:</span>
                            <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] h-2 rounded-full transition-all duration-300"
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
                        <div className="w-4 h-4 border-2 border-[#29E7CD] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-400">{t('aiSpecials.processingImage', 'Processing image with AI...')}</span>
                      </div>
                    )}

                    {special.status === 'failed' && (
                      <div className="text-sm text-red-400">
                        {t('aiSpecials.processingFailed', 'Failed to process image. Please try again.')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
