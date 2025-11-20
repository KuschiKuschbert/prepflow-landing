'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { Bot } from 'lucide-react';

interface AISpecial {
  id: string;
  image_data: string;
  prompt?: string;
  ai_response: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface AISpecialCardProps {
  special: AISpecial;
}

function getStatusColor(status: string) {
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
}

export function AISpecialCard({ special }: AISpecialCardProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <div className="mb-4 flex items-start space-x-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={Bot} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
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
              <div>
                <h4 className="mb-2 text-sm font-semibold text-white">
                  {t('aiSpecials.detectedIngredients', 'Detected Ingredients')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {special.ai_response.ingredients?.map((ingredient: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-sm text-[#29E7CD]"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-white">
                  {t('aiSpecials.specialSuggestions', 'Special Suggestions')}
                </h4>
                <div className="space-y-2">
                  {special.ai_response.suggestions?.map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3"
                    >
                      <p className="text-sm text-gray-300">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
              {special.ai_response.confidence && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {t('aiSpecials.confidence', 'AI Confidence')}:
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-[#2a2a2a]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
                      style={{ width: `${special.ai_response.confidence * 100}%` }}
                    />
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
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent" />
              <span className="text-sm text-gray-400">
                {t('aiSpecials.processingImage', 'Processing image with AI...')}
              </span>
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
  );
}
