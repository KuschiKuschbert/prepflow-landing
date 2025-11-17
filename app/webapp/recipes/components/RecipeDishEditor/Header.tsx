import { Icon } from '@/components/ui/Icon';
import { ArrowLeft } from 'lucide-react';

export function RecipeDishEditorHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Back to list"
        >
          <Icon icon={ArrowLeft} size="md" aria-hidden={true} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Recipe & Dish Editor</h2>
          <p className="text-sm text-gray-400">Select a recipe or dish to edit its ingredients</p>
        </div>
      </div>
    </div>
  );
}
