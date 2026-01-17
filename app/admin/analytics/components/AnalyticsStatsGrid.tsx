import { Icon } from '@/components/ui/Icon';
import { Activity, BarChart3, TrendingUp, Users } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalIngredients: number;
  totalRecipes: number;
  totalDishes: number;
}

interface AnalyticsStatsGridProps {
  data: AnalyticsData | null;
}

export function AnalyticsStatsGrid({ data }: AnalyticsStatsGridProps) {
  return (
    <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Total Users</h3>
          <Icon icon={Users} size="md" className="text-[#29E7CD]" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.totalUsers || 0}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Active Users</h3>
          <Icon icon={Activity} size="md" className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.activeUsers || 0}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Total Ingredients</h3>
          <Icon icon={BarChart3} size="md" className="text-[#D925C7]" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.totalIngredients || 0}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Total Recipes</h3>
          <Icon icon={TrendingUp} size="md" className="text-[#FF6B00]" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.totalRecipes || 0}</p>
      </div>
    </div>
  );
}
