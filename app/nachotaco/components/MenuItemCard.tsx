'use client'

import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface MenuItemCardProps {
  item: any
  onEdit: () => void
  onDelete: () => void
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#C0FF02]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(192,255,2,0.1)] hover:-translate-y-1">
      {/* Image Placeholder */}
      <div className="h-40 bg-neutral-800/50 flex items-center justify-center relative overflow-hidden">
        {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
            <span className="text-4xl select-none filter grayscale group-hover:grayscale-0 transition-all duration-500">🌮</span>
        )}
        
        {/* Quick Actions (Hover) */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={onEdit} className="p-3 bg-[#C0FF02] text-black rounded-full hover:scale-110 transition-transform">
                <Edit size={20} />
            </button>
            <button onClick={onDelete} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                <Trash2 size={20} />
            </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-xs font-bold text-[#C0FF02] tracking-wider uppercase mb-1">{item.category}</p>
                <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
            </div>
            <span className="font-bold text-white bg-white/10 px-2 py-1 rounded text-sm group-hover:text-[#C0FF02] group-hover:bg-[#C0FF02]/10 transition-colors">
                ${item.price.toFixed(2)}
            </span>
        </div>
      </div>
    </div>
  )
}
