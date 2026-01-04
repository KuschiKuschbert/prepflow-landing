'use client'

import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase-pos'
import { ArrowLeft, CheckCircle, Plus, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useConfirm } from '@/hooks/useConfirm'
import ModifierCard from '../components/ModifierCard'

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
  const { showConfirm, ConfirmDialog } = useConfirm()

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
        .from('pos_modifier_options')
        .select('*')
        .is('deleted_at', null)
        .order('name')

      if (error) {
        logger.error('Error fetching modifiers:', { error: error.message, context: { endpoint: '/curbos/modifiers' } })
      } else {
        setModifiers(data || [])
      }
    } catch (err) {
      logger.error('Unexpected error fetching modifiers:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/curbos/modifiers' } })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    const modifier = modifiers.find(m => m.id === id)
    const modifierName = modifier?.name || 'this modifier'

    const confirmed = await showConfirm({
      title: 'Delete Modifier?',
      message: `Delete "${modifierName}"? This action can't be undone. Last chance to back out.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('pos_modifier_options')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) {
        logger.error('Error deleting modifier:', { error: error.message, context: { endpoint: '/curbos/modifiers', modifierId: id } })
      } else {
        fetchModifiers()
      }
    } catch (err) {
      logger.error('Unexpected error deleting modifier:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/curbos/modifiers', modifierId: id } })
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
          .from('pos_modifier_options')
          .update(itemData)
          .eq('id', editingItem.id)
        if (error) {
          logger.error('Error updating modifier:', { error: error.message, context: { endpoint: '/curbos/modifiers', modifierId: editingItem.id } })
        } else {
          fetchModifiers()
        }
      } else {
        const { error } = await supabase
          .from('pos_modifier_options')
          .insert([itemData])
        if (error) {
          logger.error('Error inserting modifier:', { error: error.message, context: { endpoint: '/curbos/modifiers' } })
        } else {
          fetchModifiers()
        }
      }
      setIsModalOpen(false)
    } catch (err) {
      logger.error('Unexpected error saving modifier:', { error: err instanceof Error ? err.message : String(err), context: { endpoint: '/curbos/modifiers' } })
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 font-sans">
      <header className="border-b border-neutral-800 bg-transparent backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 tablet:px-6 h-16 tablet:h-20 flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-3 tablet:gap-0 py-3 tablet:py-0">
            <div className="flex items-center gap-3 tablet:gap-4">
                <Link href="/curbos" className="text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="tablet:w-6 tablet:h-6" />
                </Link>
                <h1 className="text-xl tablet:text-2xl font-bold tracking-tight text-[#C0FF02]">Modifier Options</h1>
            </div>

            <button
                onClick={() => openModal()}
                className="bg-[#C0FF02] hover:bg-[#b0e602] text-black font-bold px-3 tablet:px-4 py-2 rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(192,255,2,0.2)] text-sm tablet:text-base"
            >
                <Plus size={16} className="tablet:w-[18px] tablet:h-[18px]" /> NEW OPTION
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 tablet:px-6 py-8 tablet:py-12">
        {loading ? (
             <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-neutral-800 rounded-xl"></div>)}
             </div>
        ) : (
             <div className="grid gap-4">
                {modifiers.map(item => (
                    <ModifierCard
                        key={item.id}
                        item={item}
                        onEdit={() => openModal(item)}
                        onDelete={() => handleDelete(item.id)}
                    />
                ))}
             </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 tablet:p-6">
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
                        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 tablet:gap-4 mt-2">
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

      <ConfirmDialog />
    </div>
  )
}
