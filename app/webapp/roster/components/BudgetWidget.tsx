/**
 * BudgetWidget Component
 * Compact floating widget displaying essential roster budget metrics.
 * Positioned in the left corner, independent of sidebar.
 *
 * @component
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { DollarSign, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateRosterBudget, formatCurrency } from '@/lib/services/payroll/calculator';
import type { Shift, Employee, RosterBudget } from '../types';

interface BudgetWidgetProps {
  shifts: Shift[];
  employees: Employee[];
  forecastRevenue?: number | null;
  sidebarCollapsed?: boolean;
}

/**
 * BudgetWidget component for displaying compact roster budget information.
 *
 * @param {BudgetWidgetProps} props - Component props
 * @returns {JSX.Element} Rendered budget widget
 */
export function BudgetWidget({
  shifts,
  employees,
  forecastRevenue,
  sidebarCollapsed = false,
}: BudgetWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSidebarCollapsed, setCurrentSidebarCollapsed] = useState(sidebarCollapsed);

  const budget: RosterBudget = useMemo(() => {
    return calculateRosterBudget(shifts, employees, forecastRevenue || null);
  }, [shifts, employees, forecastRevenue]);

  const isOverBudget = budget.laborCostPercentage && budget.laborCostPercentage > 30; // 30% labor cost threshold
  const isUnderBudget = budget.laborCostPercentage && budget.laborCostPercentage < 20; // 20% labor cost threshold

  // Track sidebar collapsed state from localStorage and custom events
  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebar-collapsed');
        setCurrentSidebarCollapsed(saved === 'true');
      }
    };
    checkSidebarState();

    // Listen for custom sidebar-toggle event (immediate update)
    const handleSidebarToggle = ((e: CustomEvent) => {
      setCurrentSidebarCollapsed(e.detail.collapsed);
    }) as EventListener;
    window.addEventListener('sidebar-toggle', handleSidebarToggle);

    // Listen for storage changes (when sidebar is toggled in another tab)
    window.addEventListener('storage', checkSidebarState);

    // Also check periodically (fallback for same-tab changes)
    const interval = setInterval(checkSidebarState, 500);
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('storage', checkSidebarState);
      clearInterval(interval);
    };
  }, []);

  // Calculate left position based on sidebar state
  const leftPosition = currentSidebarCollapsed ? 'calc(64px + 1rem)' : 'calc(320px + 1rem)';

  return (
    <div className="desktop:block fixed bottom-4 z-30 hidden" style={{ left: leftPosition }}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        {/* Compact Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between gap-3 rounded-t-2xl border-b border-[var(--border)] bg-[var(--surface)] p-3 transition-colors hover:bg-[var(--muted)]/50"
          aria-label={isExpanded ? 'Collapse budget widget' : 'Expand budget widget'}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <Icon icon={DollarSign} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
            <div className="text-left">
              <div className="text-xs text-[var(--foreground-muted)]">Total Cost</div>
              <div className="text-lg font-bold text-[var(--foreground)]">{formatCurrency(budget.totalCost)}</div>
            </div>
          </div>
          {budget.laborCostPercentage !== null && (
            <div className="flex items-center gap-2">
              <div
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                  isOverBudget
                    ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                    : isUnderBudget
                      ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                      : 'bg-[var(--muted)] text-[var(--foreground-secondary)]'
                }`}
              >
                {budget.laborCostPercentage?.toFixed(1) ?? '0.0'}%
              </div>
              <Icon
                icon={isExpanded ? ChevronUp : ChevronDown}
                size="xs"
                className="text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
            </div>
          )}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-2 p-3">
            {/* Labor Cost % */}
            {budget.laborCostPercentage !== null && (
              <div
                className={`rounded-lg border p-3 ${
                  isOverBudget
                    ? 'border-[var(--color-error)]/50 bg-[var(--color-error)]/10'
                    : isUnderBudget
                      ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/10'
                      : 'border-[var(--border)] bg-[var(--muted)]/30'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs text-[var(--foreground-muted)]">Labor Cost %</span>
                  {isOverBudget && (
                    <Icon icon={TrendingUp} size="xs" className="text-[var(--color-error)]" aria-hidden={true} />
                  )}
                  {isUnderBudget && (
                    <Icon
                      icon={TrendingDown}
                      size="xs"
                      className="text-[var(--color-success)]"
                      aria-hidden={true}
                    />
                  )}
                </div>
                <div
                  className={`text-xl font-bold ${isOverBudget ? 'text-[var(--color-error)]' : isUnderBudget ? 'text-[var(--color-success)]' : 'text-[var(--foreground)]'}`}
                >
                  {budget.laborCostPercentage?.toFixed(1) ?? '0.0'}%
                </div>
              </div>
            )}

            {/* Total Shifts */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2">
              <div className="text-xs text-[var(--foreground-muted)]">Shifts</div>
              <div className="text-lg font-semibold text-[var(--foreground)]">{budget.totalShifts}</div>
            </div>

            {/* Forecast Revenue (if available) */}
            {forecastRevenue && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2">
                <div className="text-xs text-[var(--foreground-muted)]">Net Profit</div>
                <div
                  className={`text-lg font-semibold ${forecastRevenue - budget.totalCost >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
                >
                  {formatCurrency(forecastRevenue - budget.totalCost)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
