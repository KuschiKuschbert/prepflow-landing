'use client'

import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import MenuItemCard from './components/MenuItemCard'

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

export default function CurbOSAdmin() {
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
        logger.error('Error fetching menu:', { error: error.message, context: { endpoint: '/curbos' } })
      } else {
        setItems(data || [])
      }
    } catch (err) {
      logger.error('Unexpected error fetching menu:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/curbos' } })
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
    <div className="text-neutral-100 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 tablet:px-6 py-8 tablet:py-12">
        <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-center gap-4 tablet:gap-0 mb-8 tablet:mb-12">
            <div>
                <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-bold text-white mb-2">Menu Items</h2>
                <p className="text-neutral-400 text-sm tablet:text-base">Manage your delicious offerings.</p>
            </div>

            <button
                onClick={() => openModal()}
                className="bg-[#C0FF02] hover:bg-[#b0e602] text-black font-bold px-4 tablet:px-6 py-2.5 tablet:py-3 rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(192,255,2,0.2)] transition-all transform hover:scale-105 text-sm tablet:text-base"
            >
                <Plus size={18} className="tablet:w-5 tablet:h-5" /> ADD NEW ITEM
            </button>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 gap-4 tablet:gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-neutral-800 h-80 rounded-xl"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 gap-4 tablet:gap-6">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 tablet:p-6">
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
