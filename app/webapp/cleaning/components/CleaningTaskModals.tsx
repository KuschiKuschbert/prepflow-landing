'use client';

import dynamic from 'next/dynamic';

// Lazy load modals - only load when needed
const CreateTaskForm = dynamic(
  () => import('./CreateTaskForm').then(mod => ({ default: mod.CreateTaskForm })),
  {
    ssr: false,
    loading: () => null,
  },
);

const AddAreaForm = dynamic(
  () => import('./AddAreaForm').then(mod => ({ default: mod.AddAreaForm })),
  {
    ssr: false,
    loading: () => null,
  },
);

const AreaTasksModal = dynamic(
  () => import('./AreaTasksModal').then(mod => ({ default: mod.AreaTasksModal })),
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
}

interface NewAreaInput {
  area_name: string;
  description: string;
  cleaning_frequency: string;
}

interface CleaningTaskModalsProps {
  showCreateTask: boolean;
  closeCreateTask: () => void;
  handleTaskCreated: () => void;
  preselectedAreaId?: string;
  showAreaTasks: boolean;
  selectedArea: CleaningArea | null;
  closeAreaTasks: () => void;
  handleTaskUpdate: () => void;
  setShowCreateTask: (areaId?: string) => void;
  showAddArea: boolean;
  newArea: NewAreaInput;
  setNewArea: (area: NewAreaInput) => void;
  handleAddArea: (e: React.FormEvent) => void;
  setShowAddArea: (show: boolean) => void;
}

export function CleaningTaskModals({
  showCreateTask,
  closeCreateTask,
  handleTaskCreated,
  preselectedAreaId,
  showAreaTasks,
  selectedArea,
  closeAreaTasks,
  handleTaskUpdate,
  setShowCreateTask,
  showAddArea,
  newArea,
  setNewArea,
  handleAddArea,
  setShowAddArea,
}: CleaningTaskModalsProps) {
  return (
    <>
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
    </>
  );
}
