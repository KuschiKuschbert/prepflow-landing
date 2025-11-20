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
const statisticsCache = new Map<
  string,
  { data: ItemStatistics; timestamp: number; expiry: number }
>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000;
function StatisticsGrid({ statistics }: { statistics: ItemStatistics }) {
  const profitColor = (value: number) => (value >= 0 ? 'text-[#29E7CD]' : 'text-red-400');
  return (
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
        <div className={`font-medium ${profitColor(statistics.gross_profit)}`}>
          ${statistics.gross_profit.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-400">Profit Margin</div>
        <div className={`font-medium ${profitColor(statistics.gross_profit_margin)}`}>
          {statistics.gross_profit_margin.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
function RecommendedPriceGrid({ statistics }: { statistics: ItemStatistics }) {
  const profit = statistics.recommended_selling_price! - statistics.cogs;
  const margin =
    statistics.recommended_selling_price! > 0
      ? (profit / statistics.recommended_selling_price!) * 100
      : 0;
  const profitColor = profit >= 0 ? 'text-[#29E7CD]' : 'text-red-400';
  const marginColor = margin >= 0 ? 'text-[#29E7CD]' : 'text-red-400';
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-gray-400">COGS</div>
        <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Revenue</div>
        <div className="font-medium text-white">
          ${statistics.recommended_selling_price!.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-400">Gross Profit</div>
        <div className={`font-medium ${profitColor}`}>${profit.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Profit Margin</div>
        <div className={`font-medium ${marginColor}`}>{margin.toFixed(1)}%</div>
      </div>
    </div>
  );
}
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
      if (cached && now < cached.expiry) {
        setStatistics(cached.data);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menus/${menuId}/items/${item.id}/statistics`);
        if (!response.ok) {
          if (response.status === 404) {
            if (retryCount < 1) {
              logger.dev('[MenuItemHoverStatistics] 404, retrying...', { menuId, itemId: item.id });
              setTimeout(() => loadStatistics(retryCount + 1), 500);
              return;
            }
            logger.dev('[MenuItemHoverStatistics] 404 after retry, skipping', {
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
          logger.dev('[MenuItemHoverStatistics] Statistics loaded', { cacheKey });
          setStatistics(result.statistics);
          statisticsCache.set(cacheKey, {
            data: result.statistics,
            timestamp: now,
            expiry: now + CACHE_EXPIRY_MS,
          });
        } else {
          logger.error('[MenuItemHoverStatistics] API error', {
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
  useEffect(() => {
    if (currentItemId !== null && currentItemId !== item.id) {
      setStatistics(null);
      setError(null);
      setLoading(false);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
    setCurrentItemId(item.id);
  }, [item.id, currentItemId]);
  useEffect(() => {
    if (isVisible) {
      logger.dev('[MenuItemHoverStatistics] Loading statistics', { menuId, itemId: item.id });
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      const cacheKey = `${menuId}-${item.id}`;
      const cached = statisticsCache.get(cacheKey);
      const now = Date.now();
      if (cached && now < cached.expiry) {
        setStatistics(cached.data);
        setLoading(false);
        setError(null);
      } else {
        setLoading(true);
        setError(null);
        hoverTimeoutRef.current = setTimeout(() => loadStatistics(), 100);
      }
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      };
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
  }, [
    isVisible,
    menuId,
    item.id,
    item.dishes?.dish_name,
    item.recipes?.recipe_name,
    loadStatistics,
  ]);
  useEffect(() => {
    if (!isVisible) {
      setTooltipPosition({});
      return;
    }

    let currentPos = mousePosition;
    const updatePosition = (pos?: { x: number; y: number }) => {
      const position = pos || currentPos || mousePosition;
      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') return;
      const tooltipWidth = 256;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const padding = 8;
      const offset = 12;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let left = position.x + offset;
      let top = position.y - tooltipHeight / 2;
      if (left + tooltipWidth > viewportWidth - padding) {
        left = position.x - tooltipWidth - offset;
      }
      if (left < padding) left = padding;
      if (top < padding) top = position.y + offset;
      if (top + tooltipHeight > viewportHeight - padding) {
        top = position.y - tooltipHeight - offset;
        if (top < padding) top = padding;
      }
      setTooltipPosition({ left, top });
    };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      currentPos = { x: e.clientX, y: e.clientY };
      updatePosition(currentPos);
    };
    if (mousePosition) updatePosition();
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
          {statistics.actual_selling_price != null ? (
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
              <StatisticsGrid statistics={statistics} />
            </>
          ) : statistics.recommended_selling_price != null ? (
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
              <RecommendedPriceGrid statistics={statistics} />
            </>
          ) : (
            <StatisticsGrid statistics={statistics} />
          )}
        </div>
      )}
    </div>
  );
  if (typeof window !== 'undefined') {
    return createPortal(tooltipContent, document.body);
  }
  return null;
}
