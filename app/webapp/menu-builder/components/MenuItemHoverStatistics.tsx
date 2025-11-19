'use client';

import { logger } from '@/lib/logger';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem } from '../types';

interface MenuItemHoverStatisticsProps {
  item: MenuItem;
  menuId: string;
  isVisible: boolean;
  position: 'top' | 'bottom';
  mousePosition?: { x: number; y: number };
  anchorElement?: HTMLElement | null; // Menu item element for positioning
}

interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
}

// Cache for statistics (5 minute expiry)
const statisticsCache = new Map<
  string,
  { data: ItemStatistics; timestamp: number; expiry: number }
>();

const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export function MenuItemHoverStatistics({
  item,
  menuId,
  isVisible,
  position = 'top',
  mousePosition,
  anchorElement,
}: MenuItemHoverStatisticsProps) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadStatistics = useCallback(
    async (retryCount = 0) => {
      const cacheKey = `${menuId}-${item.id}`;
      const cached = statisticsCache.get(cacheKey);
      const now = Date.now();

      // Use cache if valid
      if (cached && now < cached.expiry) {
        setStatistics(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/menus/${menuId}/items/${item.id}/statistics`);

        if (!response.ok) {
          // Handle 404 errors with retry logic (may be transient Next.js routing issue)
          if (response.status === 404) {
            if (retryCount < 1) {
              // Retry once after a short delay (exponential backoff)
              logger.dev(
                '[MenuItemHoverStatistics] Statistics endpoint not found (404), retrying...',
                {
                  menuId,
                  itemId: item.id,
                  retryCount,
                },
              );
              setTimeout(() => {
                loadStatistics(retryCount + 1);
              }, 500);
              return;
            }
            // After retry, suppress error to avoid console spam
            logger.dev('[MenuItemHoverStatistics] Statistics endpoint not found after retry, skipping', {
              menuId,
              itemId: item.id,
            });
            setLoading(false);
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || errorData.message || 'Failed to load statistics');
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (result.success) {
          logger.dev('[MenuItemHoverStatistics] Statistics loaded successfully', {
            cacheKey,
            statistics: result.statistics,
            hasRecommendedPrice: result.statistics?.recommended_selling_price != null,
            hasActualPrice: result.statistics?.actual_selling_price != null,
            sellingPrice: result.statistics?.selling_price,
          });
          setStatistics(result.statistics);
          // Cache the result
          statisticsCache.set(cacheKey, {
            data: result.statistics,
            timestamp: now,
            expiry: now + CACHE_EXPIRY_MS,
          });
        } else {
          logger.error('[MenuItemHoverStatistics] Statistics API returned error', {
            cacheKey,
            error: result.error || result.message,
          });
          setError(result.error || result.message || 'Failed to load statistics');
        }
      } catch (err) {
        logger.error('Failed to load item statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    },
    [menuId, item.id],
  );

  // Clear statistics immediately when item changes (switching between items)
  useEffect(() => {
    if (currentItemId !== null && currentItemId !== item.id) {
      // Item changed - clear old statistics immediately
      setStatistics(null);
      setError(null);
      setLoading(false);
      // Clear any pending timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
    setCurrentItemId(item.id);
  }, [item.id]);

  useEffect(() => {
    if (isVisible) {
      logger.dev('[MenuItemHoverStatistics] Tooltip visible, loading statistics', {
        menuId,
        itemId: item.id,
        itemName: item.dishes?.dish_name || item.recipes?.recipe_name || 'Unknown',
      });

      // Clear any previous timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Check cache first for THIS specific item
      const cacheKey = `${menuId}-${item.id}`;
      const cached = statisticsCache.get(cacheKey);
      const now = Date.now();

      if (cached && now < cached.expiry) {
        // Use cached data immediately for this item
        logger.dev('[MenuItemHoverStatistics] Using cached statistics', {
          cacheKey,
          statistics: cached.data,
        });
        setStatistics(cached.data);
        setLoading(false);
        setError(null);
      } else {
        // Ensure we're showing loading state for this item
        // Don't clear statistics here - let the item change effect handle it
        setLoading(true);
        setError(null);
        logger.dev('[MenuItemHoverStatistics] Fetching fresh statistics', { cacheKey });
        // Reduced delay for faster response
        hoverTimeoutRef.current = setTimeout(() => {
          loadStatistics();
        }, 100);
      }

      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      };
    } else {
      // Tooltip hidden - clear timeout but keep statistics cached
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
  }, [isVisible, menuId, item.id, loadStatistics]);

  // Track mouse position globally and update tooltip position in real-time
  useEffect(() => {
    if (!isVisible) {
      setTooltipPosition({});
      return;
    }

    let currentPos = mousePosition;

    const updatePosition = (pos?: { x: number; y: number }) => {
      const position = pos || currentPos || mousePosition;
      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return;
      }

      const tooltipWidth = 256; // w-64 = 256px
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const padding = 8;
      const offset = 12; // Small offset from cursor

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Position tooltip to the right of cursor, vertically centered
      let left = position.x + offset;
      let top = position.y - tooltipHeight / 2;

      // Boundary detection
      if (left + tooltipWidth > viewportWidth - padding) {
        // Position left of cursor instead
        left = position.x - tooltipWidth - offset;
      }

      if (left < padding) {
        left = padding;
      }

      if (top < padding) {
        top = position.y + offset;
      }

      if (top + tooltipHeight > viewportHeight - padding) {
        top = position.y - tooltipHeight - offset;
        if (top < padding) {
          top = padding;
        }
      }

      setTooltipPosition({
        left: left,
        top: top,
      });
    };

    // Global mouse move handler for continuous tracking
    const handleGlobalMouseMove = (e: MouseEvent) => {
      currentPos = { x: e.clientX, y: e.clientY };
      updatePosition(currentPos);
    };

    // Initial position update
    if (mousePosition) {
      updatePosition();
    }

    // Track mouse movement globally for smooth following
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('resize', () => updatePosition());
    window.addEventListener('scroll', () => updatePosition(), true);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('resize', () => updatePosition());
      window.removeEventListener('scroll', () => updatePosition(), true);
    };
  }, [isVisible, mousePosition]);

  if (!isVisible) return null;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-[60] w-64 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-xl"
      style={{
        left: tooltipPosition.left !== undefined ? `${tooltipPosition.left}px` : undefined,
        top: tooltipPosition.top !== undefined ? `${tooltipPosition.top}px` : undefined,
        animation: 'fadeInUp 0.2s ease-out forwards',
      }}
      role="tooltip"
    >
      {loading && (
        <div className="animate-pulse text-xs text-gray-400 transition-opacity duration-200">
          Loading statistics...
        </div>
      )}
      {error && <div className="text-xs text-red-400 transition-opacity duration-200">{error}</div>}
      {statistics && !loading && !error && (
        <div className="space-y-3 transition-opacity duration-200">
          {/* Show the price being used for calculations in the header */}
          {statistics.actual_selling_price != null ? (
            /* Actual price exists - show actual price in header, recommended as reference */
            <>
              <div className="mb-2 border-b border-[#2a2a2a] pb-2">
                <div className="text-xs text-gray-400">Selling Price</div>
                <div className="text-sm font-semibold text-white">
                  ${statistics.actual_selling_price.toFixed(2)}
                </div>
                {statistics.recommended_selling_price != null &&
                  Math.abs(statistics.actual_selling_price - statistics.recommended_selling_price) >
                    0.01 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Recommended: ${statistics.recommended_selling_price.toFixed(2)}
                    </div>
                  )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-400">COGS</div>
                  <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Revenue</div>
                  <div className="font-medium text-white">${statistics.selling_price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Gross Profit</div>
                  <div
                    className={`font-medium ${statistics.gross_profit >= 0 ? 'text-[#29E7CD]' : 'text-red-400'}`}
                  >
                    ${statistics.gross_profit.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Profit Margin</div>
                  <div
                    className={`font-medium ${statistics.gross_profit_margin >= 0 ? 'text-[#29E7CD]' : 'text-red-400'}`}
                  >
                    {statistics.gross_profit_margin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </>
          ) : statistics.recommended_selling_price != null ? (
            /* No actual price - show recommended price (projected) in header */
            <>
              <div className="mb-2 rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-2">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="text-xs font-medium text-[#29E7CD]">Recommended Price</div>
                  <div className="text-xs text-gray-400">(Projected)</div>
                </div>
                <div className="text-sm font-semibold text-[#29E7CD]">
                  ${statistics.recommended_selling_price.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-400">COGS</div>
                  <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Revenue</div>
                  <div className="font-medium text-white">
                    ${statistics.recommended_selling_price.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Gross Profit</div>
                  <div
                    className={`font-medium ${
                      statistics.recommended_selling_price - statistics.cogs >= 0
                        ? 'text-[#29E7CD]'
                        : 'text-red-400'
                    }`}
                  >
                    ${(statistics.recommended_selling_price - statistics.cogs).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Profit Margin</div>
                  <div
                    className={`font-medium ${
                      statistics.recommended_selling_price > 0 &&
                      (statistics.recommended_selling_price - statistics.cogs) / statistics.recommended_selling_price >= 0
                        ? 'text-[#29E7CD]'
                        : 'text-red-400'
                    }`}
                  >
                    {statistics.recommended_selling_price > 0
                      ? (
                          ((statistics.recommended_selling_price - statistics.cogs) /
                            statistics.recommended_selling_price) *
                          100
                        ).toFixed(1)
                      : '0.0'}
                    %
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No price available - show basic stats */
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-400">COGS</div>
                <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Revenue</div>
                <div className="font-medium text-white">${statistics.selling_price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Gross Profit</div>
                <div
                  className={`font-medium ${statistics.gross_profit >= 0 ? 'text-[#29E7CD]' : 'text-red-400'}`}
                >
                  ${statistics.gross_profit.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Profit Margin</div>
                <div
                  className={`font-medium ${statistics.gross_profit_margin >= 0 ? 'text-[#29E7CD]' : 'text-red-400'}`}
                >
                  {statistics.gross_profit_margin.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render tooltip in portal to avoid transform/positioning context issues
  // This ensures fixed positioning works correctly regardless of parent transforms
  if (typeof window !== 'undefined') {
    return createPortal(tooltipContent, document.body);
  }

  return null;
}
