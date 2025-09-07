'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalIngredients: 0,
    totalRecipes: 0,
    totalMenuDishes: 0,
    averageCostPerDish: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch ingredients count
      const { count: ingredientsCount } = await supabase
        .from('ingredients')
        .select('*', { count: 'exact', head: true })

      // Fetch recipes count
      const { count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })

      // Fetch menu dishes count
      const { count: menuDishesCount } = await supabase
        .from('menu_dishes')
        .select('*', { count: 'exact', head: true })

      // Calculate average cost per dish (simplified)
      const { data: dishes } = await supabase
        .from('menu_dishes')
        .select('selling_price')

      const averageCost = dishes?.length 
        ? dishes.reduce((sum, dish) => sum + dish.selling_price, 0) / dishes.length 
        : 0

      setStats({
        totalIngredients: ingredientsCount || 0,
        totalRecipes: recipesCount || 0,
        totalMenuDishes: menuDishesCount || 0,
        averageCostPerDish: averageCost
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kitchen Management Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Ingredients</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalIngredients}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Recipes</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalRecipes}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Dishes</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalMenuDishes}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg. Dish Price</h3>
            <p className="text-3xl font-bold text-orange-600">${stats.averageCostPerDish.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/ingredients"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Manage Ingredients
            </a>
            <a
              href="/recipes"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Create Recipe
            </a>
            <a
              href="/cogs"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Calculate COGS
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add your ingredients</p>
                <p className="text-sm text-gray-500">Start by adding all the ingredients you use in your kitchen</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create recipes</p>
                <p className="text-sm text-gray-500">Build recipes using your ingredients and calculate costs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Set menu prices</p>
                <p className="text-sm text-gray-500">Create menu dishes and optimize your pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
