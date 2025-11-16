'use client';

import { Icon } from '@/components/ui/Icon';
import { BookOpen, AlertTriangle, CheckCircle, TrendingUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRecipeReadiness } from './hooks/useRecipeReadiness';

export default function RecipeReadiness() {
  const { data, loading, error, refetch } = useRecipeReadiness();

  if (loading && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[#2a2a2a]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[#2a2a2a]" />
            <div className="h-4 w-3/4 rounded bg-[#2a2a2a]" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="tablet:mb-6 mb-4">
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
            Recipe Readiness
          </h2>
        </div>
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-fluid-sm font-medium text-red-400">{error}</p>
          <button
            onClick={refetch}
            className="text-fluid-xs tablet:text-fluid-sm mt-3 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-500/30"
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
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
            Recipe Readiness
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-gray-400">
            What's ready to prepare
          </p>
        </div>
        <Link
          href="/webapp/recipes"
          className="text-fluid-xs tablet:text-fluid-sm flex items-center gap-1 text-[#29E7CD] transition-colors hover:text-[#D925C7]"
        >
          View Recipes
          <Icon icon={ExternalLink} size="xs" aria-hidden={true} />
        </Link>
      </div>

      <div className="tablet:grid-cols-3 tablet:gap-4 grid grid-cols-1 gap-3">
        {/* Complete Recipes */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10">
              <Icon icon={CheckCircle} size="sm" className="text-green-400" aria-hidden={true} />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                Complete Recipes
              </p>
              <p className="text-fluid-xl tablet:text-fluid-2xl font-bold text-green-400">
                {data.completeRecipes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-gray-500">
            {data.completeRecipes === 0
              ? 'No complete recipes'
              : data.completeRecipes === 1
                ? '1 recipe ready'
                : `${data.completeRecipes} recipes ready`}
          </p>
        </div>

        {/* Incomplete Recipes */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
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
                className={data.incompleteRecipes > 0 ? 'text-yellow-400' : 'text-green-400'}
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                Incomplete Recipes
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.incompleteRecipes > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {data.incompleteRecipes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-gray-500">
            {data.incompleteRecipes === 0
              ? 'All recipes have ingredients'
              : data.incompleteRecipes === 1
                ? '1 recipe missing ingredients'
                : `${data.incompleteRecipes} recipes missing ingredients`}
          </p>
        </div>

        {/* Recipes Without Costs */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
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
                className={data.recipesWithoutCost > 0 ? 'text-yellow-400' : 'text-green-400'}
                aria-hidden={true}
              />
            </div>
            <div>
              <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                Without Costs
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.recipesWithoutCost > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {data.recipesWithoutCost}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs text-gray-500">
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
        <div className="tablet:mt-6 tablet:rounded-2xl tablet:p-4 mt-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={TrendingUp} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            <h3 className="text-fluid-sm tablet:text-fluid-base font-medium text-white">
              Most Used Recipes
            </h3>
          </div>
          <div className="space-y-2">
            {data.mostUsedRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="tablet:p-3 flex items-center justify-between rounded-lg bg-[#1f1f1f] p-2"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#29E7CD]/20 text-xs font-medium text-[#29E7CD]">
                    {index + 1}
                  </span>
                  <span className="text-fluid-xs tablet:text-fluid-sm font-medium text-white">
                    {recipe.name}
                  </span>
                </div>
                <span className="text-fluid-xs tablet:text-fluid-sm text-gray-400">
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
            className="text-fluid-xs tablet:px-6 tablet:py-2.5 tablet:text-fluid-sm block rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 text-center font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20"
          >
            Fix Recipe Issues
          </Link>
        </div>
      )}
    </div>
  );
}
