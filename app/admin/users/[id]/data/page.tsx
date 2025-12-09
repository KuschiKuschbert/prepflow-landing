'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ArrowLeft, Package, BookOpen, Utensils, Thermometer, Sparkles } from 'lucide-react';
import { logger } from '@/lib/logger';

interface UserData {
  ingredients: number;
  recipes: number;
  dishes: number;
  temperatureLogs: number;
  cleaningTasks: number;
  data: {
    ingredients: any[];
    recipes: any[];
    dishes: any[];
    temperatureLogs: any[];
    cleaningTasks: any[];
  };
}

/**
 * User data page component for admin dashboard.
 * Displays all data associated with a specific user (ingredients, recipes, dishes, etc.).
 *
 * @component
 * @returns {JSX.Element} User data admin page
 */
export default function UserDataPage() {
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'ingredients' | 'recipes' | 'dishes' | 'temperature' | 'cleaning'
  >('ingredients');

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users/${userId}/data`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        logger.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const tabs = [
    {
      id: 'ingredients' as const,
      label: 'Ingredients',
      icon: Package,
      count: userData?.ingredients || 0,
    },
    { id: 'recipes' as const, label: 'Recipes', icon: BookOpen, count: userData?.recipes || 0 },
    { id: 'dishes' as const, label: 'Dishes', icon: Utensils, count: userData?.dishes || 0 },
    {
      id: 'temperature' as const,
      label: 'Temperature Logs',
      icon: Thermometer,
      count: userData?.temperatureLogs || 0,
    },
    {
      id: 'cleaning' as const,
      label: 'Cleaning Tasks',
      icon: Sparkles,
      count: userData?.cleaningTasks || 0,
    },
  ];

  const renderDataTable = () => {
    if (!userData) return null;

    const dataKey =
      activeTab === 'temperature'
        ? 'temperatureLogs'
        : activeTab === 'cleaning'
          ? 'cleaningTasks'
          : activeTab;
    const data = userData.data[dataKey as keyof typeof userData.data];
    if (!data || data.length === 0) {
      return (
        <div className="py-12 text-center text-gray-400">No {activeTab} found for this user</div>
      );
    }

    // Simple table rendering - can be enhanced based on data structure
    return (
      <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {data.map((item: any, index: number) => (
              <tr key={item.id || index} className="transition-colors hover:bg-[#2a2a2a]/20">
                <td className="px-6 py-4 text-sm text-white">
                  {item.name || item.ingredient_name || item.recipe_name || item.dish_name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-64 rounded bg-[#2a2a2a]"></div>
          <div className="h-96 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/users/${userId}`}
          className="text-gray-400 transition-colors hover:text-white"
        >
          <Icon icon={ArrowLeft} size="md" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">User Data</h1>
          <p className="mt-2 text-gray-400">View all data associated with this user</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-[#29E7CD] text-[#29E7CD]'
                  : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
              }`}
            >
              <Icon icon={tab.icon} size="sm" />
              <span>{tab.label}</span>
              <span className="rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs">{tab.count}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Data Table */}
      {renderDataTable()}
    </div>
  );
}
