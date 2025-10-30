/**
 * Landing page sections component
 */

import React, { useState } from 'react';
import { trackEvent, trackConversion, getSessionId } from '../../../lib/analytics';
import OptimizedImage from '../../../components/OptimizedImage';
import { useTranslation } from '../../../lib/useTranslation';

interface LandingSectionsProps {
  renderHero: () => React.ReactNode;
  renderPricing: () => React.ReactNode;
}

const LandingSections = React.memo(function LandingSections({
  renderHero,
  renderPricing,
}: LandingSectionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section - A/B Testing Variants with Lazy Loading */}
      {renderHero()}

      {/* Problem → Outcome */}
      <section id="problem-outcome" className="py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('problem.title', 'The Problem: Hidden Profit Killers')}
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                {t(
                  'problem.point1',
                  'You think you know your costs, but small changes add up to big losses.',
                )}
              </p>
              <p>
                {t(
                  'problem.point2',
                  "Without accurate COGS, you're pricing blind and losing money on every dish.",
                )}
              </p>
              <p>
                {t('problem.point3', 'Manual calculations are error-prone and time-consuming.')}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('outcome.title', 'The Outcome: Profit Maximization')}
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                {t(
                  'outcome.point1',
                  "Know exactly what each dish costs and how much profit you're making.",
                )}
              </p>
              <p>
                {t(
                  'outcome.point2',
                  'Price confidently with data-driven decisions that maximize margins.',
                )}
              </p>
              <p>
                {t(
                  'outcome.point3',
                  'Save hours every week with automated calculations and insights.',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contributing Margin Highlight */}
      <section className="py-20" id="contributing-margin">
        <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('contributingMargin.title', 'Contributing Margin: Your Profit Engine')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              {t(
                'contributingMargin.description',
                "Contributing margin is the profit each dish contributes after covering its direct costs. It's the key metric that tells you which dishes are profit stars and which are profit drains.",
              )}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
                  {t('contributingMargin.benefit1.title', 'Direct Cost Coverage')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'contributingMargin.benefit1.description',
                    'Covers ingredient costs, labor, and direct overhead for each dish.',
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
                  {t('contributingMargin.benefit2.title', 'Profit Contribution')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'contributingMargin.benefit2.description',
                    'Shows how much each dish contributes to overall profitability.',
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
                  {t('contributingMargin.benefit3.title', 'Menu Optimization')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'contributingMargin.benefit3.description',
                    'Helps you optimize your menu for maximum profit potential.',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Story - Authentic Journey */}
      <section className="border-t border-gray-700 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            {t('story.title', 'My Story: From Frustration to Solution')}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-300">
            {t('story.subtitle', "I've been where you are. Here's how PrepFlow came to be.")}
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
                {t('story.frustration.title', 'The Frustration')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'story.frustration.description',
                  'Running a restaurant, I was constantly guessing at costs. Spreadsheets were messy, calculations were wrong, and I was losing money without knowing it.',
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-[#D925C7]">
                {t('story.solution.title', 'The Solution')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'story.solution.description',
                  "I built PrepFlow to solve these exact problems. It's the tool I wish I had when I was struggling with manual calculations and hidden costs.",
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <OptimizedImage
              src="/images/chef-working.jpg"
              alt="Chef working in kitchen"
              width={500}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features – tailored to the spreadsheet */}
      <section id="features" className="py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
              {t('features.cogs.title', 'Accurate COGS Calculation')}
            </h3>
            <p className="text-gray-300">
              {t(
                'features.cogs.description',
                'Calculate exact cost of goods sold for every dish with ingredient costs, waste factors, and yield adjustments.',
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#3B82F6]">
              {t('features.pricing.title', 'Smart Pricing Tool')}
            </h3>
            <p className="text-gray-300">
              {t(
                'features.pricing.description',
                'Set optimal prices based on target profit margins and market positioning.',
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#D925C7]">
              {t('features.insights.title', 'Profit Insights')}
            </h3>
            <p className="text-gray-300">
              {t(
                'features.insights.description',
                'Get actionable insights on which dishes are profit stars and which need attention.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Global Features */}
      <section id="global-features" className="py-20">
        <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('globalFeatures.title', 'Built for Global Restaurants')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              {t(
                'globalFeatures.description',
                'PrepFlow works for restaurants worldwide with support for multiple currencies, measurement systems, and local regulations.',
              )}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">
                  {t('globalFeatures.currency.title', 'Multi-Currency')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('globalFeatures.currency.description', 'AUD, USD, EUR, GBP support')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#3B82F6]">
                  {t('globalFeatures.units.title', 'Unit Systems')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('globalFeatures.units.description', 'Metric & Imperial units')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#D925C7]">
                  {t('globalFeatures.localization.title', 'Localization')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('globalFeatures.localization.description', 'Local regulations & standards')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">
                  {t('globalFeatures.support.title', '24/7 Support')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('globalFeatures.support.description', 'Global customer support')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {t('howItWorks.title', 'How PrepFlow Works')}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#29E7CD]/20 text-2xl font-bold text-[#29E7CD]">
              1
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              {t('howItWorks.step1.title', 'Add Your Ingredients')}
            </h3>
            <p className="text-gray-300">
              {t(
                'howItWorks.step1.description',
                'Input your ingredient costs, suppliers, and storage information.',
              )}
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 text-2xl font-bold text-[#3B82F6]">
              2
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              {t('howItWorks.step2.title', 'Create Your Recipes')}
            </h3>
            <p className="text-gray-300">
              {t(
                'howItWorks.step2.description',
                'Build recipes with ingredients and quantities. PrepFlow calculates costs automatically.',
              )}
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D925C7]/20 text-2xl font-bold text-[#D925C7]">
              3
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              {t('howItWorks.step3.title', 'Optimize Your Pricing')}
            </h3>
            <p className="text-gray-300">
              {t(
                'howItWorks.step3.description',
                'Set target margins and get optimal pricing recommendations.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section id="lead-magnet" className="py-20">
        <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('leadMagnet.title', 'Get Your Free COGS Calculator')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              {t(
                'leadMagnet.description',
                'Download our free Excel template to start calculating COGS immediately. No signup required.',
              )}
            </p>
            <div className="mt-8">
              <a
                href="/sample-cogs-calculator.xlsx"
                download
                className="inline-flex items-center rounded-2xl bg-[#29E7CD] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#29E7CD]/80 hover:shadow-xl"
              >
                {t('leadMagnet.download', 'Download Free Template')}
              </a>
            </div>

            {/* Optional email capture for sample sheet */}
            <LeadMagnetForm />
          </div>
        </div>
      </section>

      {/* Pricing Section - A/B Testing Variants with Lazy Loading */}
      {renderPricing()}

      {/* How PrepFlow Works in Practice */}
      <section id="how-it-works-practice" className="py-20">
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('practice.title', 'How PrepFlow Works in Practice')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              {t(
                'practice.description',
                'See how real restaurants use PrepFlow to increase their profit margins and streamline their operations.',
              )}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#29E7CD]">
                  {t('practice.before.title', 'Before PrepFlow')}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t('practice.before.point1', 'Manual calculations prone to errors')}</li>
                  <li>• {t('practice.before.point2', 'Time-consuming spreadsheet management')}</li>
                  <li>• {t('practice.before.point3', 'Unclear profit margins')}</li>
                  <li>• {t('practice.before.point4', 'Difficulty tracking ingredient costs')}</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#D925C7]">
                  {t('practice.after.title', 'After PrepFlow')}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t('practice.after.point1', 'Automated, accurate calculations')}</li>
                  <li>• {t('practice.after.point2', 'Streamlined workflow management')}</li>
                  <li>• {t('practice.after.point3', 'Clear profit margin insights')}</li>
                  <li>• {t('practice.after.point4', 'Real-time cost tracking')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What PrepFlow Helps You Achieve */}
      <section id="benefits" className="py-20">
        <h3 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {t('benefits.title', 'What PrepFlow Helps You Achieve')}
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-[#29E7CD]">
              {t('benefits.profit.title', 'Increase Profit Margins')}
            </h4>
            <p className="text-gray-300">
              {t(
                'benefits.profit.description',
                'Identify and eliminate profit leaks with accurate cost calculations.',
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-[#3B82F6]">
              {t('benefits.time.title', 'Save Time')}
            </h4>
            <p className="text-gray-300">
              {t(
                'benefits.time.description',
                'Automate calculations and reduce manual work by hours every week.',
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-[#D925C7]">
              {t('benefits.confidence.title', 'Price with Confidence')}
            </h4>
            <p className="text-gray-300">
              {t(
                'benefits.confidence.description',
                'Make data-driven pricing decisions that maximize profitability.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <h3 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {t('faq.title', 'Frequently Asked Questions')}
        </h3>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-[#29E7CD]">
              {t('faq.question1', 'How accurate are the COGS calculations?')}
            </h4>
            <p className="text-gray-300">
              {t(
                'faq.answer1',
                'PrepFlow uses industry-standard formulas and accounts for waste factors, yield adjustments, and supplier variations to provide highly accurate cost calculations.',
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-[#3B82F6]">
              {t('faq.question2', 'Can I import my existing data?')}
            </h4>
            <p className="text-gray-300">
              {t(
                'faq.answer2',
                'Yes, PrepFlow supports CSV import for ingredients, recipes, and supplier data to help you migrate from existing systems.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="border-t border-gray-700 py-16">
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-2xl font-bold tracking-tight">
            {t('trust.title', 'Trusted by Restaurants Worldwide')}
          </h3>
          <p className="text-gray-400">
            {t(
              'trust.subtitle',
              'Join hundreds of restaurants already using PrepFlow to maximize their profits',
            )}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#29E7CD]">500+</div>
            <div className="text-gray-400">{t('trust.restaurants', 'Restaurants')}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#3B82F6]">$2M+</div>
            <div className="text-gray-400">{t('trust.savings', 'Cost Savings')}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-[#D925C7]">4.8★</div>
            <div className="text-gray-400">{t('trust.rating', 'Customer Rating')}</div>
          </div>
        </div>
      </section>
    </>
  );
});

export default LandingSections;

function LeadMagnetForm() {
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
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#29E7CD]/20 bg-[#1f1f1f]/50 p-6">
      {isSuccess ? (
        <p className="text-center text-[#29E7CD]">Thanks! Check your inbox shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
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
            <div className="text-sm text-red-400 md:col-span-3" role="alert">
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
