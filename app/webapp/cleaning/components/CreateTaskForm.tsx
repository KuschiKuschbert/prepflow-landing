'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useCreateTaskForm } from './CreateTaskForm/helpers/useCreateTaskForm';
import { useFormValidation } from './CreateTaskForm/helpers/useFormValidation';
import { useTaskSubmission } from './CreateTaskForm/helpers/useTaskSubmission';
import { useFormData } from './CreateTaskForm/helpers/useFormData';
import { useFilteredOptions } from './CreateTaskForm/helpers/useFilteredOptions';
import { useStaff } from '@/hooks/useStaff';
import { TaskNameField } from './CreateTaskForm/components/TaskNameField';
import { FrequencyField } from './CreateTaskForm/components/FrequencyField';
import { AdvancedOptions } from './CreateTaskForm/components/AdvancedOptions';

interface CreateTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedAreaId?: string;
}

/**
 * Create Task Form Component
 * Optimized form for creating new cleaning tasks with improved UX
 */
export function CreateTaskForm({
  isOpen,
  onClose,
  onSuccess,
  preselectedAreaId,
}: CreateTaskFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    formData,
    setFormData,
    frequencyManuallySet,
    setFrequencyManuallySet,
    taskNameInputRef,
    suggestedFrequency,
    formProgress,
    isFormValid,
  } = useCreateTaskForm(preselectedAreaId);

  const { errors, setErrors, validateField } = useFormValidation();
  const { areas, equipment, sections, fetching } = useFormData(isOpen);
  const { staff, loading: staffLoading } = useStaff();
  const { filteredEquipment, filteredSections } = useFilteredOptions(
    equipment,
    sections,
    areas,
    formData.area_id,
  );

  const { loading, handleSubmit } = useTaskSubmission({
    formData,
    preselectedAreaId,
    onSuccess,
    onClose,
    setFormData,
    setErrors,
    setShowAdvanced,
    setFrequencyManuallySet,
    taskNameInputRef,
    validateField,
  });

  // Auto-focus task name input when modal opens
  useEffect(() => {
    if (isOpen && taskNameInputRef.current) {
      setTimeout(() => {
        taskNameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, taskNameInputRef]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Update area_id when preselectedAreaId changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedAreaId) {
        setFormData(prev => ({ ...prev, area_id: preselectedAreaId }));
      } else {
        setFormData({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: '',
          equipment_id: '',
          section_id: '',
          description: '',
          assigned_to_employee_id: '',
        });
      }
      setErrors({});
      setShowAdvanced(false);
      setFrequencyManuallySet(false);
    }
  }, [isOpen, preselectedAreaId, setFormData, setErrors, setFrequencyManuallySet]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-modal-title"
    >
      <div
        className="tablet:max-w-lg desktop:max-w-xl tablet:p-5 relative mb-8 w-full max-w-xl rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
          <div>
            <h2
              id="create-task-modal-title"
              className="tablet:text-2xl text-xl font-bold text-white"
            >
              Create Cleaning Task
            </h2>
            {formProgress.completed > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                {formProgress.completed} of {formProgress.total} required fields completed
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <Icon icon={X} size="lg" aria-hidden={true} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <TaskNameField
              value={formData.task_name}
              onChange={value => {
                setFormData({ ...formData, task_name: value });
                validateField('task_name', value);
              }}
              onBlur={value => validateField('task_name', value)}
              error={errors.task_name}
              inputRef={taskNameInputRef}
            />

            {!preselectedAreaId && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                  Area <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.area_id}
                  onChange={e => {
                    setFormData({ ...formData, area_id: e.target.value });
                    validateField('area_id', e.target.value);
                  }}
                  onBlur={e => validateField('area_id', e.target.value)}
                  disabled={fetching}
                  className={`w-full rounded-2xl border ${
                    errors.area_id ? 'border-red-500/50' : 'border-[#2a2a2a]'
                  } bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] ${
                    fetching ? 'opacity-50' : ''
                  }`}
                  required
                >
                  <option value="">{fetching ? 'Loading areas...' : 'Select an area'}</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.area_name}
                    </option>
                  ))}
                </select>
                {errors.area_id && (
                  <p className="mt-1 text-xs text-red-400" role="alert">
                    {errors.area_id}
                  </p>
                )}
              </div>
            )}

            <FrequencyField
              value={formData.frequency_type}
              customDaysInterval={formData.customDaysInterval}
              onChange={value => {
                setFrequencyManuallySet(true);
                setFormData({ ...formData, frequency_type: value });
                validateField('frequency_type', value);
              }}
              onCustomDaysChange={days => {
                setFormData({ ...formData, customDaysInterval: days });
                validateField('customDaysInterval', days.toString());
              }}
              onBlur={value => validateField('frequency_type', value)}
              error={errors.frequency_type}
              suggestedFrequency={suggestedFrequency}
              areaId={formData.area_id}
              onManualSet={() => setFrequencyManuallySet(true)}
            />
          </div>

          <AdvancedOptions
            showAdvanced={showAdvanced}
            onToggle={() => setShowAdvanced(!showAdvanced)}
            equipment={equipment}
            filteredEquipment={filteredEquipment}
            sections={sections}
            filteredSections={filteredSections}
            equipmentId={formData.equipment_id}
            sectionId={formData.section_id}
            description={formData.description}
            areaId={formData.area_id}
            assignedToEmployeeId={formData.assigned_to_employee_id}
            staff={staff}
            staffLoading={staffLoading}
            onEquipmentChange={id => setFormData({ ...formData, equipment_id: id })}
            onSectionChange={id => setFormData({ ...formData, section_id: id })}
            onAssignedToChange={id => setFormData({ ...formData, assigned_to_employee_id: id })}
            onDescriptionChange={desc => setFormData({ ...formData, description: desc })}
          />

          <div className="desktop:flex-row desktop:justify-between flex flex-col-reverse gap-2 border-t border-[#2a2a2a] pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a] disabled:opacity-50"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {isFormValid && (
                <button
                  type="button"
                  onClick={e => handleSubmit(e as React.FormEvent, true)}
                  disabled={loading || !isFormValid}
                  className="rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create & Add Another
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs text-gray-500">
              Press <kbd className="rounded bg-[#2a2a2a] px-2 py-1 text-xs">Enter</kbd> to submit,{' '}
              <kbd className="rounded bg-[#2a2a2a] px-2 py-1 text-xs">Esc</kbd> to close
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
