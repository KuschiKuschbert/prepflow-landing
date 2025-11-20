import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { BookOpen, UtensilsCrossed } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  type: 'recipe' | 'dish';
}

interface RecipeDishSelectorProps {
  allItems: Item[];
  selectedItem: Item | null;
  onSelectItem: (item: Item) => void;
  capitalizeName: (name: string) => string;
}

export function RecipeDishSelector({
  allItems,
  selectedItem,
  onSelectItem,
  capitalizeName,
}: RecipeDishSelectorProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Select Recipe or Dish</h3>
      <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
        {allItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-gray-400">
            <p>No recipes or dishes found</p>
          </div>
        ) : (
          allItems.map(item => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                logger.dev('RecipeDishSelector: Item clicked', { item });
                onSelectItem(item);
              }}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedItem?.id === item.id && selectedItem?.type === item.type
                  ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                  : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#29E7CD]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon={item.type === 'recipe' ? BookOpen : UtensilsCrossed}
                    size="md"
                    className={item.type === 'recipe' ? 'text-[#3B82F6]' : 'text-[#29E7CD]'}
                    aria-hidden={true}
                  />
                  <div>
                    <p className="font-medium text-white">{capitalizeName(item.name)}</p>
                    <p className="text-xs text-gray-400">
                      {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
