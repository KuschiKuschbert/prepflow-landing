'use client';

interface QuickTask {
  name: string;
  frequency: string;
  description?: string;
}

interface QuickTaskButtonsProps {
  onSelect: (task: QuickTask) => void;
  selectedAreaId?: string;
}

/**
 * Quick Task Buttons Component
 * Provides one-click task creation for common cleaning tasks
 */
export function QuickTaskButtons({ onSelect, selectedAreaId }: QuickTaskButtonsProps) {
  const quickTasks: QuickTask[] = [
    { name: 'Clean floor', frequency: 'daily', description: 'Sweep and mop' },
    {
      name: 'Wipe surfaces',
      frequency: 'daily',
      description: 'Clean countertops and work surfaces',
    },
    { name: 'Deep clean', frequency: 'weekly', description: 'Thorough cleaning' },
    { name: 'Sanitize equipment', frequency: 'daily', description: 'Clean and sanitize' },
    { name: 'Empty bins', frequency: 'daily', description: 'Empty and clean waste bins' },
    { name: 'Clean windows', frequency: 'weekly', description: 'Window cleaning' },
  ];

  if (!selectedAreaId) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-xs font-medium text-gray-400">Quick Add Common Tasks</div>
      <div className="flex flex-wrap gap-2">
        {quickTasks.map((task, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(task)}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-2 text-xs text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-[#29E7CD]"
            title={task.description}
          >
            {task.name}
          </button>
        ))}
      </div>
    </div>
  );
}
