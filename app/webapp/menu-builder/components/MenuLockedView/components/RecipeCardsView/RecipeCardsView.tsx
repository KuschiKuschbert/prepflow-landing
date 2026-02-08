/**
 * Recipe Cards View Component
 * Displays all recipe cards for a locked menu with scaling functionality
 */

'use client';
// Force recompile: 2026-02-05-v1

import { logger } from '@/lib/logger';
import { RecipeCardsViewProps } from '@/lib/types/menu-builder';
import { Loader2, RefreshCw } from 'lucide-react';
import React from 'react';
import { EmptyState } from './components/EmptyState';
import { MainCardsGrid } from './components/MainCardsGrid';
import { SubRecipeSections } from './components/SubRecipeSections';
import { useCardGeneration } from './hooks/useCardGeneration';
import { useRecipeCards } from './hooks/useRecipeCards';

export function RecipeCardsView({ menuId }: RecipeCardsViewProps) {
  const [expandedCardId, setExpandedCardId] = React.useState<string | null>(null);

  // Define stable error handler to prevents infinite loops in useRecipeCards
  const handleError = React.useCallback((err: string) => {
    logger.error('[RecipeCardsView] Error from useRecipeCards:', err);
  }, []);

  const { cards, subRecipeCards, loading, error, setCards, setSubRecipeCards, pollingRef } =
    useRecipeCards({
      menuId,
      onError: handleError,
    });

  const handleGenerationSuccess = React.useCallback(async () => {
    // Refresh cards after successful generation
    setTimeout(async () => {
      try {
        logger.dev('[RecipeCardsView] Refreshing cards after generation...');
        const refreshResponse = await fetch(`/api/menus/${menuId}/recipe-cards`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          logger.dev('[RecipeCardsView] Refresh response:', {
            success: refreshData.success,
            cardCount: refreshData.cards?.length || 0,
          });
          if (refreshData.success) {
            if (refreshData.cards) {
              setCards(refreshData.cards);
            }
            if (refreshData.subRecipeCards) {
              setSubRecipeCards(refreshData.subRecipeCards);
            }
            const totalCards =
              (refreshData.cards?.length || 0) +
              (refreshData.subRecipeCards?.sauces?.length || 0) +
              (refreshData.subRecipeCards?.marinades?.length || 0) +
              (refreshData.subRecipeCards?.brines?.length || 0) +
              (refreshData.subRecipeCards?.slowCooked?.length || 0) +
              (refreshData.subRecipeCards?.other?.length || 0);
            if (totalCards === 0) {
              const noCardsError =
                'No recipe cards were generated. This might be because:\n' +
                '1. AI service is not configured (check HUGGINGFACE_API_KEY)\n' +
                '2. Menu items have no ingredients\n' +
                '3. Generation failed silently - check server logs';
              logger.warn('[RecipeCardsView]', { error: noCardsError });
            } else {
              logger.dev(
                `[RecipeCardsView] Successfully loaded ${refreshData.cards.length} recipe cards`,
              );
            }
          }
        } else {
          const refreshError = 'Failed to refresh recipe cards';
          logger.error('[RecipeCardsView]', {
            error: refreshError,
            status: refreshResponse.status,
          });
        }
      } catch (refreshErr) {
        logger.error('[RecipeCardsView] Error refreshing cards:', refreshErr);
      }
    }, 2000); // Wait 2 seconds for generation to complete
  }, [menuId, setCards, setSubRecipeCards]);

  const { generating, handleGenerateCards } = useCardGeneration({
    menuId,
    onSuccess: handleGenerationSuccess,
  });

  // Handle Escape key to close expanded card
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedCardId) {
        setExpandedCardId(null);
      }
    };

    if (expandedCardId) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [expandedCardId]);

  const handleCardClick = (cardId: string) => {
    if (expandedCardId === cardId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(cardId);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">
          {generating
            ? 'Generating recipe cards... This may take 2-3 minutes for large menus.'
            : 'Loading recipe cards...'}
        </p>
        {generating && (
          <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
            Processing menu items with AI. Please wait...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-6 text-center">
        <p className="text-[var(--color-error)]">{error}</p>
      </div>
    );
  }

  const totalCards =
    cards.length +
    subRecipeCards.sauces.length +
    subRecipeCards.marinades.length +
    subRecipeCards.brines.length +
    subRecipeCards.slowCooked.length +
    subRecipeCards.other.length;

  if (totalCards === 0) {
    return (
      <EmptyState
        menuId={menuId}
        generating={generating}
        loading={loading}
        error={error}
        isGeneratingInBackground={pollingRef.current !== null}
        onGenerate={() => {
          handleGenerateCards().catch((err: unknown) => {
            logger.error('[RecipeCardsView] Error in handleGenerateCards:', err);
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3">
          <p className="text-xs text-[var(--foreground-secondary)]">
            <strong className="text-[var(--primary)]">Recipe Cards:</strong> All ingredients are
            normalized to 1 serving. Use the prep quantity input on each card to scale ingredients
            for your desired batch size.
          </p>
        </div>
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            logger.dev('[RecipeCardsView] Regenerate button clicked!', { menuId, generating });
            if (!generating) {
              handleGenerateCards().catch((err: unknown) => {
                logger.error('[RecipeCardsView] Error in handleGenerateCards:', err);
              });
            }
          }}
          disabled={generating || loading}
          className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Regenerate recipe cards for this menu"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-3 w-3" />
              Regenerate
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-4">
          <p className="text-sm font-semibold text-[var(--color-error)]">Error:</p>
          <p className="mt-2 text-sm whitespace-pre-line text-red-300">{error}</p>
        </div>
      )}

      <div className="relative">
        {/* Main Recipe Cards Section */}
        {cards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-fluid-xl tablet:text-fluid-2xl mb-4 font-bold text-[var(--foreground)]">
              Main Recipe Cards
            </h2>
            <MainCardsGrid
              cards={cards}
              expandedCardId={expandedCardId}
              onCardClick={handleCardClick}
            />
          </div>
        )}

        {/* Sub-Recipe Cards Sections */}
        {(subRecipeCards.sauces.length > 0 ||
          subRecipeCards.marinades.length > 0 ||
          subRecipeCards.brines.length > 0 ||
          subRecipeCards.slowCooked.length > 0 ||
          subRecipeCards.other.length > 0) && (
          <div className="space-y-8">
            <h2 className="text-fluid-xl tablet:text-fluid-2xl font-bold text-[var(--foreground)]">
              Sub-Recipes & Prep Items
            </h2>
            <SubRecipeSections
              subRecipeCards={subRecipeCards}
              expandedCardId={expandedCardId}
              onCardClick={handleCardClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
