'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LANDING_COLORS } from '@/lib/landing-styles';

interface DishesActionButtonsProps {
  onAddDish: () => void;
}

export function DishesActionButtons({ onAddDish }: DishesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button
        onClick={onAddDish}
        className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
        }}
      >
        Add Dish
      </button>
      <Link
        href="/webapp/recipes#menu-builder"
        className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-medium text-[var(--foreground)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--muted)] hover:shadow-lg"
      >
        <Icon icon={FileText} size="sm" />
        <span>Menu Builder</span>
      </Link>
    </div>
  );
}
