'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, CheckCircle, TrendingUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRecipeReadiness } from './hooks/useRecipeReadiness';

export default function RecipeReadiness() {
  const { data, loading, error, refetch } = useRecipeReadiness();

  if (loading && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[var(--muted)]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--muted)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <div className="tablet:mb-6 mb-4">
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
            Recipe Readiness
          </h2>
        </div>
        <div className="rounded-xl border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-4">
          <p className="text-fluid-sm font-medium text-[var(--color-error)]">{error}</p>
          <button
            onClick={refetch}
            className="text-fluid-xs tablet:text-fluid-sm mt-3 rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/20 px-4 py-2 font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
            Recipe Readiness
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground-muted)]">
            What&apos;s ready to prepare
          </p>
        </div>
        <Link
          href="/webapp/recipes"
          className="text-fluid-xs tablet:text-fluid-sm flex items-center gap-1 text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
        >
          View Recipes
          <Icon icon={ExternalLink} size="xs" aria-hidden={true} />
        </Link>
      </div>

      <div className="tablet:grid-cols-3 tablet:gap-4 grid grid-cols-1 gap-3">
        {/* Complete Recipes */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10">
              <Icon
                icon={CheckCircle}
                size="sm"
                className="text-[var(--color-success)]"
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Complete Recipes
              </p>
              <p className="text-fluid-xl tablet:text-fluid-2xl font-bold text-[var(--color-success)]">
                {data.completeRecipes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {data.completeRecipes === 0
              ? 'No complete recipes'
              : data.completeRecipes === 1
                ? '1 recipe ready'
                : `${data.completeRecipes} recipes ready`}
          </p>
        </div>

        {/* Incomplete Recipes */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${
                data.incompleteRecipes > 0
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-green-500/20 to-green-500/10'
              }`}
            >
              <Icon
                icon={data.incompleteRecipes > 0 ? AlertTriangle : CheckCircle}
                size="sm"
                className={
                  data.incompleteRecipes > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-success)]'
                }
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Incomplete Recipes
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.incompleteRecipes > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-success)]'
                }`}
              >
                {data.incompleteRecipes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {data.incompleteRecipes === 0
              ? 'All recipes have ingredients'
              : data.incompleteRecipes === 1
                ? '1 recipe missing ingredients'
                : `${data.incompleteRecipes} recipes missing ingredients`}
          </p>
        </div>

        {/* Recipes Without Costs */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${
                data.recipesWithoutCost > 0
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-green-500/20 to-green-500/10'
              }`}
            >
              <Icon
                icon={data.recipesWithoutCost > 0 ? AlertTriangle : CheckCircle}
                size="sm"
                className={
                  data.recipesWithoutCost > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-success)]'
                }
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                Without Costs
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.recipesWithoutCost > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-success)]'
                }`}
              >
                {data.recipesWithoutCost}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-[var(--foreground-muted)]">
            {data.recipesWithoutCost === 0
              ? 'All recipes have pricing'
              : data.recipesWithoutCost === 1
                ? '1 recipe needs pricing'
                : `${data.recipesWithoutCost} recipes need pricing`}
          </p>
        </div>
      </div>

      {/* Most Used Recipes */}
      {data.mostUsedRecipes.length > 0 && (
        <div className="tablet:mt-6 tablet:rounded-2xl tablet:p-4 mt-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          <div className="mb-3 flex items-center gap-2">
            <Icon
              icon={TrendingUp}
              size="sm"
              className="text-[var(--primary)]"
              aria-hidden={true}
            />
            <h3 className="text-fluid-sm tablet:text-fluid-base font-medium text-[var(--foreground)]">
              Most Used Recipes
            </h3>
          </div>
          <div className="space-y-2">
            {data.mostUsedRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="tablet:p-3 flex items-center justify-between rounded-lg bg-[var(--surface)] p-2"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-medium text-[var(--primary)]">
                    {index + 1}
                  </span>
                  <span className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground)]">
                    {recipe.name}
                  </span>
                </div>
                <span className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                  Used {recipe.usageCount} {recipe.usageCount === 1 ? 'time' : 'times'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(data.incompleteRecipes > 0 || data.recipesWithoutCost > 0) && (
        <div className="tablet:mt-6 mt-4">
          <Link
            href="/webapp/recipes"
            className="text-fluid-xs tablet:px-6 tablet:py-2.5 tablet:text-fluid-sm block rounded-lg border border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10 px-4 py-2 text-center font-medium text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)]/20"
          >
            Fix Recipe Issues
          </Link>
        </div>
      )}
    </div>
  );
}
