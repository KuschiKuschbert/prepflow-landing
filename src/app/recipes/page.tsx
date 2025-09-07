'use client'

import { useState, useEffect } from 'react'
import { supabase, Recipe, Ingredient, RecipeIngredient } from '@/lib/supabase'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    yield: '',
    yield_unit: 'servings',
    instructions: '',
    prep_time_minutes: '',
    cook_time_minutes: ''
  })

  // Recipe ingredient form
  const [ingredientForm, setIngredientForm] = useState({
    ingredient_id: '',
    quantity: '',
    unit: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name')

      if (recipesError) throw recipesError

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('name')

      if (ingredientsError) throw ingredientsError

      setRecipes(recipesData || [])
      setIngredients(ingredientsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipeIngredients = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select(`
          *,
          ingredients (
            name,
            unit,
            cost_per_unit
          )
        `)
        .eq('recipe_id', recipeId)

      if (error) throw error
      setRecipeIngredients(data || [])
    } catch (error) {
      console.error('Error fetching recipe ingredients:', error)
    }
  }

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const recipeData = {
        ...formData,
        yield: parseInt(formData.yield),
        prep_time_minutes: formData.prep_time_minutes ? parseInt(formData.prep_time_minutes) : null,
        cook_time_minutes: formData.cook_time_minutes ? parseInt(formData.cook_time_minutes) : null
      }

      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('recipes')
          .insert([recipeData])
          .select()

        if (error) throw error
        if (data && data[0]) {
          setSelectedRecipe(data[0])
        }
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        yield: '',
        yield_unit: 'servings',
        instructions: '',
        prep_time_minutes: '',
        cook_time_minutes: ''
      })
      setShowAddForm(false)
      setEditingRecipe(null)
      fetchData()
    } catch (error) {
      console.error('Error saving recipe:', error)
    }
  }

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRecipe) return

    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .insert([{
          recipe_id: selectedRecipe.id,
          ingredient_id: ingredientForm.ingredient_id,
          quantity: parseFloat(ingredientForm.quantity),
          unit: ingredientForm.unit
        }])

      if (error) throw error

      // Reset form and refresh ingredients
      setIngredientForm({
        ingredient_id: '',
        quantity: '',
        unit: ''
      })
      fetchRecipeIngredients(selectedRecipe.id)
    } catch (error) {
      console.error('Error adding ingredient:', error)
    }
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      yield: recipe.yield.toString(),
      yield_unit: recipe.yield_unit,
      instructions: recipe.instructions || '',
      prep_time_minutes: recipe.prep_time_minutes?.toString() || '',
      cook_time_minutes: recipe.cook_time_minutes?.toString() || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  const removeIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('id', id)

      if (error) throw error
      if (selectedRecipe) {
        fetchRecipeIngredients(selectedRecipe.id)
      }
    } catch (error) {
      console.error('Error removing ingredient:', error)
    }
  }

  const calculateRecipeCost = () => {
    return recipeIngredients.reduce((total, ri) => {
      const ingredient = ingredients.find(i => i.id === ri.ingredient_id)
      if (ingredient) {
        return total + (ri.quantity * ingredient.cost_per_unit)
      }
      return total
    }, 0)
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Recipe
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Recipe List */}
          <div>
            {/* Add/Edit Recipe Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
                </h2>
                <form onSubmit={handleRecipeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yield *</label>
                      <input
                        type="number"
                        required
                        value={formData.yield}
                        onChange={(e) => setFormData({ ...formData, yield: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={formData.yield_unit}
                        onChange={(e) => setFormData({ ...formData, yield_unit: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                      <input
                        type="number"
                        value={formData.prep_time_minutes}
                        onChange={(e) => setFormData({ ...formData, prep_time_minutes: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                      <input
                        type="number"
                        value={formData.cook_time_minutes}
                        onChange={(e) => setFormData({ ...formData, cook_time_minutes: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingRecipe ? 'Update' : 'Add'} Recipe
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingRecipe(null)
                        setFormData({
                          name: '',
                          description: '',
                          yield: '',
                          yield_unit: 'servings',
                          instructions: '',
                          prep_time_minutes: '',
                          cook_time_minutes: ''
                        })
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recipe List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recipes</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
                        {recipe.description && (
                          <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Yield: {recipe.yield} {recipe.yield_unit}</span>
                          {recipe.prep_time_minutes && (
                            <span>Prep: {recipe.prep_time_minutes}min</span>
                          )}
                          {recipe.cook_time_minutes && (
                            <span>Cook: {recipe.cook_time_minutes}min</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRecipe(recipe)
                            fetchRecipeIngredients(recipe.id)
                          }}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(recipe)}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recipe Details */}
          {selectedRecipe && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedRecipe.name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {selectedRecipe.description && (
                <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium">Yield:</span> {selectedRecipe.yield} {selectedRecipe.yield_unit}
                </div>
                {selectedRecipe.prep_time_minutes && (
                  <div>
                    <span className="font-medium">Prep Time:</span> {selectedRecipe.prep_time_minutes} min
                  </div>
                )}
                {selectedRecipe.cook_time_minutes && (
                  <div>
                    <span className="font-medium">Cook Time:</span> {selectedRecipe.cook_time_minutes} min
                  </div>
                )}
                <div className="col-span-2">
                  <span className="font-medium">Total Cost:</span> ${calculateRecipeCost().toFixed(2)}
                </div>
              </div>

              {/* Add Ingredient Form */}
              <div className="border-t pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Ingredient</h3>
                <form onSubmit={handleIngredientSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ingredient</label>
                      <select
                        required
                        value={ingredientForm.ingredient_id}
                        onChange={(e) => setIngredientForm({ ...ingredientForm, ingredient_id: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={ingredientForm.quantity}
                        onChange={(e) => setIngredientForm({ ...ingredientForm, quantity: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        required
                        value={ingredientForm.unit}
                        onChange={(e) => setIngredientForm({ ...ingredientForm, unit: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Ingredient
                  </button>
                </form>
              </div>

              {/* Recipe Ingredients */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ingredients</h3>
                <div className="space-y-2">
                  {recipeIngredients.map((ri) => {
                    const ingredient = ingredients.find(i => i.id === ri.ingredient_id)
                    return (
                      <div key={ri.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{ingredient?.name}</span>
                          <span className="text-gray-500 ml-2">{ri.quantity} {ri.unit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            ${((ri.quantity * (ingredient?.cost_per_unit || 0))).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeIngredient(ri.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Instructions */}
              {selectedRecipe.instructions && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-600">{selectedRecipe.instructions}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
