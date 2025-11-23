'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { CleaningGrid } from './components/CleaningGrid';
import { CleaningStats } from './components/CleaningStats';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { PageHeader } from '../components/static/PageHeader';
import { ClipboardCheck, Plus, MapPin } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { useCleaningAreas } from './hooks/useCleaningAreas';
import { useCleaningTasks } from './hooks/useCleaningTasks';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

// Lazy load modals - only load when needed
const CreateTaskForm = dynamic(
  () => import('./components/CreateTaskForm').then(mod => ({ default: mod.CreateTaskForm })),
  {
    ssr: false,
    loading: () => null, // Modals handle their own loading states
  },
);

const AddAreaForm = dynamic(
  () => import('./components/AddAreaForm').then(mod => ({ default: mod.AddAreaForm })),
  {
    ssr: false,
    loading: () => null,
  },
);

const AreaTasksModal = dynamic(
  () => import('./components/AreaTasksModal').then(mod => ({ default: mod.AreaTasksModal })),
  {
    ssr: false,
    loading: () => null,
  },
);

// Import AreaCard normally since it's small and used frequently
import { AreaCard } from './components/AreaCard';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CleaningRosterPage() {
  // Initialize with empty arrays to avoid hydration mismatch
  // Cached data will be loaded in useEffect after mount
  const [areas, setAreas] = useState<CleaningArea[]>([]);
  const [tasks, setTasks] = useState<TaskWithCompletions[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'areas'>('grid');
  const [showAddArea, setShowAddArea] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAreaTasks, setShowAreaTasks] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CleaningArea | null>(null);
  const [preselectedAreaId, setPreselectedAreaId] = useState<string | undefined>();
  const [gridFilter, setGridFilter] = useState<'today' | 'next2days' | 'week' | 'all'>('all');
  const [newArea, setNewArea] = useState({
    area_name: '',
    description: '',
    cleaning_frequency: '',
  });

  // Calculate 14-day date range (today + 13 days ahead)
  // Use useState to avoid hydration mismatch from Date.now() differences
  const [dateRange] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + 13);
    return {
      startDate: today,
      endDate: end,
    };
  });
  const { startDate, endDate } = dateRange;

  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis([
      '/api/cleaning-areas',
      `/api/cleaning-tasks?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
    ]);
  }, [startDate, endDate]);

  // Memoize fetch functions to prevent recreation on every render
  const fetchAreas = useCallback(async () => {
    try {
      const response = await fetch('/api/cleaning-areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
        cacheData('cleaning_areas', data.data);
      }
    } catch (error) {
      logger.error('Error fetching areas:', error);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const response = await fetch(
        `/api/cleaning-tasks?start_date=${startDateStr}&end_date=${endDateStr}`,
      );
      const data = await response.json();
      if (data.success && data.data) {
        setTasks(data.data);
        cacheData('cleaning_tasks_grid', data.data);
      }
    } catch (error) {
      logger.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Load cached data for instant display (client-only)
    const cachedAreas = getCachedData<CleaningArea[]>('cleaning_areas');
    if (cachedAreas && cachedAreas.length > 0) {
      setAreas(cachedAreas);
    }

    // Load cached tasks for instant display (grid is default tab)
    const cachedTasks = getCachedData<TaskWithCompletions[]>('cleaning_tasks_grid');
    if (cachedTasks && cachedTasks.length > 0) {
      setTasks(cachedTasks);
      setTasksFetched(true); // Mark as fetched if we have cached data
    }

    // Fetch fresh data
    fetchAreas();
  }, [fetchAreas]);

  // Track if tasks have been fetched to avoid unnecessary reloads
  const [tasksFetched, setTasksFetched] = useState(false);

  useEffect(() => {
    // Only fetch tasks when grid tab is active and tasks haven't been fetched yet
    if (activeTab === 'grid' && !tasksFetched) {
      fetchTasks();
      setTasksFetched(true);
    }
  }, [activeTab, fetchTasks, tasksFetched]);

  // CRUD hooks
  const {
    handleAddArea: addArea,
    handleDeleteArea,
    ConfirmDialog: AreaConfirmDialog,
  } = useCleaningAreas({
    areas,
    setAreas,
    onTaskRefresh: fetchTasks,
  });

  // Memoize event handlers to prevent recreation on every render
  const handleAddArea = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await addArea(newArea);
      if (result.success) {
        setNewArea({ area_name: '', description: '', cleaning_frequency: '' });
        setShowAddArea(false);
      }
    },
    [addArea, newArea],
  );

  // Remove unnecessary fetchTasks calls - optimistic updates handle UI updates
  // Only refresh if we're on the grid tab and need fresh data
  const handleTaskCreated = useCallback(() => {
    if (activeTab === 'grid') {
      // Small delay to allow optimistic updates to complete
      setTimeout(() => {
        fetchTasks();
      }, 100);
    }
  }, [activeTab, fetchTasks]);

  const handleTaskUpdate = useCallback(() => {
    if (activeTab === 'grid') {
      // Small delay to allow optimistic updates to complete
      setTimeout(() => {
        fetchTasks();
      }, 100);
    }
  }, [activeTab, fetchTasks]);

  // Calculate dates for stats (based on current filter)
  const statsDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredStart: Date;
    let filteredEnd: Date;

    switch (gridFilter) {
      case 'today':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        break;
      case 'next2days':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 2);
        break;
      case 'week':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 6);
        break;
      case 'all':
      default:
        filteredStart = new Date(startDate);
        filteredEnd = new Date(endDate);
        break;
    }

    const dateArray: string[] = [];
    const current = new Date(filteredStart);
    const end = new Date(filteredEnd);

    while (current <= end) {
      dateArray.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dateArray;
  }, [gridFilter, startDate, endDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input/textarea
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        return;
      }

      // N for new task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowCreateTask(true);
      }

      // A for add area (when on areas tab)
      if ((e.key === 'a' || e.key === 'A') && activeTab === 'areas') {
        e.preventDefault();
        setShowAddArea(true);
      }

      // G for grid tab, M for areas tab (Manage)
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setActiveTab('grid');
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setActiveTab('areas');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Memoize area tasks lookup to avoid recalculating on every render
  // MUST be before early return to follow rules of hooks
  const areaTasksMap = useMemo(() => {
    const map = new Map<string, TaskWithCompletions[]>();
    tasks.forEach(task => {
      if (!task.area_id) return; // Skip tasks without area_id
      const existing = map.get(task.area_id) || [];
      map.set(task.area_id, [...existing, task]);
    });
    return map;
  }, [tasks]);

  // Memoize handlers for area cards
  // MUST be before early return to follow rules of hooks
  const handleViewTasks = useCallback(
    (areaId: string) => {
      const areaToShow = areas.find(a => a.id === areaId);
      if (!areaToShow) return;

      // Use memoized map instead of filtering
      const areaTasks = areaTasksMap.get(areaId) || [];

      if (areaTasks.length === 0) {
        // No tasks - directly open create task form instead of modal
        setPreselectedAreaId(areaId);
        setShowCreateTask(true);
      } else {
        // Has tasks - open modal to view them
        setSelectedArea(areaToShow);
        setShowAreaTasks(true);
      }
    },
    [areas, areaTasksMap],
  );

  const handleAddTask = useCallback((areaId: string) => {
    setPreselectedAreaId(areaId);
    setShowCreateTask(true);
  }, []);

  if (loading && tasks.length === 0 && activeTab === 'grid') {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <PageSkeleton />
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <>
      {typeof window !== 'undefined' && createPortal(<AreaConfirmDialog />, document.body)}
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <PageHeader
            title="Cleaning Roster"
            subtitle="Manage cleaning areas and track task completion with a 14-day calendar grid"
            icon={ClipboardCheck}
            actions={
              activeTab === 'grid' ? (
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:shadow-lg"
                  title="Create new task (N)"
                >
                  <Icon icon={Plus} size="sm" aria-hidden={true} />
                  <span className="tablet:inline hidden">New Task</span>
                  <span className="tablet:hidden">New</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAddArea(true)}
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                  title="Add new cleaning area (A)"
                >
                  <Icon icon={Plus} size="sm" className="mr-2 inline" aria-hidden={true} />
                  Add Area
                </button>
              )
            }
          >
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>
                Press <kbd className="rounded bg-[#2a2a2a] px-2 py-1">N</kbd> to create task
              </span>
              <span>•</span>
              <span>
                Press <kbd className="rounded bg-[#2a2a2a] px-2 py-1">G</kbd> for grid,{' '}
                <kbd className="rounded bg-[#2a2a2a] px-2 py-1">M</kbd> for areas
              </span>
            </div>
          </PageHeader>

          <div className="mb-8">
            <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
              {(['grid', 'areas'] as const).map(tab => {
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
                    {tab === 'grid' ? (
                      <Icon icon={ClipboardCheck} size="sm" className="mr-2" aria-hidden={true} />
                    ) : (
                      <MapPin className="mr-2 inline h-4 w-4" />
                    )}
                    {tab === 'grid' ? 'Cleaning Grid' : 'Cleaning Areas'}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'grid' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <CleaningStats tasks={tasks} dates={statsDates} />

              {/* Action Bar with Filters */}
              <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold text-white">Cleaning Grid</h2>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {(['today', 'next2days', 'week', 'all'] as const).map(filterOption => (
                    <button
                      key={filterOption}
                      onClick={() => setGridFilter(filterOption)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        gridFilter === filterOption
                          ? 'bg-[#29E7CD] text-black shadow-lg'
                          : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                      }`}
                    >
                      {filterOption === 'today'
                        ? 'Today'
                        : filterOption === 'next2days'
                          ? 'Next 2 Days'
                          : filterOption === 'week'
                            ? 'This Week'
                            : 'All (14 Days)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleaning Grid */}
              <CleaningGrid
                tasks={tasks}
                startDate={startDate}
                endDate={endDate}
                filter={gridFilter}
                onTaskUpdate={handleTaskUpdate}
                onCreateTask={() => setShowCreateTask(true)}
              />
            </div>
          )}

          {activeTab === 'areas' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Manage Cleaning Areas</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Organize your cleaning tasks by area. Click an area to add tasks.
                </p>
              </div>
              {showAddArea && (
                <AddAreaForm
                  newArea={newArea}
                  onAreaChange={area =>
                    setNewArea({ ...area, cleaning_frequency: area.cleaning_frequency || '' })
                  }
                  onSubmit={handleAddArea}
                  onCancel={() => setShowAddArea(false)}
                />
              )}
              {areas.length === 0 ? (
                <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-12 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
                      <Icon icon={MapPin} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">No cleaning areas yet</h3>
                  <p className="mb-6 text-gray-400">
                    Create your first cleaning area to organize your cleaning tasks.
                  </p>
                  <button
                    onClick={() => setShowAddArea(true)}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                  >
                    <Icon icon={Plus} size="sm" aria-hidden={true} />
                    Create Your First Area
                  </button>
                </div>
              ) : (
                <div className="adaptive-grid">
                  {areas.map(area => (
                    <AreaCard
                      key={area.id}
                      area={area}
                      onAddTask={handleAddTask}
                      onViewTasks={handleViewTasks}
                      onDelete={handleDeleteArea}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Task Modal */}
          <CreateTaskForm
            isOpen={showCreateTask}
            onClose={() => {
              setShowCreateTask(false);
              setPreselectedAreaId(undefined);
            }}
            onSuccess={handleTaskCreated}
            preselectedAreaId={preselectedAreaId}
          />

          {/* Area Tasks Modal */}
          <AreaTasksModal
            isOpen={showAreaTasks}
            area={selectedArea}
            onClose={() => {
              setShowAreaTasks(false);
              setSelectedArea(null);
            }}
            onTaskUpdate={handleTaskUpdate}
            onCreateTask={areaId => {
              setPreselectedAreaId(areaId);
              setShowCreateTask(true);
              setShowAreaTasks(false);
            }}
          />
        </div>
      </ResponsivePageContainer>
    </>
  );
}
