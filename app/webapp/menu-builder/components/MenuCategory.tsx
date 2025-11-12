'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { MenuItem } from '../types';

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  onRemoveItem: (itemId: string) => void;
}

function SortableMenuItem({ item, onRemove }: { item: MenuItem; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: 'menu-item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group flex cursor-grab items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#29E7CD]/50 active:cursor-grabbing"
    >
      <div className="flex-1">
        <div className="font-medium text-white">{item.dishes?.dish_name || 'Unknown Dish'}</div>
        <div className="text-sm text-gray-400">
          ${item.dishes?.selling_price.toFixed(2) || '0.00'}
        </div>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
      >
        <Icon icon={Trash2} size="sm" />
      </button>
    </div>
  );
}

export default function MenuCategory({ category, items, onRemoveItem }: MenuCategoryProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `category-${category}`,
    data: {
      type: 'category',
      category,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
        isOver ? 'border-[#29E7CD] bg-[#29E7CD]/10' : 'border-[#2a2a2a] bg-[#2a2a2a]/30'
      }`}
    >
      <h3 className="mb-3 text-lg font-semibold text-white">{category}</h3>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              Drag dishes here to add them to this category
            </div>
          ) : (
            items.map(item => (
              <SortableMenuItem key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
