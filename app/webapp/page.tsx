'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalIngredients: number;
  totalRecipes: number;
  totalMenuDishes: number;
  averageDishPrice: number;
}

export default function WebAppDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIngredients: 0,
    totalRecipes: 0,
    totalMenuDishes: 0,
    averageDishPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!supabase) {
          console.log('Supabase client not available');
          setStats({
            totalIngredients: 0,
            totalRecipes: 0,
            totalMenuDishes: 0,
            averageDishPrice: 0
          });
          setLoading(false);
          return;
        }

        // Fetch ingredients count
        const { count: ingredientsCount } = await supabase
          .from('ingredients')
          .select('*', { count: 'exact', head: true });

        // Fetch recipes count
        const { count: recipesCount } = await supabase
          .from('recipes')
          .select('*', { count: 'exact', head: true });

        // Fetch menu dishes count and average price
        const { data: menuDishes } = await supabase
          .from('menu_dishes')
          .select('selling_price');

        const totalDishes = menuDishes?.length || 0;
        const averagePrice = totalDishes > 0 && menuDishes
          ? menuDishes.reduce((sum, dish) => sum + (dish.selling_price || 0), 0) / totalDishes
          : 0;

        setStats({
          totalIngredients: ingredientsCount || 0,
          totalRecipes: recipesCount || 0,
          totalMenuDishes: totalDishes,
          averageDishPrice: averagePrice,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/2 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-8 bg-[#2a2a2a] rounded-xl w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-[#2a2a2a] rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏠 Kitchen Management Dashboard
          </h1>
          <p className="text-gray-400">Welcome back! Here's your kitchen overview</p>
        </div>
        
        {/* Stats Cards - Material Design 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div 
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 border border-[#2a2a2a] group hover:border-[#29E7CD]/30"
            style={{ animationDelay: '0ms', animation: 'fadeInUp 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🥘</span>
              </div>
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Total Ingredients</h3>
            <p className="text-3xl font-bold text-[#29E7CD]">{stats.totalIngredients}</p>
          </div>
          
          <div 
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 border border-[#2a2a2a] group hover:border-[#3B82F6]/30"
            style={{ animationDelay: '100ms', animation: 'fadeInUp 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📖</span>
              </div>
              <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Total Recipes</h3>
            <p className="text-3xl font-bold text-[#3B82F6]">{stats.totalRecipes}</p>
          </div>
          
          <div 
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 border border-[#2a2a2a] group hover:border-[#D925C7]/30"
            style={{ animationDelay: '200ms', animation: 'fadeInUp 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D925C7]/20 to-[#D925C7]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="w-2 h-2 bg-[#D925C7] rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Menu Dishes</h3>
            <p className="text-3xl font-bold text-[#D925C7]">{stats.totalMenuDishes}</p>
          </div>
          
          <div 
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 border border-[#2a2a2a] group hover:border-[#29E7CD]/30"
            style={{ animationDelay: '300ms', animation: 'fadeInUp 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💰</span>
              </div>
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Avg Dish Price</h3>
            <p className="text-3xl font-bold text-[#29E7CD]">
              ${stats.averageDishPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Quick Actions - Material Design 3 */}
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-1">⚡ Quick Actions</h2>
              <p className="text-gray-400">Jump into your most used features</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/webapp/ingredients"
              className="group p-6 border border-[#2a2a2a] rounded-2xl hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200 bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] hover:from-[#29E7CD]/5 hover:to-[#29E7CD]/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#29E7CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-[#29E7CD] transition-colors">Manage Ingredients</h3>
                  <p className="text-sm text-gray-400">Add, edit, and organize</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Build your kitchen inventory with detailed ingredient tracking</p>
            </a>
            
            <a
              href="/webapp/recipes"
              className="group p-6 border border-[#2a2a2a] rounded-2xl hover:shadow-xl hover:border-[#3B82F6]/50 transition-all duration-200 bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] hover:from-[#3B82F6]/5 hover:to-[#3B82F6]/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-[#3B82F6] transition-colors">Recipe Book</h3>
                  <p className="text-sm text-gray-400">View saved recipes</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Access your saved recipes from COGS calculations</p>
            </a>
            
            <a
              href="/webapp/cogs"
              className="group p-6 border border-[#2a2a2a] rounded-2xl hover:shadow-xl hover:border-[#D925C7]/50 transition-all duration-200 bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] hover:from-[#D925C7]/5 hover:to-[#D925C7]/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D925C7]/20 to-[#D925C7]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#D925C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-[#D925C7] transition-colors">Calculate COGS</h3>
                  <p className="text-sm text-gray-400">Analyze costs & margins</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Calculate Cost of Goods Sold and profit margins</p>
            </a>
          </div>
        </div>

        {/* Getting Started - Material Design 3 */}
        <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-6 rounded-3xl shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Getting Started with PrepFlow</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to your kitchen management hub! Start by adding your ingredients to build your inventory, 
                then create recipes to calculate your Cost of Goods Sold (COGS) and optimize your profit margins.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#29E7CD]/10 text-[#29E7CD] border border-[#29E7CD]/20">
                  📊 Real-time Analytics
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                  💰 Profit Optimization
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D925C7]/10 text-[#D925C7] border border-[#D925C7]/20">
                  🎯 Smart Insights
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
