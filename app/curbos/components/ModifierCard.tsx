'use client'

import type { Action } from '@/components/ui/ResponsiveCardActions'
import { ResponsiveCardActionsMenu } from '@/components/ui/ResponsiveCardActionsMenu'
import { ResponsiveCardActionsOverlay } from '@/components/ui/ResponsiveCardActionsOverlay'
import { Edit, Plus, Trash2 } from 'lucide-react'

interface ModifierCardProps {
  item: {
    id: string
    name: string
    price_delta: number
    type: string
    is_available: boolean
  }
  onEdit: () => void
  onDelete: () => void
}

export default function ModifierCard({ item, onEdit, onDelete }: ModifierCardProps) {
  const price = item.price_delta ?? 0

  const actions: Action[] = [
    {
      id: 'edit',
      label: 'Edit Modifier',
      icon: Edit,
      onClick: onEdit,
      variant: 'primary',
    },
    {
      id: 'delete',
      label: 'Delete Modifier',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger',
    },
  ]

  return (
    <div className="group relative rounded-xl border border-neutral-800 bg-[#1A1A1A] transition-colors hover:border-neutral-700">
      <ModifierInfo item={item} price={price} />

      {/* Desktop: Hover Overlay (covers entire card) */}
      <ResponsiveCardActionsOverlay actions={actions} theme="curbos" />

      {/* Mobile: Meatball Menu */}
      <ResponsiveCardActionsMenu actions={actions} theme="curbos" position="top-right" />
    </div>
  )
}

function ModifierInfo({ item, price }: { item: ModifierCardProps['item']; price: number }) {
  return (
    <div className="p-4 flex justify-between items-center relative">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <ModifierIcon type={item.type} />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg text-white group-hover:text-[#C0FF02] truncate">
            {item.name}
          </h3>
          <p className="text-neutral-400 text-sm">
            {item.type} • {price >= 0 ? '+' : ''}${price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

function ModifierIcon({ type }: { type: string }) {
  return (
    <div
      className={`p-2 rounded-lg flex-shrink-0 ${
        type === 'ADDON' ? 'bg-lime-900/30 text-[#C0FF02]' : 'bg-red-900/30 text-red-400'
      }`}
    >
      {type === 'ADDON' ? <Plus size={20} /> : <Trash2 size={20} />}
    </div>
  )
}
