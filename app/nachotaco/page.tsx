'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-pos'
import { logger } from '@/lib/logger'
import MenuItemCard from './components/MenuItemCard'
import { Plus, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'
import { logout } from './actions'
import { seedInitialData } from './seed-actions'

// Define types locally for simplicity
interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  imageUrl?: string // Keep as optional for now
  isAvailable: boolean // Map from is_available
  updatedAt?: string
}

export default function NachoTacosAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Tacos')

  async function fetchItems() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name')

      if (error) {
        logger.error('Error fetching menu:', { error: error.message, context: { endpoint: '/nachotaco' } })
      } else {
        setItems(data || [])
      }
    } catch (err) {
      logger.error('Unexpected error fetching menu:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco' } })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const itemData = {
      name,
      price: parseFloat(price),
      category,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id)
       if (!error) fetchItems()
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([{ ...itemData, id: crypto.randomUUID() }]) // Client-side ID generation for speed
       if (!error) fetchItems()
    }
    closeModal()
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) fetchItems()
  }

  function openModal(item?: any) {
    if (item) {
      setEditingItem(item)
      setName(item.name)
      setPrice(item.price.toString())
      setCategory(item.category)
    } else {
      setEditingItem(null)
      setName('')
      setPrice('')
      setCategory('Tacos')
    }
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 font-sans">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-transparent/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🌮</span>
                <h1 className="text-2xl font-bold tracking-tight text-[#C0FF02]">NACHO TACOS <span className="text-neutral-500 font-normal text-lg">| Admin</span></h1>
            </div>

            <nav className="flex items-center gap-6">
                 {/* Seed Data Trigger */}
                 <form action={seedInitialData}>
                    <button className="text-xs text-neutral-600 hover:text-[#C0FF02] uppercase tracking-widest transition-colors font-bold">
                        [Restore Defaults]
                    </button>
                 </form>

                <Link href="/nachotaco/stats" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                    <BarChart3 size={20} /> Stats
                </Link>
                <Link href="/nachotaco/modifiers" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                    <Settings size={20} /> Modifiers
                </Link>
                 <form action={logout}>
                    <button className="text-neutral-400 hover:text-red-400 text-sm font-bold uppercase tracking-wider">Logout</button>
                 </form>
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2">Menu Items</h2>
                <p className="text-neutral-400">Manage your delicious offerings.</p>
            </div>

            <button
                onClick={() => openModal()}
                className="bg-[#C0FF02] hover:bg-[#b0e602] text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(192,255,2,0.2)] transition-all transform hover:scale-105"
            >
                <Plus size={20} /> ADD NEW ITEM
            </button>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-neutral-800 h-80 rounded-xl"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={() => openModal(item)}
                        onDelete={() => deleteItem(item.id)}
                    />
                ))}
            </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-neutral-700 bg-transparent/50">
                    <h3 className="text-xl font-bold text-white">{editingItem ? 'Edit Item' : 'New Creation'}</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-transparent border border-neutral-700 rounded-lg p-3 text-white focus:border-[#C0FF02] focus:outline-none transition-colors"
                            placeholder="e.g. Supreme Nachos"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full bg-transparent border border-neutral-700 rounded-lg p-3 text-white focus:border-[#C0FF02] focus:outline-none transition-colors"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full bg-transparent border border-neutral-700 rounded-lg p-3 text-white focus:border-[#C0FF02] focus:outline-none transition-colors"
                        >
                            <option>Tacos</option>
                            <option>Nachos</option>
                            <option>Drinks</option>
                            <option>Sides</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#C0FF02] hover:bg-[#b0e602] text-black font-bold py-3 rounded-lg transition-colors"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}
