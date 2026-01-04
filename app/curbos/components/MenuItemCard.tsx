'use client'

import type { Action } from '@/components/ui/ResponsiveCardActions'
import { ResponsiveCardActionsMenu } from '@/components/ui/ResponsiveCardActionsMenu'
import { ResponsiveCardActionsOverlay } from '@/components/ui/ResponsiveCardActionsOverlay'
import { Edit, Flame, GlassWater, IceCream2, Shirt, Trash2, UtensilsCrossed } from 'lucide-react'

interface MenuItemCardProps {
  item: any
  onEdit: () => void
  onDelete: () => void
}

function getIconForCategory(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('taco')) return <UtensilsCrossed className="w-16 h-16 text-[#C0FF02]" />
  if (cat.includes('nacho')) return <UtensilsCrossed className="w-16 h-16 text-[#C0FF02]" />
  if (cat.includes('drink') || cat.includes('beverage')) return <GlassWater className="w-16 h-16 text-cyan-400" />
  if (cat.includes('merch') || cat.includes('shirt')) return <Shirt className="w-16 h-16 text-pink-400" />
  if (cat.includes('dessert') || cat.includes('cream')) return <IceCream2 className="w-16 h-16 text-purple-400" />
  if (cat.includes('salsa') || cat.includes('side')) return <Flame className="w-16 h-16 text-red-500" />
  return <UtensilsCrossed className="w-16 h-16 text-neutral-500" />
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const actions: Action[] = [
    {
      id: 'edit',
      label: 'Edit Item',
      icon: Edit,
      onClick: onEdit,
      variant: 'primary',
    },
    {
      id: 'delete',
      label: 'Delete Item',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger',
    },
  ];

  return (
    <div className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-[#C0FF02]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(192,255,2,0.15)] hover:-translate-y-1">
      {/* Image / Icon Area */}
      <div className="h-48 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        ) : (
          <div className="transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {getIconForCategory(item.category)}
          </div>
        )}

        {/* Desktop: Hover Overlay (inside image area for correct positioning) */}
        <ResponsiveCardActionsOverlay actions={actions} theme="curbos" />
      </div>

      {/* Mobile: Meatball Menu (at card level) */}
      <ResponsiveCardActionsMenu actions={actions} theme="curbos" position="top-right" />

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-3">
            <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-white/5 text-neutral-400 mb-2 border border-white/5">
                    {item.category}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight tracking-tight group-hover:text-[#C0FF02] transition-colors">
                    {item.name}
                </h3>
            </div>
            <div className="flex flex-col items-end">
                <span className="font-mono font-bold text-[#C0FF02] text-lg">
                    ${item.price.toFixed(2)}
                </span>
            </div>
        </div>
      </div>
    </div>
  )
}
