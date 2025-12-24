'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Carrot, Info, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import { logger } from '@/lib/logger';

interface IngredientsSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  }) => void;
}

export default function IngredientsSetup({
  setupProgress,
  onProgressUpdate,
}: IngredientsSetupProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProduction, setIsProduction] = useState(false);

  // Check if we're in production
  useEffect(() => {
    // Check hostname - production typically uses prepflow.org
    const isProd =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'prepflow.org' ||
        window.location.hostname.includes('vercel.app') ||
        process.env.NODE_ENV === 'production');
    setIsProduction(isProd);
  }, []);

  const populateIngredients = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ populateIngredients: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
        onProgressUpdate({ ...setupProgress, ingredients: true });
      } else {
        setError(data.error || 'Failed to populate ingredients');
      }
    } catch (err) {
      logger.error('[IngredientsSetup.tsx] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError('Connection issue occurred. Give it another go, chef.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Icon icon={Carrot} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Ingredients</h3>
        <p className="text-lg text-[var(--foreground-muted)]">
          Populate your ingredients list with ~95 common kitchen ingredients (including consumables)
          with costs, units, and yield percentages
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            What you&apos;ll get:
          </h4>
          <ul className="space-y-2 text-[var(--foreground-secondary)]">
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>~95 common ingredients (vegetables, meats, dairy, spices, consumables)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Realistic cost data for Australian suppliers</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Proper units (kg, g, L, mL, each, etc.)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Yield percentages and waste factors</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Trim and peel waste calculations</span>
            </li>
          </ul>
        </div>

        {isProduction && (
          <div className="mb-6 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
            <div className="flex items-start space-x-2">
              <Icon
                icon={Info}
                size="sm"
                className="mt-0.5 flex-shrink-0 text-[var(--primary)]"
                aria-hidden={true}
              />
              <div className="flex-1">
                <p className="font-semibold">Development Feature</p>
                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Test data seeding is only available in development mode. In production, you should
                  add ingredients manually through the Ingredients page.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !isProduction && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/30 bg-red-900/20 p-4 text-red-300">
            <div className="flex items-center space-x-2">
              <Icon
                icon={AlertTriangle}
                size="sm"
                className="text-[var(--color-error)]"
                aria-hidden={true}
              />
              <span>{error}</span>
            </div>
          </div>
        )}

        {result && (
          <div className="mb-6 rounded-2xl border border-[var(--color-success)]/30 bg-green-900/20 p-4 text-green-300">
            <div className="flex items-center space-x-2">
              <Icon
                icon={CheckCircle2}
                size="sm"
                className="text-[var(--color-success)]"
                aria-hidden={true}
              />
              <span>{result}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={populateIngredients}
            disabled={loading || setupProgress.ingredients || isProduction}
            className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              setupProgress.ingredients
                ? 'cursor-not-allowed bg-green-600 text-[var(--button-active-text)]'
                : loading
                  ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
                  : 'bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80 hover:shadow-xl'
            }`}
          >
            {setupProgress.ingredients ? (
              <span className="flex items-center justify-center space-x-2">
                <Icon
                  icon={CheckCircle2}
                  size="sm"
                  className="text-[var(--foreground)]"
                  aria-hidden={true}
                />
                <span>Ingredients Added Successfully!</span>
              </span>
            ) : loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
                <span>Adding Ingredients...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Icon
                  icon={Carrot}
                  size="sm"
                  className="text-[var(--foreground)]"
                  aria-hidden={true}
                />
                <span>Add ~95 Ingredients (including consumables)</span>
              </span>
            )}
          </button>

          {!setupProgress.ingredients && (
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              This will take about 10-15 seconds to complete
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
