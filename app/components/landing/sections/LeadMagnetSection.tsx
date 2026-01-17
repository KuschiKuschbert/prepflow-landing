'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import { trackGTMEvent } from '../../../../components/GoogleTagManager';
import { getSessionId, trackConversion, trackEvent } from '../../../../lib/analytics';
import { useTranslation } from '../../../../lib/useTranslation';

function LeadMagnetSectionContent() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    try {
      trackEvent('lead_magnet_submit', 'conversion', 'lead_magnet_form');
      trackConversion({
        type: 'signup_start',
        element: 'lead_magnet_form',
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: Date.now(),
        sessionId: getSessionId(),
        metadata: { source: 'lead_magnet_section' },
      });

      trackGTMEvent('lead_submit', {
        event_category: 'conversion',
        event_label: 'lead_magnet_section',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      });

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'lead_magnet_section' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit');
      }
      setIsSuccess(true);
      trackGTMEvent('lead_submit_success', {
        event_category: 'conversion',
        event_label: 'lead_magnet_section',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      });
      setName('');
      setEmail('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('[LeadMagnetSection.tsx] Error in catch block:', {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError(errorMessage || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lead-magnet" className="py-20">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-fluid-3xl desktop:text-fluid-4xl mb-6 font-bold tracking-tight">
            {t('leadMagnet.title', 'Try It Free First')}
          </h2>
          <p className="text-fluid-lg mx-auto max-w-2xl text-gray-300">
            {t(
              'leadMagnet.description',
              'Download our free Excel COGS calculator. See how it works. No signup required.',
            )}
          </p>
          <div className="mt-8">
            <a
              href="/sample-cogs-calculator.xlsx"
              download
              className="text-fluid-lg inline-flex items-center rounded-2xl bg-[#29E7CD] px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#29E7CD]/80 hover:shadow-xl"
            >
              {t('leadMagnet.download', 'Download Free Template')}
            </a>
          </div>

          {/* Optional email capture for sample sheet */}
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#29E7CD]/20 bg-[#1f1f1f]/50 p-6">
            {isSuccess ? (
              <p className="text-center text-[#29E7CD]">Thanks! Check your inbox shortly.</p>
            ) : (
              <form onSubmit={handleSubmit} className="desktop:grid-cols-3 grid gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="rounded-xl border border-gray-700 bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-[#29E7CD] focus:outline-none"
                  aria-label="Your name"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-xl border border-gray-700 bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 focus:border-[#29E7CD] focus:outline-none"
                  aria-label="Your email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white transition-all duration-300 ${
                    isSubmitting
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:shadow-xl hover:shadow-[#29E7CD]/25'
                  }`}
                >
                  {isSubmitting ? 'Sending…' : 'Email me the sample'}
                </button>
                {error && (
                  <div className="text-fluid-sm desktop:col-span-3 text-red-400" role="alert">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LeadMagnetSection() {
  return (
    <ErrorBoundary>
      <LeadMagnetSectionContent />
    </ErrorBoundary>
  );
}
