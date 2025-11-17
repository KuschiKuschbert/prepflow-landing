'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { MenuItem } from '../types';

interface MenuItemHoverStatisticsProps {
  item: MenuItem;
  menuId: string;
  isVisible: boolean;
  position: 'top' | 'bottom';
  mousePosition?: { x: number; y: number };
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
}: MenuItemHoverStatisticsProps) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Check cache first
      const cacheKey = `${menuId}-${item.id}`;
      const cached = statisticsCache.get(cacheKey);
      const now = Date.now();

      if (cached && now < cached.expiry) {
        // Use cached data immediately
        setStatistics(cached.data);
        setLoading(false);
      } else if (!statistics && !loading) {
        // Reduced delay for faster response
        hoverTimeoutRef.current = setTimeout(() => {
          loadStatistics();
        }, 100);
      }

      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Don't clear statistics - keep cached data for next hover
    }
  }, [isVisible, statistics, loading, menuId, item.id, loadStatistics]);

  const loadStatistics = useCallback(async () => {
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
      const result = await response.json();

      if (response.ok && result.success) {
        setStatistics(result.statistics);
        // Cache the result
        statisticsCache.set(cacheKey, {
          data: result.statistics,
          timestamp: now,
          expiry: now + CACHE_EXPIRY_MS,
        });
      } else {
        setError(result.error || result.message || 'Failed to load statistics');
      }
    } catch (err) {
      logger.error('Failed to load item statistics:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [menuId, item.id]);

  // Calculate tooltip position based on cursor
  useEffect(() => {
    if (!isVisible || !mousePosition) return;

    const updatePosition = () => {
      if (!mousePosition) return;

      const tooltipWidth = 256; // w-64 = 256px
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200; // Estimate if not rendered
      const offset = 12; // Distance from cursor

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Default: position top-right of cursor
      let left = mousePosition.x + offset;
      let top = mousePosition.y - tooltipHeight - offset;

      // Boundary detection: adjust if near edges
      if (left + tooltipWidth > viewportWidth - 8) {
        // Near right edge - position left of cursor
        left = mousePosition.x - tooltipWidth - offset;
      }
      if (left < 8) {
        // Too far left - align to left edge with padding
        left = 8;
      }

      if (top < 8) {
        // Near top - position below cursor
        top = mousePosition.y + offset;
      }
      if (top + tooltipHeight > viewportHeight - 8) {
        // Near bottom - position above cursor (but ensure it doesn't go above viewport)
        top = Math.max(8, mousePosition.y - tooltipHeight - offset);
      }

      setTooltipPosition({
        left: left,
        top: top,
      });
    };

    updatePosition();
    // Update on window resize
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, mousePosition]);

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-auto fixed z-[60] w-64 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-xl transition-all duration-150 ease-out"
      style={{
        animation: 'fadeInUp 0.2s ease-out forwards',
        ...tooltipPosition,
      }}
      role="tooltip"
      onMouseEnter={e => {
        e.stopPropagation();
        // Keep tooltip visible when hovering over it
      }}
      onMouseLeave={e => {
        e.stopPropagation();
      }}
    >
      {loading && (
        <div className="animate-pulse text-xs text-gray-400 transition-opacity duration-200">
          Loading statistics...
        </div>
      )}
      {error && <div className="text-xs text-red-400 transition-opacity duration-200">{error}</div>}
      {statistics && !loading && !error && (
        <div className="space-y-3 transition-opacity duration-200">
          {/* Recommended Price Section */}
          {statistics.recommended_selling_price != null && (
            <div className="border-b border-[#2a2a2a] pb-2">
              <div className="text-xs text-gray-400">Recommended Price</div>
              <div className="text-sm font-semibold text-[#29E7CD]">
                ${statistics.recommended_selling_price.toFixed(2)}
              </div>
            </div>
          )}

          {/* Show calculation breakdown when no actual price */}
          {statistics.actual_selling_price == null &&
            statistics.recommended_selling_price != null && (
              <div className="rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-2">
                <div className="mb-1 text-xs font-medium text-[#29E7CD]">
                  Projected Calculations
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>COGS:</span>
                    <span className="font-medium">${statistics.cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Profit (70%):</span>
                    <span className="font-medium text-[#29E7CD]">
                      ${(statistics.recommended_selling_price - statistics.cogs).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#2a2a2a] pt-1">
                    <span>Recommended Price:</span>
                    <span className="font-semibold text-[#29E7CD]">
                      ${statistics.recommended_selling_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
        </div>
      )}
    </div>
  );
}
