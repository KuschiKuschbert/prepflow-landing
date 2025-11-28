'use client';

import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { ClipboardCheck, MapPin, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader } from '../components/static/PageHeader';
import { AreaCard } from './components/AreaCard';
import { CleaningGrid } from './components/CleaningGrid';
import { CleaningStats } from './components/CleaningStats';
import { CleaningTabs } from './components/CleaningTabs';
import { GridFilterBar } from './components/GridFilterBar';
import { useCleaningAreas } from './hooks/useCleaningAreas';
import { useCleaningHandlers } from './hooks/useCleaningHandlers';
import { useCleaningKeyboardShortcuts } from './hooks/useCleaningKeyboardShortcuts';
import { useCleaningModals } from './hooks/useCleaningModals';
import { useCleaningPageData } from './hooks/useCleaningPageData';
import { useStatsDates } from './hooks/useStatsDates';

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
  const [activeTab, setActiveTab] = useState<'grid' | 'areas'>('grid');
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

  const { areas, setAreas, tasks, loading, refetchTasks } = useCleaningPageData(
    startDate,
    endDate,
    activeTab,
  );
  const statsDates = useStatsDates(gridFilter, startDate, endDate);

  const {
    showAddArea,
    setShowAddArea,
    showCreateTask,
    setShowCreateTask,
    closeCreateTask,
    showAreaTasks,
    setShowAreaTasks,
    closeAreaTasks,
    selectedArea,
    preselectedAreaId,
  } = useCleaningModals();

  // CRUD hooks
  const {
    handleAddArea: addArea,
    handleDeleteArea,
    ConfirmDialog: AreaConfirmDialog,
  } = useCleaningAreas({
    areas,
    setAreas,
    onTaskRefresh: refetchTasks,
  });

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addArea(newArea);
    if (result.success) {
      setNewArea({ area_name: '', description: '', cleaning_frequency: '' });
      setShowAddArea(false);
    }
  };

  const { handleViewTasks, handleTaskCreated, handleTaskUpdate } = useCleaningHandlers({
    areas,
    tasks,
    activeTab,
    refetchTasks,
    onCreateTask: () => setShowCreateTask(),
  });

  const handleAddTask = (areaId: string) => {
    setShowCreateTask(areaId);
  };

  const handleViewAreaTasks = (areaId: string) => {
    handleViewTasks(areaId, area => setShowAreaTasks(area));
  };

  useCleaningKeyboardShortcuts({
    activeTab,
    onCreateTask: () => setShowCreateTask(undefined),
    onAddArea: () => setShowAddArea(true),
    onSetActiveTab: setActiveTab,
  });

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
                  onClick={() => setShowCreateTask()}
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

          <CleaningTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'grid' && (
            <div className="space-y-6">
              <CleaningStats tasks={tasks} dates={statsDates} />

              <GridFilterBar gridFilter={gridFilter} onFilterChange={setGridFilter} />

              <CleaningGrid
                tasks={tasks}
                startDate={startDate}
                endDate={endDate}
                filter={gridFilter}
                onTaskUpdate={handleTaskUpdate}
                onCreateTask={() => setShowCreateTask()}
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
                      onViewTasks={handleViewAreaTasks}
                      onDelete={handleDeleteArea}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <CreateTaskForm
            isOpen={showCreateTask}
            onClose={closeCreateTask}
            onSuccess={handleTaskCreated}
            preselectedAreaId={preselectedAreaId}
          />

          <AreaTasksModal
            isOpen={showAreaTasks}
            area={selectedArea}
            onClose={closeAreaTasks}
            onTaskUpdate={handleTaskUpdate}
            onCreateTask={areaId => {
              setShowCreateTask(areaId);
              closeAreaTasks();
            }}
          />
        </div>
      </ResponsivePageContainer>
    </>
  );
}
