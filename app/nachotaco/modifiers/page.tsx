'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-pos'
import { Plus, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

interface ModifierOption {
  id: string
  name: string
  price_delta: number
  type: string
  is_available: boolean
  updated_at?: string
}

export default function ModifiersPage() {
  const [modifiers, setModifiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form
  const [name, setName] = useState('')
  const [priceDelta, setPriceDelta] = useState('')
  const [type, setType] = useState('ADDON')

  useEffect(() => {
    fetchModifiers()
  }, [])

  async function fetchModifiers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('modifier_options')
        .select('*')
        .order('name')

      if (error) {
        logger.error('Error fetching modifiers:', { error: error.message, context: { endpoint: '/nachotaco/modifiers' } })
      } else {
        setModifiers(data || [])
      }
    } catch (err) {
      logger.error('Unexpected error fetching modifiers:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco/modifiers' } })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return
    try {
      const { error } = await supabase.from('modifier_options').delete().eq('id', id)
      if (error) {
        logger.error('Error deleting modifier:', { error: error.message, context: { endpoint: '/nachotaco/modifiers', modifierId: id } })
      } else {
        fetchModifiers()
      }
    } catch (err) {
      logger.error('Unexpected error deleting modifier:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco/modifiers', modifierId: id } })
    }
  }

  function openModal(item?: any) {
    if (item) {
      setEditingItem(item)
      setName(item.name)
      // Safely handle price_delta
      const price = item.price_delta ?? 0
      setPriceDelta(price.toString())
      setType(item.type)
    } else {
      setEditingItem(null)
      setName('')
      setPriceDelta('')
      setType('ADDON')
    }
    setIsModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const itemData = {
      name,
      price_delta: parseFloat(priceDelta) || 0,
      type,
      is_available: true,
      updated_at: new Date().toISOString()
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('modifier_options')
          .update(itemData)
          .eq('id', editingItem.id)
        if (error) {
          logger.error('Error updating modifier:', { error: error.message, context: { endpoint: '/nachotaco/modifiers', modifierId: editingItem.id } })
        } else {
          fetchModifiers()
        }
      } else {
        const { error } = await supabase
          .from('modifier_options')
          .insert([itemData])
        if (error) {
          logger.error('Error inserting modifier:', { error: error.message, context: { endpoint: '/nachotaco/modifiers' } })
        } else {
          fetchModifiers()
        }
      }
      setIsModalOpen(false)
    } catch (err) {
      logger.error('Unexpected error saving modifier:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/nachotaco/modifiers' } })
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/nachotaco" className="text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-[#C0FF02]">Modifier Options</h1>
            </div>

            <button
                onClick={() => openModal()}
                className="bg-[#C0FF02] hover:bg-[#b0e602] text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(192,255,2,0.2)]"
            >
                <Plus size={18} /> NEW OPTION
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
             <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-neutral-800 rounded-xl"></div>)}
             </div>
        ) : (
             <div className="grid gap-4">
                {modifiers.map(item => {
                    const price = item.price_delta ?? 0
                    return (
                        <div key={item.id} className="bg-neutral-800 p-4 rounded-xl flex justify-between items-center border border-neutral-700 hover:border-[#C0FF02] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${item.type === 'ADDON' ? 'bg-lime-900/30 text-[#C0FF02]' : 'bg-red-900/30 text-red-400'}`}>
                                    {item.type === 'ADDON' ? <Plus size={20} /> : <Trash2 size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-[#C0FF02]">{item.name}</h3>
                                    <p className="text-neutral-400 text-sm">{item.type} • {price >= 0 ? '+' : ''}${price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => openModal(item)} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-bold transition-colors">EDIT</button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/20 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    )
                })}
             </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700 shadow-2xl">
                <div className="p-6 border-b border-neutral-700">
                    <h3 className="text-xl font-bold">{editingItem ? 'Edit Option' : 'New Option'}</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="text-sm font-bold text-neutral-400 uppercase">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 mt-2 text-white focus:border-[#C0FF02] outline-none" placeholder="e.g. Extra Cheese" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-neutral-400 uppercase">Price Delta ($)</label>
                        <input type="number" step="0.01" value={priceDelta} onChange={e => setPriceDelta(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 mt-2 text-white focus:border-[#C0FF02] outline-none" placeholder="0.50" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-neutral-400 uppercase">Type</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <button type="button" onClick={() => setType('ADDON')} className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${type === 'ADDON' ? 'bg-[#C0FF02] text-black border-[#C0FF02]' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}>
                                <CheckCircle size={16} /> Add-on
                            </button>
                            <button type="button" onClick={() => setType('REMOVAL')} className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${type === 'REMOVAL' ? 'bg-red-500 text-white border-red-500' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}>
                                <XCircle size={16} /> Removal
                            </button>
                        </div>
                    </div>
                     <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-3 rounded-lg font-bold">CANCEL</button>
                        <button type="submit" className="flex-1 bg-[#C0FF02] hover:bg-[#b0e602] text-black py-3 rounded-lg font-bold">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}
