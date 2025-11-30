/**
 * Empty state component for area tasks modal
 */

import { Icon } from '@/components/ui/Icon';
import { Plus, Circle } from 'lucide-react';

interface EmptyTasksStateProps {
  onCreateTask: () => void;
}

export function EmptyTasksState({ onCreateTask }: EmptyTasksStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mb-3 flex justify-center">
        <div className="tablet:h-20 tablet:w-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon
            icon={Circle}
            size="lg"
            className="tablet:size-xl text-[#29E7CD]"
            aria-hidden={true}
          />
        </div>
      </div>
      <h3 className="tablet:text-xl mb-1.5 text-lg font-semibold text-white">No tasks yet</h3>
      <p className="mb-4 text-gray-400">Create your first task for this area.</p>
      <button
        onClick={onCreateTask}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
      >
        <Icon icon={Plus} size="sm" aria-hidden={true} />
        Create First Task
      </button>
    </div>
  );
}

