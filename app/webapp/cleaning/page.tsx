'use client';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { AddAreaForm } from './components/AddAreaForm';
import { AddTaskForm } from './components/AddTaskForm';
import { AreaCard } from './components/AreaCard';
import { useCleaningTasksQuery } from './hooks/useCleaningTasksQuery';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { ClipboardCheck, MapPin, Plus } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
interface CleaningArea {
  id: number;
  name: string;
  description: string;
  frequency_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
  cleaning_areas: CleaningArea;
}

export default function CleaningRosterPage() {
  const { t } = useTranslation();
  const [areas, setAreas] = useState<CleaningArea[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'areas' | 'tasks'>('areas');
  const [showAddArea, setShowAddArea] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', description: '', frequency_days: 7 });
  const [newTask, setNewTask] = useState({ area_id: '', assigned_date: '', notes: '' });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data: tasksData, isLoading: tasksLoading } = useCleaningTasksQuery(page, pageSize);
  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/cleaning-areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (error) {
      logger.error('Error fetching areas:', error);
    }
  };
  useEffect(() => {
    setTimeout(() => fetchAreas(), 0);
  }, []);
  useEffect(() => {
    const td = tasksData as any;
    if (td?.items) setTimeout(() => setTasks(td.items as any), 0);
  }, [tasksData]);
  const total = (tasksData as any)?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cleaning-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArea),
      });
      const data = await response.json();
      if (data.success) {
        setAreas([...areas, data.data]);
        setNewArea({ name: '', description: '', frequency_days: 7 });
        setShowAddArea(false);
      }
    } catch (error) {
      logger.error('Error adding area:', error);
    }
  };
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cleaning-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          area_id: parseInt(newTask.area_id),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setNewTask({ area_id: '', assigned_date: '', notes: '' });
        setShowAddTask(false);
      }
    } catch (error) {
      logger.error('Error adding task:', error);
    }
  };
  const handleCompleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/cleaning-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          status: 'completed',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks(
          tasks.map(task =>
            task.id === taskId
              ? { ...task, status: 'completed', completed_date: data.data.completed_date }
              : task,
          ),
        );
      }
    } catch (error) {
      logger.error('Error completing task:', error);
    }
  };
  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="adaptive-grid mt-8">
            <LoadingSkeleton variant="card" count={4} height="120px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }
  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
            <Icon icon={ClipboardCheck} size="lg" aria-hidden={true} />
            {t('cleaning.title', 'Cleaning Roster')}
          </h1>
          <p className="text-gray-400">
            {t(
              'cleaning.subtitle',
              'Manage cleaning areas and track completion with photo verification',
            )}
          </p>
        </div>
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            {(['areas', 'tasks'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#29E7CD] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'areas' ? (
                    <MapPin className="mr-2 inline h-4 w-4" />
                  ) : (
                    <Icon icon={ClipboardCheck} size="sm" className="mr-2" aria-hidden={true} />
                  )}
                  {tab === 'areas'
                    ? t('cleaning.areas', 'Cleaning Areas')
                    : t('cleaning.tasks', 'Cleaning Tasks')}
                </button>
              );
            })}
          </div>
        </div>
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {t('cleaning.manageAreas', 'Manage Cleaning Areas')}
              </h2>
              <button
                onClick={() => setShowAddArea(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                <Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />
                {t('cleaning.addArea', 'Add Area')}
              </button>
            </div>
            {showAddArea && (
              <AddAreaForm
                newArea={newArea}
                onAreaChange={setNewArea}
                onSubmit={handleAddArea}
                onCancel={() => setShowAddArea(false)}
              />
            )}
            <div className="adaptive-grid">
              {areas.map(area => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {t('cleaning.manageTasks', 'Manage Cleaning Tasks')}
              </h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                <Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />
                {t('cleaning.addTask', 'Add Task')}
              </button>
            </div>
            {showAddTask && (
              <AddTaskForm
                newTask={newTask}
                areas={areas}
                onTaskChange={setNewTask}
                onSubmit={handleAddTask}
                onCancel={() => setShowAddTask(false)}
              />
            )}
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
              ))}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages} ({total} items)
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsivePageContainer>
  );
}
