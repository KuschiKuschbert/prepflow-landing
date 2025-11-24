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
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
        }}
      >
        Add Dish
      </button>
      <Link
        href="/webapp/menu-builder"
        className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-3 font-medium text-white transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a] hover:shadow-lg"
      >
        <Icon icon={FileText} size="sm" />
        <span>Menu Builder</span>
      </Link>
    </div>
  );
}
