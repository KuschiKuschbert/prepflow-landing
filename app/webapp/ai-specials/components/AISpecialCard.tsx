'use client';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Bot } from 'lucide-react';

interface AISpecial {
  id: string;
  image_data: string;
  prompt?: string;
  ai_response: {
    ingredients?: string[];
    suggestions?: string[];
    confidence?: number;
  } | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface AISpecialCardProps {
  special: AISpecial;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10';
    case 'processing':
      return 'text-[var(--color-info)] bg-[var(--color-info)]/10';
    case 'completed':
      return 'text-[var(--color-success)] bg-[var(--color-success)]/10';
    case 'failed':
      return 'text-[var(--color-error)] bg-[var(--color-error)]/10';
    default:
      return 'text-[var(--foreground-muted)] bg-gray-400/10';
  }
}

export function AISpecialCard({ special }: AISpecialCardProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-xl">
      <div className="mb-4 flex items-start space-x-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon icon={Bot} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {t('aiSpecials.aiAnalysis', 'AI Analysis')}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
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
                <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
                  {t('aiSpecials.detectedIngredients', 'Detected Ingredients')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {special.ai_response.ingredients?.map((ingredient: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
                  {t('aiSpecials.specialSuggestions', 'Special Suggestions')}
                </h4>
                <div className="space-y-2">
                  {special.ai_response.suggestions?.map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3"
                    >
                      <p className="text-sm text-[var(--foreground-secondary)]">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
              {special.ai_response.confidence && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {t('aiSpecials.confidence', 'AI Confidence')}:
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-[var(--muted)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300"
                      style={{ width: `${special.ai_response.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {Math.round(special.ai_response.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}
          {special.status === 'processing' && (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
              <span className="text-sm text-[var(--foreground-muted)]">
                {t('aiSpecials.processingImage', 'Processing image with AI...')}
              </span>
            </div>
          )}
          {special.status === 'failed' && (
            <div className="text-sm text-[var(--color-error)]">
              {t('aiSpecials.processingFailed', 'Failed to process image. Please try again.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
