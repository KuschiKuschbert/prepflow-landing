'use client';

import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { logger } from '@/lib/logger';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CleaningAreaList } from './components/CleaningAreaList';
import { CleaningHeader } from './components/CleaningHeader';
import { CleaningSchedule } from './components/CleaningSchedule';
import { CleaningTabs } from './components/CleaningTabs';
import { CleaningTaskModals } from './components/CleaningTaskModals';
import { useCleaningAreas } from './hooks/useCleaningAreas';
import { useCleaningExport } from './hooks/useCleaningExport';
import { useCleaningHandlers } from './hooks/useCleaningHandlers';
import { useCleaningKeyboardShortcuts } from './hooks/useCleaningKeyboardShortcuts';
import { useCleaningModals } from './hooks/useCleaningModals';
import { useCleaningPageData } from './hooks/useCleaningPageData';
import { useStatsDates } from './hooks/useStatsDates';

function CleaningRosterContent() {
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState<'grid' | 'areas'>('grid');
  const [gridFilter, setGridFilter] = useState<'today' | 'next2days' | 'week' | 'all'>('all');
  const [newArea, setNewArea] = useState({
    area_name: '',
    description: '',
    cleaning_frequency: '',
  });

  // Calculate 14-day date range (today + 13 days ahead)
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const areaParam = searchParams.get('area');

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

  // QR code deep link: open area tasks when ?area=id is in URL
  const processedAreaRef = useRef(false);
  useEffect(() => {
    if (!areaParam || loading || areas.length === 0 || processedAreaRef.current) return;
    const area = areas.find(a => a.id === areaParam);
    if (area) {
      processedAreaRef.current = true;
      setActiveTab('areas');
      setShowAreaTasks(area);
      router.replace('/webapp/cleaning', { scroll: false });
    }
  }, [areaParam, loading, areas, setShowAreaTasks, router]);

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
    try {
      const result = await addArea(newArea);
      if (result.success) {
        setNewArea({ area_name: '', description: '', cleaning_frequency: '' });
        setShowAddArea(false);
      }
    } catch (err) {
      logger.error('[Cleaning Page] Error adding area:', { error: err });
    }
  };

  const { handleViewTasks, handleTaskCreated, handleTaskUpdate } = useCleaningHandlers({
    areas,
    tasks,
    activeTab,
    onCreateTask: () => setShowCreateTask(),
  });

  const { exportLoading, handlePrint, handleExport } = useCleaningExport({
    tasks,
    startDate,
    endDate,
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
          <CleaningHeader
            activeTab={activeTab}
            onCreateTask={() => setShowCreateTask()}
            onAddArea={() => setShowAddArea(true)}
          />

          {PAGE_TIPS_CONFIG.cleaning && (
            <div className="mb-6">
              <PageTipsCard config={PAGE_TIPS_CONFIG.cleaning} />
            </div>
          )}

          <CleaningTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'grid' && (
            <CleaningSchedule
              tasks={tasks}
              statsDates={statsDates}
              startDate={startDate}
              endDate={endDate}
              gridFilter={gridFilter}
              setGridFilter={setGridFilter}
              exportLoading={exportLoading}
              onPrint={handlePrint}
              onExport={handleExport}
              handleTaskUpdate={handleTaskUpdate}
              onCreateTask={() => setShowCreateTask()}
            />
          )}

          {activeTab === 'areas' && (
            <CleaningAreaList
              areas={areas}
              onAddTask={handleAddTask}
              onViewTasks={handleViewAreaTasks}
              onDelete={handleDeleteArea}
              onAddArea={() => setShowAddArea(true)}
            />
          )}

          <CleaningTaskModals
            showCreateTask={showCreateTask}
            closeCreateTask={closeCreateTask}
            handleTaskCreated={handleTaskCreated}
            preselectedAreaId={preselectedAreaId}
            showAreaTasks={showAreaTasks}
            selectedArea={selectedArea}
            closeAreaTasks={closeAreaTasks}
            handleTaskUpdate={handleTaskUpdate}
            setShowCreateTask={setShowCreateTask}
            showAddArea={showAddArea}
            newArea={newArea}
            setNewArea={setNewArea}
            handleAddArea={handleAddArea}
            setShowAddArea={setShowAddArea}
          />
        </div>
      </ResponsivePageContainer>
    </>
  );
}

export default function CleaningRosterPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CleaningRosterContent />
    </Suspense>
  );
}
