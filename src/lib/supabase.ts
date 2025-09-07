import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Ingredient {
  id: string
  name: string
  brand?: string
  pack_size?: string
  unit: string
  cost_per_unit: number
  trim_waste_percentage?: number
  yield_percentage?: number
  supplier?: string
  storage?: string
  product_code?: string
  cost_per_unit_as_purchased?: number
  cost_per_unit_incl_trim?: number
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  name: string
  description?: string
  yield: number
  yield_unit: string
  instructions?: string
  prep_time_minutes?: number
  cook_time_minutes?: number
  created_at: string
  updated_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  unit: string
  created_at: string
}

export interface MenuDish {
  id: string
  name: string
  recipe_id?: string
  selling_price: number
  labor_cost?: number
  overhead_cost?: number
  target_profit_margin?: number
  created_at: string
  updated_at: string
}
