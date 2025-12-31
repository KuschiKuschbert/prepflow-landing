'use client'

import { Edit, Flame, GlassWater, IceCream2, MoreVertical, Shirt, Trash2, UtensilsCrossed, X } from 'lucide-react'
import { useState } from 'react'

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div
        className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-[#C0FF02]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(192,255,2,0.15)] hover:-translate-y-1"
        onClick={() => {
            // Close menu if clicking elsewhere on the card
            if (showMobileMenu) setShowMobileMenu(false);
        }}
    >
      {/* Image / Icon Area */}
      <div className="h-48 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
        {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        ) : (
            <div className="transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {getIconForCategory(item.category)}
            </div>
        )}

        {/* --- DESKTOP: HOVER OVERLAY --- */}
        <div className="hidden tablet:flex absolute inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-3 bg-[#C0FF02] text-black rounded-full hover:scale-110 hover:bg-white transition-all shadow-lg"
                title="Edit Item"
            >
                <Edit size={18} strokeWidth={2.5} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-3 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full hover:bg-red-500 hover:text-white hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
                title="Delete Item"
            >
                <Trash2 size={18} strokeWidth={2.5} />
            </button>
        </div>

        {/* --- MOBILE: MEATBALL MENU --- */}
        <div className="tablet:hidden absolute top-3 right-3 z-30 flex flex-row-reverse items-center">
            {/* The Toggle Button */}
            {!showMobileMenu ? (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowMobileMenu(true); }}
                    className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md border border-white/10 shadow-lg active:scale-90 transition-all"
                >
                    <MoreVertical size={20} />
                </button>
            ) : (
                /* The Expanded Menu */
                <div className="flex items-center gap-2 p-1.5 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); setShowMobileMenu(false); }}
                        className="p-2 bg-[#C0FF02] text-black rounded-full active:scale-95 transition-transform"
                    >
                        <Edit size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); setShowMobileMenu(false); }}
                        className="p-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full active:scale-95 transition-transform"
                    >
                        <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-0.5" />
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMobileMenu(false); }}
                        className="p-1 px-1.5 text-neutral-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
      </div>

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
