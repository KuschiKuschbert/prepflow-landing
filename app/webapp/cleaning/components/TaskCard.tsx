'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { useTranslation } from '@/lib/useTranslation';

interface CleaningTask {
  id: number;
  area_id: number;
  assigned_date: string;
  completed_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  cleaning_areas: {
    id: number;
    name: string;
    description: string;
    frequency_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface TaskCardProps {
  task: CleaningTask;
  onComplete: (taskId: number) => void;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return '✅';
    case 'overdue':
      return '⚠️';
    default:
      return '📋';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'overdue':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  }
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <span className="text-2xl">{getStatusIcon(task.status)}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{task.cleaning_areas.name}</h3>
            <p className="text-gray-400">{new Date(task.assigned_date).toLocaleDateString()}</p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>

      {task.notes && <p className="mb-4 text-gray-300">{task.notes}</p>}

      {task.completed_date && (
        <p className="mb-4 text-sm text-green-400">
          ✅ {t('cleaning.completedOn', 'Completed on')}{' '}
          {new Date(task.completed_date).toLocaleString()}
        </p>
      )}

      {task.photo_url && (
        <div className="mb-4">
          <OptimizedImage
            src={task.photo_url}
            alt="Cleaning verification"
            width={128}
            height={128}
            className="h-32 w-32 rounded-2xl border border-[#2a2a2a] object-cover"
          />
        </div>
      )}

      <div className="flex space-x-4">
        {task.status === 'pending' && (
          <button
            onClick={() => onComplete(task.id)}
            className="rounded-xl bg-[#29E7CD] px-4 py-2 font-semibold text-black transition-all duration-200 hover:shadow-lg"
          >
            ✅ {t('cleaning.markComplete', 'Mark Complete')}
          </button>
        )}
        <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
          📷 {t('cleaning.addPhoto', 'Add Photo')}
        </button>
        <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
          ✏️ {t('cleaning.edit', 'Edit')}
        </button>
      </div>
    </div>
  );
}


