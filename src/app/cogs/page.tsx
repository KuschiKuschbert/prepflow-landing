'use client'

import { useState, useEffect } from 'react'
import { supabase, Recipe, MenuDish } from '@/lib/supabase'

export default function COGSCalculatorPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [menuDishes, setMenuDishes] = useState<MenuDish[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [recipeCost, setRecipeCost] = useState(0)
  const [calculations, setCalculations] = useState({
    laborCost: 0,
    overheadCost: 0,
    targetProfitMargin: 0,
    sellingPrice: 0,
    grossProfit: 0,
    grossProfitMargin: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedRecipe) {
      calculateRecipeCost()
    }
  }, [selectedRecipe])

  const fetchData = async () => {
    try {
      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name')

      if (recipesError) throw recipesError

      // Fetch menu dishes
      const { data: menuDishesData, error: menuDishesError } = await supabase
        .from('menu_dishes')
        .select(`
          *,
          recipes (
            name,
            yield,
            yield_unit
          )
        `)
        .order('name')

      if (menuDishesError) throw menuDishesError

      setRecipes(recipesData || [])
      setMenuDishes(menuDishesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRecipeCost = async () => {
    if (!selectedRecipe) return

    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select(`
          *,
          ingredients (
            cost_per_unit,
            trim_waste_percentage,
            yield_percentage
          )
        `)
        .eq('recipe_id', selectedRecipe.id)

      if (error) throw error

      const totalCost = data?.reduce((total, ri) => {
        const ingredient = ri.ingredients
        if (ingredient) {
          // Calculate effective cost considering waste and yield
          const wasteFactor = 1 + (ingredient.trim_waste_percentage || 0) / 100
          const yieldFactor = (ingredient.yield_percentage || 100) / 100
          const effectiveCost = ingredient.cost_per_unit * wasteFactor / yieldFactor
          return total + (ri.quantity * effectiveCost)
        }
        return total
      }, 0) || 0

      setRecipeCost(totalCost)
    } catch (error) {
      console.error('Error calculating recipe cost:', error)
    }
  }

  const calculatePricing = () => {
    const foodCost = recipeCost / selectedRecipe?.yield || 0
    const totalCost = foodCost + calculations.laborCost + calculations.overheadCost
    
    let sellingPrice = 0
    if (calculations.targetProfitMargin > 0) {
      // Calculate selling price based on target profit margin
      sellingPrice = totalCost / (1 - calculations.targetProfitMargin / 100)
    } else {
      // Default 65% profit margin
      sellingPrice = totalCost / 0.35
    }

    const grossProfit = sellingPrice - totalCost
    const grossProfitMargin = (grossProfit / sellingPrice) * 100

    setCalculations(prev => ({
      ...prev,
      sellingPrice,
      grossProfit,
      grossProfitMargin
    }))
  }

  const handleInputChange = (field: string, value: number) => {
    setCalculations(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveMenuDish = async () => {
    if (!selectedRecipe || !calculations.sellingPrice) return

    try {
      const { error } = await supabase
        .from('menu_dishes')
        .insert([{
          name: `${selectedRecipe.name} (Menu Item)`,
          recipe_id: selectedRecipe.id,
          selling_price: calculations.sellingPrice,
          labor_cost: calculations.laborCost,
          overhead_cost: calculations.overheadCost,
          target_profit_margin: calculations.targetProfitMargin
        }])

      if (error) throw error
      
      // Refresh menu dishes
      fetchData()
      alert('Menu dish saved successfully!')
    } catch (error) {
      console.error('Error saving menu dish:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">COGS Calculator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Recipe Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Recipe</h2>
            <div className="space-y-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecipe?.id === recipe.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                  <p className="text-sm text-gray-500">
                    Yield: {recipe.yield} {recipe.yield_unit}
                  </p>
                  {recipe.prep_time_minutes && recipe.cook_time_minutes && (
                    <p className="text-sm text-gray-500">
                      Time: {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Cost Calculator */}
          {selectedRecipe && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Cost Analysis: {selectedRecipe.name}
              </h2>

              {/* Recipe Cost Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Food Cost</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Recipe Cost:</span>
                    <span className="font-semibold">${recipeCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Cost per Serving:</span>
                    <span className="font-semibold">${(recipeCost / selectedRecipe.yield).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Costs */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Costs</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labor Cost per Serving ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={calculations.laborCost}
                      onChange={(e) => handleInputChange('laborCost', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overhead Cost per Serving ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={calculations.overheadCost}
                      onChange={(e) => handleInputChange('overheadCost', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={calculations.targetProfitMargin}
                      onChange={(e) => handleInputChange('targetProfitMargin', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for default 65% profit margin
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculatePricing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-6"
              >
                Calculate Pricing
              </button>

              {/* Results */}
              {calculations.sellingPrice > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-900">Recommended Selling Price:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${calculations.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-900">Gross Profit:</span>
                      <span className="text-lg font-semibold text-blue-600">
                        ${calculations.grossProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-gray-900">Gross Profit Margin:</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {calculations.grossProfitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Save Menu Dish */}
                  <button
                    onClick={saveMenuDish}
                    className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save as Menu Dish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu Dishes Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Menu Dishes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dish Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labor Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overhead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuDishes.map((dish) => {
                  const recipe = dish.recipes as any
                  const totalCost = (dish.labor_cost || 0) + (dish.overhead_cost || 0)
                  const profitMargin = ((dish.selling_price - totalCost) / dish.selling_price) * 100
                  
                  return (
                    <tr key={dish.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dish.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recipe?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${dish.selling_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(dish.labor_cost || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(dish.overhead_cost || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profitMargin.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
