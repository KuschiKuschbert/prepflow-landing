'use client';

import { useCountry } from '@/contexts/CountryContext';
import { useConfirm } from '@/hooks/useConfirm';
import { useEffect, useState } from 'react';
import { BulkAllergenDetection } from '../../ingredients/components/BulkAllergenDetection';
import { Icon } from '@/components/ui/Icon';
import { Info, AlertTriangle, CheckCircle2, Sparkles, Check } from 'lucide-react';

interface PopulateAllCleanDataProps {
  onDataPopulated?: () => void;
}

export default function PopulateAllCleanData({ onDataPopulated }: PopulateAllCleanDataProps) {
  const { selectedCountry, countryConfig } = useCountry();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProduction, setIsProduction] = useState(false);

  // Check if we're in production (disabled check - allow in all environments)
  useEffect(() => {
    setIsProduction(false);
  }, []);

  const populateAllCleanData = async () => {
    const confirmed = await showConfirm({
      title: 'Start Fresh?',
      message:
        'This will wipe your current test data and replace it with fresh ingredients (~95), ~14 recipes, 24 dishes, 3 menus, sales data, and all the trimmings. Ready to start fresh?',
      variant: 'info',
      confirmLabel: 'Start Fresh',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Pass country code to API for regional temperature standards
      const url = `/api/populate-clean-test-data?countryCode=${encodeURIComponent(selectedCountry)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage =
          data.message ||
          `Successfully populated ${data.summary?.populated || 0} records across ${data.summary?.tables || 0} tables!`;
        setResult(successMessage);
        // Call callback to update parent progress
        if (onDataPopulated) {
          onDataPopulated();
        }
      } else {
        setError(data.error || 'Failed to populate clean test data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[var(--foreground)]">What you&apos;ll get:</h4>
              <span className="text-sm text-[var(--foreground-muted)]">
                Generating data for{' '}
                <span className="font-medium text-[var(--primary)]">{countryConfig.name}</span> temperature
                standards
              </span>
            </div>
            <ul className="space-y-2 text-[var(--foreground-secondary)]">
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>~95 ingredients (meat, vegetables, dairy, dry goods, consumables)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>~14 recipes with complete ingredient lists</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>24 dishes with recipe links (for Menu Builder & Dish Builder)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>3 menus with menu items (Lunch, Dinner, Weekend Specials)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>15-20 suppliers (Australian business names)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>~18 temperature equipment pieces with logs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>Cleaning areas, tasks, compliance types, kitchen sections</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>30 days of sales data for Performance analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>
                  All data properly linked (dishes ↔ recipes, menus ↔ dishes/recipes, etc.)
                </span>
              </li>
            </ul>
          </div>

          {/* Bulk Allergen Detection */}
          <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6">
            <h4 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Allergen Detection</h4>
            <p className="mb-4 text-sm text-[var(--foreground-muted)]">
              Detect allergens for ingredients that don&apos;t have them yet. This uses AI and
              pattern matching to identify allergens from ingredient names and brands.
            </p>
            <BulkAllergenDetection />
          </div>

          {isProduction && (
            <div className="mb-6 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
              <div className="flex items-start space-x-2">
                <Icon icon={Info} size="sm" className="text-[var(--primary)] flex-shrink-0 mt-0.5" aria-hidden={true} />
                <div className="flex-1">
                  <p className="font-semibold">Development Feature</p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Test data population is only available in development mode. In production, you
                    should manage your data manually through the respective pages (Ingredients,
                    Recipes, Suppliers, etc.).
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && !isProduction && (
            <div className="mb-6 rounded-2xl border border-[var(--color-error)]/30 bg-red-900/20 p-4 text-red-300">
              <div className="flex items-center space-x-2">
                <Icon icon={AlertTriangle} size="sm" className="text-[var(--color-error)]" aria-hidden={true} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="mb-6 rounded-2xl border border-[var(--color-success)]/30 bg-green-900/20 p-4 text-green-300">
              <div className="flex items-center space-x-2">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--color-success)]" aria-hidden={true} />
                <span>{result}</span>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={populateAllCleanData}
              disabled={loading || isProduction}
              className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
                loading
                  ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
                  : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
                  <span>Populating Clean Test Data...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Icon icon={Sparkles} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
                  <span>Populate All Clean Test Data</span>
                </span>
              )}
            </button>

            {!loading && (
              <p className="mt-4 text-sm text-[var(--foreground-muted)]">
                This will delete all existing data and populate clean, moderate test data
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
