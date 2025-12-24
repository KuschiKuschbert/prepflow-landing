'use server'

import { supabase } from '@/lib/supabase-pos'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export async function seedInitialData() {
  const initialItems = [
    { name: "Al Pastor Elysium", category: "Tacos", price: 4.50, is_available: true },
    { name: "Carne Asada Supreme", category: "Tacos", price: 5.00, is_available: true },
    { name: "Baja Fish Nirvana", category: "Tacos", price: 5.50, is_available: true },
    { name: "Vegan 'Chorizo' Dream", category: "Tacos", price: 4.00, is_available: true },
    { name: "Horchata Gold", category: "Drinks", price: 3.50, is_available: true },
    { name: "Jarritos Lime", category: "Drinks", price: 3.00, is_available: true },
    { name: "Nacho Tacos Cap", category: "Merch", price: 25.00, is_available: true },
    { name: "Spicy Sauce Bottle", category: "Merch", price: 12.00, is_available: true }
  ]

  const initialModifiers = [
    { name: "Extra Cheese", priceDelta: 1.50, type: "ADDON", isAvailable: true },
    { name: "No Onions", priceDelta: 0.00, type: "REMOVAL", isAvailable: true },
    { name: "Guacamole", priceDelta: 2.00, type: "ADDON", isAvailable: true },
    { name: "Salsa Verde", priceDelta: 0.50, type: "ADDON", isAvailable: true }
  ]

  logger.dev('Starting seed process...', { context: { endpoint: '/nachotaco/seed' } })

  // --- Seed Menu Items ---
  for (const item of initialItems) {
    const { data, error: selectError } = await supabase.from('menu_items').select('id').eq('name', item.name).maybeSingle()
    if (selectError) {
        logger.error('Error checking item:', { error: selectError.message, itemName: item.name })
        continue
    }
    if (!data) {
        const { error: insertError } = await supabase.from('menu_items').insert([{ ...item, id: crypto.randomUUID() }])
        if (insertError) logger.error('Error inserting item:', { error: insertError.message })
        else logger.dev('Inserted item:', { itemName: item.name })
    }
  }

  // --- Seed Modifiers ---
  for (const mod of initialModifiers) {
    const { data, error: selectError } = await supabase.from('modifier_options').select('id').eq('name', mod.name).maybeSingle()
    if (selectError) {
        // Table might not exist, but let's try to log it.
        logger.error('Error checking modifier:', { error: selectError.message, modName: mod.name })
        continue
    }

    if (!data) {
        // Map camelCase to snake_case for DB if needed, but assuming table columns match snake_case or we map here
        // The Android model has priceDelta, type.
        // Supabase often uses snake_case. Let's assume price_delta.
        const dbMod = {
            id: crypto.randomUUID(),
            name: mod.name,
            price_delta: mod.priceDelta, // DB column convention
            type: mod.type,
            is_available: mod.isAvailable
        }

        const { error: insertError } = await supabase.from('modifier_options').insert([dbMod])
        if (insertError) logger.error('Error inserting modifier:', { error: insertError.message })
        else logger.dev('Inserted modifier:', { modName: mod.name })
    }
  }

  logger.dev('Seeding complete. Revalidating...', { context: { endpoint: '/nachotaco/seed' } })
  revalidatePath('/nachotaco')
}
