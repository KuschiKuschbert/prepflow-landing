/**
 * Recipe Cards View Component
 * Displays all recipe cards for a locked menu with scaling functionality
 */

'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { RecipeCard } from './RecipeCard';

interface RecipeCardData {
  id: string;
  menuItemId: string; // First menu item (backward compatibility)
  menuItemIds?: string[]; // All menu items using this card (cross-referencing)
  menuItemName: string; // First menu item name (backward compatibility)
  menuItemNames?: string[]; // All menu item names (cross-referencing)
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  parsedAt: string | null;
  recipeId?: string | null; // For direct recipe menu items
  dishId?: string | null; // For dish menu items
  recipeSignature?: string | null; // Composite identifier for cross-referencing
  subRecipeType?: 'sauces' | 'marinades' | 'brines' | 'slowCooked' | 'other'; // For sub-recipe cards
  usedByMenuItems?: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>; // Cross-reference for sub-recipe cards
}

interface RecipeCardsViewProps {
  menuId: string;
}

interface SubRecipeCards {
  sauces: RecipeCardData[];
  marinades: RecipeCardData[];
  brines: RecipeCardData[];
  slowCooked: RecipeCardData[];
  other: RecipeCardData[];
}

export function RecipeCardsView({ menuId }: RecipeCardsViewProps) {
  const [cards, setCards] = useState<RecipeCardData[]>([]);
  const [subRecipeCards, setSubRecipeCards] = useState<SubRecipeCards>({
    sauces: [],
    marinades: [],
    brines: [],
    slowCooked: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedPollingRef = useRef(false);

  // Log when component mounts
  useEffect(() => {
    logger.dev('[RecipeCardsView] Component mounted', { menuId });
    console.log('[RecipeCardsView] Component mounted for menu:', menuId);
  }, [menuId]);

  // Handle Escape key to close expanded card
  useEffect(() => {
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

  useEffect(() => {
    let pollCount = 0;
    const MAX_POLLS = 60; // Poll for up to 2 minutes (60 * 2 seconds)

    async function fetchCards(isPollingCheck = false) {
      try {
        // Only show loading spinner on initial load, not during polling
        if (!isPollingCheck) {
          setLoading(true);
        }
        setError(null);

        const response = await fetch(`/api/menus/${menuId}/recipe-cards`);

        if (!response.ok) {
          throw new Error('Failed to fetch recipe cards');
        }

        const data = await response.json();

        if (data.success) {
          // Update main cards
          if (data.cards) {
            setCards(prevCards => {
              const newCardCount = data.cards.length;
              const currentCardCount = prevCards.length;

              // Update if we have new cards or if this is the first load
              if (newCardCount > currentCardCount || currentCardCount === 0) {
                // If we have cards now and were polling, stop polling
                if (newCardCount > 0 && pollingRef.current) {
                  clearInterval(pollingRef.current);
                  pollingRef.current = null;
                  hasStartedPollingRef.current = false;
                }
                return data.cards;
              }
              return prevCards; // No change
            });
          }

          // Update sub-recipe cards
          if (data.subRecipeCards) {
            setSubRecipeCards(data.subRecipeCards);
          }

          setLoading(false);

          // If we have no cards and haven't started polling yet, start polling
          // This handles the case where menu was just locked and cards are generating
          if (data.cards.length === 0 && !hasStartedPollingRef.current && !pollingRef.current) {
            logger.dev(
              '[RecipeCardsView] No cards found, starting polling for progressive loading',
            );
            hasStartedPollingRef.current = true;
            pollCount = 0;

            pollingRef.current = setInterval(() => {
              pollCount++;
              if (pollCount >= MAX_POLLS) {
                // Stop polling after max attempts
                if (pollingRef.current) {
                  clearInterval(pollingRef.current);
                  pollingRef.current = null;
                  hasStartedPollingRef.current = false;
                }
                return;
              }

              // Poll every 2 seconds to check for new cards
              fetchCards(true).catch(err => {
                logger.error('[RecipeCardsView] Polling error:', err);
              });
            }, 2000); // Poll every 2 seconds
          }
        } else {
          setError(data.error || 'Failed to load recipe cards');
          setLoading(false);
        }
      } catch (err) {
        logger.error('Error fetching recipe cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipe cards');
        setLoading(false);
      }
    }

    // Reset polling state when menuId changes
    hasStartedPollingRef.current = false;
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    fetchCards();

    // Cleanup: abort any pending requests and clear polling interval
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        hasStartedPollingRef.current = false;
      }
    };
  }, [menuId]); // Only depend on menuId to avoid infinite loops

  const handleGenerateCards = async () => {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      console.log(`[RecipeCardsView] [${requestId}] handleGenerateCards called`, {
        menuId,
        generating,
      });
      logger.dev(
        `[RecipeCardsView] [${requestId}] Starting recipe card generation for menu ${menuId}`,
      );

      setGenerating(true);
      setError(null);
      setLoading(true); // Show loading state while generating

      console.log(`[RecipeCardsView] [${requestId}] State updated, making API call...`);
      logger.dev(`[RecipeCardsView] [${requestId}] Making POST request to generate endpoint`);

      // Add client-side timeout (5 minutes max to match server timeout)
      const fetchTimeout = 5 * 60 * 1000; // 5 minutes
      const controller = new AbortController();
      abortControllerRef.current = controller; // Store ref so it survives Fast Refresh
      const timeoutId = setTimeout(() => {
        console.warn(`[RecipeCardsView] [${requestId}] Fetch timeout after 5 minutes, aborting...`);
        logger.warn(`[RecipeCardsView] [${requestId}] Client-side timeout triggered`);
        controller.abort();
      }, fetchTimeout);

      const fetchStartTime = Date.now();
      let response: Response;
      try {
        console.log(`[RecipeCardsView] [${requestId}] Initiating fetch...`);
        logger.dev(
          `[RecipeCardsView] [${requestId}] Fetch URL: /api/menus/${menuId}/recipe-cards/generate`,
        );

        response = await fetch(`/api/menus/${menuId}/recipe-cards/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const fetchDuration = Date.now() - fetchStartTime;
        console.log(
          `[RecipeCardsView] [${requestId}] Fetch completed in ${fetchDuration}ms, got response`,
          {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          },
        );
        logger.dev(`[RecipeCardsView] [${requestId}] Fetch completed in ${fetchDuration}ms`, {
          status: response.status,
          ok: response.ok,
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        const fetchDuration = Date.now() - fetchStartTime;
        console.error(
          `[RecipeCardsView] [${requestId}] Fetch failed after ${fetchDuration}ms:`,
          fetchError,
        );
        logger.error(
          `[RecipeCardsView] [${requestId}] Network error during fetch (${fetchDuration}ms):`,
          fetchError,
        );

        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error(
            'Request timed out after 5 minutes. The generation may still be running on the server. Please check server logs.',
          );
        }

        throw new Error(
          `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        );
      }

      logger.dev('[RecipeCardsView] Generation API response:', {
        status: response.status,
        ok: response.ok,
      });

      let data: any;
      try {
        const responseText = await response.text();
        console.log('[RecipeCardsView] Response text received:', responseText.substring(0, 200));
        data = JSON.parse(responseText);
        console.log('[RecipeCardsView] Parsed API response data:', data);
      } catch (parseError) {
        console.error('[RecipeCardsView] Failed to parse response:', parseError);
        logger.error('[RecipeCardsView] JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        logger.error('[RecipeCardsView] Generation failed:', {
          status: response.status,
          data,
        });
        const errorMsg =
          data.message || data.error || `Failed to generate recipe cards (${response.status})`;
        console.error('[RecipeCardsView] Generation error:', errorMsg);
        throw new Error(errorMsg);
      }

      logger.dev('[RecipeCardsView] Generation successful, refreshing cards...');
      console.log('[RecipeCardsView] Generation successful, will refresh in 2 seconds...');
      showSuccess('Recipe cards generated successfully! Loading cards...');

      // Refresh cards instead of reloading the page
      // Fetch cards again after a short delay to allow database to update
      setTimeout(async () => {
        try {
          console.log('[RecipeCardsView] Refreshing cards...');
          const refreshResponse = await fetch(`/api/menus/${menuId}/recipe-cards`);
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            console.log('[RecipeCardsView] Refresh response:', {
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
              setLoading(false);
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
                  '1. AI service is not configured (check GEMINI_API_KEY)\n' +
                  '2. Menu items have no ingredients\n' +
                  '3. Generation failed silently - check server logs';
                console.warn('[RecipeCardsView]', noCardsError);
                setError(noCardsError);
              } else {
                console.log(
                  `[RecipeCardsView] Successfully loaded ${refreshData.cards.length} recipe cards`,
                );
              }
            } else {
              const loadError = refreshData.error || 'Failed to load generated cards';
              console.error('[RecipeCardsView]', loadError);
              setError(loadError);
              setLoading(false);
            }
          } else {
            const refreshError = 'Failed to refresh recipe cards';
            console.error('[RecipeCardsView]', refreshError, response.status);
            setError(refreshError);
            setLoading(false);
          }
        } catch (refreshErr) {
          logger.error('[RecipeCardsView] Error refreshing cards:', refreshErr);
          console.error('[RecipeCardsView] Refresh error:', refreshErr);
          setError('Generated successfully but failed to refresh. Please reload the page.');
          setLoading(false);
        }
      }, 2000); // Wait 2 seconds for generation to complete
    } catch (err) {
      logger.error('[RecipeCardsView] Error generating recipe cards:', err);
      console.error('[RecipeCardsView] Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recipe cards';
      showError(errorMessage);
      setError(errorMessage);
      setLoading(false);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#29E7CD]" />
        <p className="mt-4 text-sm text-gray-400">
          {generating
            ? 'Generating recipe cards... This may take 2-3 minutes for large menus.'
            : 'Loading recipe cards...'}
        </p>
        {generating && (
          <p className="mt-2 text-xs text-gray-500">
            Processing menu items with AI. Please wait...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
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
    logger.dev('[RecipeCardsView] Rendering empty state', {
      menuId,
      loading,
      generating,
      error,
    });
    console.log('[RecipeCardsView] Rendering empty state', {
      menuId,
      loading,
      generating,
      error,
      hasError: !!error,
    });

    const isGeneratingInBackground = pollingRef.current !== null;

    return (
      <div className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
        {isGeneratingInBackground ? (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#29E7CD]" />
            <p className="mt-4 text-gray-400">
              Recipe cards are being generated in the background...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Cards will appear automatically as they're ready. This typically takes 30-40 seconds
              with parallel processing.
            </p>
            <p className="mt-2 text-xs text-gray-600">
              ⚡ Using parallel batch processing for faster generation
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-400">No recipe cards generated yet.</p>
            <p className="mt-2 mb-6 text-sm text-gray-500">
              Recipe cards (including sub-recipes like sauces, marinades, and brines) are
              automatically generated when a menu is locked. You can also generate them manually
              below.
            </p>
            <p className="mb-6 text-xs text-gray-600">
              ⏱️ Generation typically takes 30-40 seconds with parallel processing (was 2-3
              minutes).
            </p>
          </>
        )}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            logger.dev('[RecipeCardsView] Generate button clicked!', { menuId, generating });
            console.log('[RecipeCardsView] Button clicked!', {
              menuId,
              generating,
              timestamp: new Date().toISOString(),
            });
            if (!generating) {
              console.log('[RecipeCardsView] Calling handleGenerateCards...');
              handleGenerateCards().catch(err => {
                console.error('[RecipeCardsView] Error in handleGenerateCards:', err);
                logger.error('[RecipeCardsView] Unhandled error in handleGenerateCards:', err);
              });
            } else {
              console.log('[RecipeCardsView] Already generating, ignoring click');
            }
          }}
          disabled={generating || loading}
          className="mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Generate recipe cards for this menu"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Recipe Cards
            </>
          )}
        </button>
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-left">
            <p className="text-sm font-semibold text-red-400">Error:</p>
            <p className="mt-2 text-sm whitespace-pre-line text-red-300">{error}</p>
            <p className="mt-2 text-xs text-gray-500">
              Check the browser console (F12) for more details.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3">
          <p className="text-xs text-gray-300">
            <strong className="text-[#29E7CD]">Recipe Cards:</strong> All ingredients are normalized
            to 1 serving. Use the prep quantity input on each card to scale ingredients for your
            desired batch size.
          </p>
        </div>
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            logger.dev('[RecipeCardsView] Regenerate button clicked!', { menuId, generating });
            console.log('[RecipeCardsView] Regenerate button clicked!', {
              menuId,
              generating,
              timestamp: new Date().toISOString(),
            });
            if (!generating) {
              console.log('[RecipeCardsView] Calling handleGenerateCards...');
              handleGenerateCards().catch(err => {
                console.error('[RecipeCardsView] Error in handleGenerateCards:', err);
                logger.error('[RecipeCardsView] Unhandled error in handleGenerateCards:', err);
              });
            } else {
              console.log('[RecipeCardsView] Already generating, ignoring click');
            }
          }}
          disabled={generating || loading}
          className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm font-semibold text-red-400">Error:</p>
          <p className="mt-2 text-sm whitespace-pre-line text-red-300">{error}</p>
        </div>
      )}

      <div className="relative">
        {/* Main Recipe Cards Section */}
        {cards.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-white">Main Recipe Cards</h2>
            <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
              {cards.map(card => (
                <RecipeCard
                  key={`main-${card.id}`}
                  id={card.id}
                  title={card.title}
                  baseYield={card.baseYield}
                  ingredients={card.ingredients}
                  methodSteps={card.methodSteps}
                  notes={card.notes}
                  isExpanded={expandedCardId === card.id}
                  onClick={() => {
                    if (expandedCardId === card.id) {
                      setExpandedCardId(null);
                    } else {
                      setExpandedCardId(card.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sub-Recipe Cards Sections */}
        {(subRecipeCards.sauces.length > 0 ||
          subRecipeCards.marinades.length > 0 ||
          subRecipeCards.brines.length > 0 ||
          subRecipeCards.slowCooked.length > 0 ||
          subRecipeCards.other.length > 0) && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-white">Sub-Recipes & Prep Items</h2>

            {/* Sauces & Dressings */}
            {subRecipeCards.sauces.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Sauces & Dressings</h3>
                <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
                  {subRecipeCards.sauces.map(card => (
                    <RecipeCard
                      key={`sauce-${card.id}`}
                      id={card.id}
                      title={card.title}
                      baseYield={card.baseYield}
                      ingredients={card.ingredients}
                      methodSteps={card.methodSteps}
                      notes={card.notes}
                      usedByMenuItems={card.usedByMenuItems}
                      isExpanded={expandedCardId === card.id}
                      onClick={() => {
                        if (expandedCardId === card.id) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(card.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Marinades */}
            {subRecipeCards.marinades.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Marinades</h3>
                <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
                  {subRecipeCards.marinades.map(card => (
                    <RecipeCard
                      key={`marinade-${card.id}`}
                      id={card.id}
                      title={card.title}
                      baseYield={card.baseYield}
                      ingredients={card.ingredients}
                      methodSteps={card.methodSteps}
                      notes={card.notes}
                      usedByMenuItems={card.usedByMenuItems}
                      isExpanded={expandedCardId === card.id}
                      onClick={() => {
                        if (expandedCardId === card.id) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(card.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Brines */}
            {subRecipeCards.brines.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Brines</h3>
                <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
                  {subRecipeCards.brines.map(card => (
                    <RecipeCard
                      key={`brine-${card.id}`}
                      id={card.id}
                      title={card.title}
                      baseYield={card.baseYield}
                      ingredients={card.ingredients}
                      methodSteps={card.methodSteps}
                      notes={card.notes}
                      usedByMenuItems={card.usedByMenuItems}
                      isExpanded={expandedCardId === card.id}
                      onClick={() => {
                        if (expandedCardId === card.id) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(card.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Slow-Cooked Items */}
            {subRecipeCards.slowCooked.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Slow-Cooked Items</h3>
                <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
                  {subRecipeCards.slowCooked.map(card => (
                    <RecipeCard
                      key={`slow-cooked-${card.id}`}
                      id={card.id}
                      title={card.title}
                      baseYield={card.baseYield}
                      ingredients={card.ingredients}
                      methodSteps={card.methodSteps}
                      notes={card.notes}
                      usedByMenuItems={card.usedByMenuItems}
                      isExpanded={expandedCardId === card.id}
                      onClick={() => {
                        if (expandedCardId === card.id) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(card.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Prep Items */}
            {subRecipeCards.other.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Other Prep Items</h3>
                <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
                  {subRecipeCards.other.map(card => (
                    <RecipeCard
                      key={`other-${card.id}`}
                      id={card.id}
                      title={card.title}
                      baseYield={card.baseYield}
                      ingredients={card.ingredients}
                      methodSteps={card.methodSteps}
                      notes={card.notes}
                      usedByMenuItems={card.usedByMenuItems}
                      isExpanded={expandedCardId === card.id}
                      onClick={() => {
                        if (expandedCardId === card.id) {
                          setExpandedCardId(null);
                        } else {
                          setExpandedCardId(card.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
