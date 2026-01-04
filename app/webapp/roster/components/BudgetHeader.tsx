/**
 * BudgetHeader Component
 * Displays live cost calculations for the roster.
 *
 * @component
 */

'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  calculateRosterBudget,
  formatCurrency,
  formatHours,
} from '@/lib/services/payroll/calculator';
import type { Shift, Employee, RosterBudget } from '../types';

interface BudgetHeaderProps {
  shifts: Shift[];
  employees: Employee[];
  forecastRevenue?: number | null;
}

/**
 * BudgetHeader component for displaying roster budget information.
 *
 * @param {BudgetHeaderProps} props - Component props
 * @returns {JSX.Element} Rendered budget header
 */
export function BudgetHeader({ shifts, employees, forecastRevenue }: BudgetHeaderProps) {
  const budget: RosterBudget = useMemo(() => {
    return calculateRosterBudget(shifts, employees, forecastRevenue || null);
  }, [shifts, employees, forecastRevenue]);

  const isOverBudget = budget.laborCostPercentage && budget.laborCostPercentage > 30; // 30% labor cost threshold
  const isUnderBudget = budget.laborCostPercentage && budget.laborCostPercentage < 20; // 20% labor cost threshold

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Roster Budget</h3>
        <Icon icon={DollarSign} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
      </div>

      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
        {/* Total Shifts */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <div className="mb-1 text-xs text-[var(--foreground-muted)]">Total Shifts</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{budget.totalShifts}</div>
        </div>

        {/* Total Hours */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <div className="mb-1 text-xs text-[var(--foreground-muted)]">Total Hours</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {formatHours(budget.totalHours)}
          </div>
        </div>

        {/* Total Cost */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <div className="mb-1 text-xs text-[var(--foreground-muted)]">Total Cost</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {formatCurrency(budget.totalCost)}
          </div>
        </div>

        {/* Labor Cost % */}
        {budget.laborCostPercentage !== null && (
          <div
            className={`rounded-2xl border p-4 ${
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
                <Icon
                  icon={TrendingUp}
                  size="sm"
                  className="text-[var(--color-error)]"
                  aria-hidden={true}
                />
              )}
              {isUnderBudget && (
                <Icon
                  icon={TrendingDown}
                  size="sm"
                  className="text-[var(--color-success)]"
                  aria-hidden={true}
                />
              )}
            </div>
            <div
              className={`text-2xl font-bold ${isOverBudget ? 'text-[var(--color-error)]' : isUnderBudget ? 'text-[var(--color-success)]' : 'text-[var(--foreground)]'}`}
            >
              {budget.laborCostPercentage?.toFixed(1) ?? '0.0'}%
            </div>
          </div>
        )}
      </div>

      {/* Forecast Revenue Comparison */}
      {forecastRevenue && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[var(--foreground-muted)]">Forecast Revenue</div>
              <div className="text-xl font-semibold text-[var(--foreground)]">
                {formatCurrency(forecastRevenue)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--foreground-muted)]">Net Profit</div>
              <div
                className={`text-xl font-semibold ${forecastRevenue - budget.totalCost >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
              >
                {formatCurrency(forecastRevenue - budget.totalCost)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
