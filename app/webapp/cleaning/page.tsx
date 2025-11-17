'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { useCleaningTasksQuery } from './hooks/useCleaningTasksQuery';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { Sparkles, ClipboardCheck, MapPin, Plus } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

import { logger } from '../../lib/logger';
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
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
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
    // Use setTimeout to avoid synchronous setState in effect (fetchAreas calls setAreas)
    setTimeout(() => {
      fetchAreas();
    }, 0);
  }, []);

  useEffect(() => {
    const td = tasksData as any;
    if (td?.items) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setTasks(td.items as any);
      }, 0);
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
            <Icon icon={Sparkles} size="lg" aria-hidden={true} />
            {t('cleaning.title', 'Cleaning Roster')}
          </h1>
          <p className="text-gray-400">
            {t(
              'cleaning.subtitle',
              'Manage cleaning areas and track completion with photo verification',
            )}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            <button
              onClick={() => setActiveTab('areas')}
              className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'areas'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapPin className="mr-2 inline h-4 w-4" />
              {t('cleaning.areas', 'Cleaning Areas')}
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'tasks'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon icon={ClipboardCheck} size="sm" className="mr-2" aria-hidden={true} />
              {t('cleaning.tasks', 'Cleaning Tasks')}
            </button>
          </div>
        </div>

        {/* Areas Tab */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            {/* Add Area Button */}
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

            {/* Add Area Form */}
            {showAddArea && (
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('cleaning.addNewArea', 'Add New Cleaning Area')}
                </h3>
                <form onSubmit={handleAddArea} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.areaName', 'Area Name')}
                    </label>
                    <input
                      type="text"
                      value={newArea.name}
                      onChange={e => setNewArea({ ...newArea, name: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="e.g., Kitchen Floors, Prep Tables"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.description', 'Description')}
                    </label>
                    <textarea
                      value={newArea.description}
                      onChange={e => setNewArea({ ...newArea, description: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="Describe what needs to be cleaned"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.frequency', 'Cleaning Frequency (days)')}
                    </label>
                    <input
                      type="number"
                      value={newArea.frequency_days}
                      onChange={e =>
                        setNewArea({ ...newArea, frequency_days: parseInt(e.target.value) })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                    >
                      {t('cleaning.save', 'Save Area')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddArea(false)}
                      className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                    >
                      {t('cleaning.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Areas Grid */}
            <div className="adaptive-grid">
              {areas.map(area => (
                <div
                  key={area.id}
                  className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                      <Icon
                        icon={Sparkles}
                        size="md"
                        className="text-[#29E7CD]"
                        aria-hidden={true}
                      />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        area.is_active
                          ? 'border border-green-400/20 bg-green-400/10 text-green-400'
                          : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
                      }`}
                    >
                      {area.is_active
                        ? t('cleaning.active', 'Active')
                        : t('cleaning.inactive', 'Inactive')}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{area.name}</h3>
                  <p className="mb-4 text-gray-400">
                    {area.description || t('cleaning.noDescription', 'No description provided')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('cleaning.everyDays', 'Every')} {area.frequency_days}{' '}
                      {t('cleaning.days', 'days')}
                    </span>
                    <button className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                      {t('cleaning.edit', 'Edit')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Add Task Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {t('cleaning.manageTasks', 'Manage Cleaning Tasks')}
              </h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                ➕ {t('cleaning.addTask', 'Add Task')}
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('cleaning.addNewTask', 'Add New Cleaning Task')}
                </h3>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.selectArea', 'Select Area')}
                    </label>
                    <select
                      value={newTask.area_id}
                      onChange={e => setNewTask({ ...newTask, area_id: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      required
                    >
                      <option value="">
                        {t('cleaning.selectAreaPlaceholder', 'Choose a cleaning area')}
                      </option>
                      {areas.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.assignedDate', 'Assigned Date')}
                    </label>
                    <input
                      type="date"
                      value={newTask.assigned_date}
                      onChange={e => setNewTask({ ...newTask, assigned_date: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('cleaning.notes', 'Notes')}
                    </label>
                    <textarea
                      value={newTask.notes}
                      onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="Additional notes or instructions"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                    >
                      {t('cleaning.save', 'Save Task')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                    >
                      {t('cleaning.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
              ))}

              {/* Pagination */}
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
