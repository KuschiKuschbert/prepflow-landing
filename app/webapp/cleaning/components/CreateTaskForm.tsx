'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { X, ChevronDown, ChevronUp, Calendar, Info } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { FrequencyPreview } from './FrequencyPreview';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  location?: string;
}

interface KitchenSection {
  id: string;
  name: string;
}

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
}

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
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<CleaningArea[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sections, setSections] = useState<KitchenSection[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(false);
  const [frequencyManuallySet, setFrequencyManuallySet] = useState(false);
  const taskNameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    task_name: '',
    frequency_type: 'daily' as FrequencyType | string,
    customDaysInterval: 3,
    area_id: preselectedAreaId || '',
    equipment_id: '',
    section_id: '',
    description: '',
  });

  // Auto-focus task name input when modal opens
  useEffect(() => {
    if (isOpen && taskNameInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        taskNameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Enter to submit is handled by form onSubmit
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
        // Reset form when opening without preselection
        setFormData({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: '',
          equipment_id: '',
          section_id: '',
          description: '',
        });
      }
      setErrors({});
      setShowAdvanced(false);
      setFrequencyManuallySet(false); // Reset manual flag when modal opens
    }
  }, [isOpen, preselectedAreaId]);

  useEffect(() => {
    if (isOpen) {
      setFetching(true);
      Promise.all([fetchAreas(), fetchEquipment(), fetchSections()]).finally(() => {
        setFetching(false);
      });
    }
  }, [isOpen]);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/cleaning-areas');
      const data = await response.json();
      if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (error) {
      logger.error('Error fetching areas:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      if (data.success && data.data) {
        setEquipment(data.data);
      }
    } catch (error) {
      logger.error('Error fetching equipment:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/kitchen-sections');
      const data = await response.json();
      if (data.success && data.data) {
        setSections(data.data);
      }
    } catch (error) {
      logger.error('Error fetching sections:', error);
    }
  };

  // Smart filtering: Filter equipment/sections based on selected area
  const filteredEquipment = useMemo(() => {
    if (!formData.area_id || equipment.length === 0) return equipment;
    const selectedArea = areas.find(a => a.id === formData.area_id);
    if (!selectedArea) return equipment;

    // Filter equipment that matches area name or location
    return equipment.filter(eq => {
      const areaNameLower = selectedArea.area_name.toLowerCase();
      const eqLocationLower = (eq.location || '').toLowerCase();
      const eqNameLower = eq.name.toLowerCase();

      return (
        eqLocationLower.includes(areaNameLower) ||
        areaNameLower.includes(eqLocationLower) ||
        eqNameLower.includes(areaNameLower)
      );
    });
  }, [equipment, formData.area_id, areas]);

  const filteredSections = useMemo(() => {
    if (!formData.area_id || sections.length === 0) return sections;
    const selectedArea = areas.find(a => a.id === formData.area_id);
    if (!selectedArea) return sections;

    // Filter sections that match area name
    return sections.filter(section => {
      const areaNameLower = selectedArea.area_name.toLowerCase();
      const sectionNameLower = section.name.toLowerCase();
      return sectionNameLower.includes(areaNameLower) || areaNameLower.includes(sectionNameLower);
    });
  }, [sections, formData.area_id, areas]);

  // Frequency recommendations based on task name
  const suggestedFrequency = useMemo(() => {
    const taskNameLower = formData.task_name.toLowerCase();
    if (
      taskNameLower.includes('floor') ||
      taskNameLower.includes('wipe') ||
      taskNameLower.includes('surface')
    ) {
      return 'daily';
    }
    if (taskNameLower.includes('deep') || taskNameLower.includes('thorough')) {
      return 'weekly';
    }
    if (taskNameLower.includes('seal') || taskNameLower.includes('filter')) {
      return 'weekly';
    }
    return null;
  }, [formData.task_name]);

  // Auto-apply suggested frequency when task name changes (only if not manually set)
  useEffect(() => {
    if (suggestedFrequency && !frequencyManuallySet && formData.task_name.length > 3) {
      setFormData(prev => ({ ...prev, frequency_type: suggestedFrequency }));
    }
  }, [suggestedFrequency, formData.task_name, frequencyManuallySet]);

  // Form completion progress
  const formProgress = useMemo(() => {
    const requiredFields = [
      formData.task_name.trim().length >= 3,
      !!formData.area_id,
      !!formData.frequency_type,
    ];
    const completed = requiredFields.filter(Boolean).length;
    return { completed, total: requiredFields.length };
  }, [formData.task_name, formData.area_id, formData.frequency_type]);

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'task_name':
        if (!value.trim()) {
          newErrors.task_name = 'Task name is required';
        } else if (value.trim().length < 3) {
          newErrors.task_name = 'Task name must be at least 3 characters';
        }
        break;
      case 'area_id':
        if (!value) {
          newErrors.area_id = 'Please select an area';
        }
        break;
      case 'frequency_type':
        if (!value) {
          newErrors.frequency_type = 'Please select a frequency';
        }
        break;
      case 'customDaysInterval':
        const days = parseInt(value, 10);
        if (isNaN(days) || days < 1 || days > 365) {
          newErrors.customDaysInterval = 'Days must be between 1 and 365';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, keepOpen = false) => {
    e.preventDefault();

    // Validate all required fields
    const isTaskNameValid = validateField('task_name', formData.task_name);
    const isAreaValid = validateField('area_id', formData.area_id);
    const isFrequencyValid = validateField('frequency_type', formData.frequency_type);

    if (!isTaskNameValid || !isAreaValid || !isFrequencyValid) {
      showError('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    // Convert custom-days to every-X-days format
    let frequencyType = formData.frequency_type;
    if (frequencyType === 'custom-days') {
      frequencyType = `every-${formData.customDaysInterval}-days` as FrequencyType;
    }

    try {
      const response = await fetch('/api/cleaning-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: formData.task_name.trim(),
          frequency_type: frequencyType,
          area_id: formData.area_id,
          equipment_id: formData.equipment_id || null,
          section_id: formData.section_id || null,
          description: formData.description?.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to create task');
      }

      showSuccess('Cleaning task created successfully');

      if (keepOpen) {
        // Reset form but keep area selected for "add another"
        setFormData(prev => ({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: prev.area_id, // Keep area
          equipment_id: '',
          section_id: '',
          description: '',
        }));
        setErrors({});
        setFrequencyManuallySet(false);
        taskNameInputRef.current?.focus();
      } else {
        setFormData({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: preselectedAreaId || '',
          equipment_id: '',
          section_id: '',
          description: '',
        });
        setErrors({});
        setShowAdvanced(false);
        setFrequencyManuallySet(false);
        onSuccess();
        onClose();
      }
    } catch (error) {
      logger.error('Error creating task:', error);
      showError('Failed to create cleaning task');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.task_name.trim().length >= 3 && formData.area_id && formData.frequency_type;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
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
          {/* Required Fields Section */}
          <div className="space-y-3">
            {/* Task Name - First field, auto-focused */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                Task Name <span className="text-red-400">*</span>
              </label>
              <input
                ref={taskNameInputRef}
                type="text"
                value={formData.task_name}
                onChange={e => {
                  setFormData({ ...formData, task_name: e.target.value });
                  validateField('task_name', e.target.value);
                }}
                onBlur={e => validateField('task_name', e.target.value)}
                className={`w-full rounded-2xl border ${
                  errors.task_name ? 'border-red-500/50' : 'border-[#2a2a2a]'
                } bg-[#2a2a2a] px-4 py-2.5 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]`}
                placeholder="e.g., Clean kitchen floor"
                required
              />
              {errors.task_name && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.task_name}
                </p>
              )}
              {formData.task_name && !errors.task_name && (
                <p className="mt-1 text-xs text-gray-500">
                  Great! This task will be added to your cleaning grid.
                </p>
              )}
            </div>

            {/* Area - Only show if no area is preselected */}
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

            {/* Frequency */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                Frequency <span className="text-red-400">*</span>
              </label>

              {/* Quick frequency buttons - More prominent */}
              <div className="mb-2 grid grid-cols-3 gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => {
                      setFrequencyManuallySet(true);
                      setFormData({ ...formData, frequency_type: freq });
                      validateField('frequency_type', freq);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      formData.frequency_type === freq
                        ? 'border-[#29E7CD] bg-[#29E7CD]/20 text-[#29E7CD] shadow-lg shadow-[#29E7CD]/20'
                        : 'border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/80'
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>

              {/* Dropdown for all frequency options */}
              <select
                value={formData.frequency_type}
                onChange={e => {
                  setFrequencyManuallySet(true);
                  setFormData({ ...formData, frequency_type: e.target.value });
                  validateField('frequency_type', e.target.value);
                }}
                onBlur={e => validateField('frequency_type', e.target.value)}
                className={`w-full rounded-2xl border ${
                  errors.frequency_type ? 'border-red-500/50' : 'border-[#2a2a2a]'
                } bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]`}
                required
              >
                <optgroup label="Quick Options">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </optgroup>
                <optgroup label="Regular Intervals">
                  <option value="bi-daily">Bi-daily (Every 2 days)</option>
                  <option value="3-monthly">3-Monthly (Quarterly)</option>
                </optgroup>
                <optgroup label="Specific Days">
                  <option value="monday">Every Monday</option>
                  <option value="tuesday">Every Tuesday</option>
                  <option value="wednesday">Every Wednesday</option>
                  <option value="thursday">Every Thursday</option>
                  <option value="friday">Every Friday</option>
                  <option value="saturday">Every Saturday</option>
                  <option value="sunday">Every Sunday</option>
                </optgroup>
                <optgroup label="Custom Interval">
                  <option value="custom-days">Every X days (custom)</option>
                </optgroup>
              </select>

              {suggestedFrequency && formData.frequency_type === suggestedFrequency && (
                <p className="mt-2 flex items-center gap-1 text-xs text-[#29E7CD]">
                  <Icon icon={Info} size="xs" aria-hidden={true} />
                  Auto-selected{' '}
                  {suggestedFrequency.charAt(0).toUpperCase() + suggestedFrequency.slice(1)} based
                  on task name
                </p>
              )}

              {formData.frequency_type === 'custom-days' && (
                <div className="mt-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.customDaysInterval}
                    onChange={e => {
                      const value = parseInt(e.target.value) || 3;
                      setFormData({ ...formData, customDaysInterval: value });
                      validateField('customDaysInterval', value.toString());
                    }}
                    onBlur={e => validateField('customDaysInterval', e.target.value)}
                    className={`w-full rounded-2xl border ${
                      errors.customDaysInterval ? 'border-red-500/50' : 'border-[#2a2a2a]'
                    } bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]`}
                  />
                  {errors.customDaysInterval && (
                    <p className="mt-1 text-xs text-red-400" role="alert">
                      {errors.customDaysInterval}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Task will repeat every {formData.customDaysInterval}{' '}
                    {formData.customDaysInterval === 1 ? 'day' : 'days'}
                  </p>
                </div>
              )}

              {/* Frequency Preview */}
              {formData.frequency_type && formData.area_id && (
                <div className="mt-2">
                  <FrequencyPreview frequencyType={formData.frequency_type} />
                </div>
              )}

              {errors.frequency_type && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.frequency_type}
                </p>
              )}
            </div>
          </div>

          {/* Advanced Options - Collapsible */}
          <div className="border-t border-[#2a2a2a] pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-3 flex w-full items-center justify-between text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <span>Advanced Options (Optional)</span>
              <Icon
                icon={showAdvanced ? ChevronUp : ChevronDown}
                size="sm"
                className="text-gray-400"
                aria-hidden={true}
              />
            </button>

            {showAdvanced && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-200">
                <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">
                      Equipment
                      {filteredEquipment.length < equipment.length && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({filteredEquipment.length} of {equipment.length} shown)
                        </span>
                      )}
                    </label>
                    <select
                      value={formData.equipment_id}
                      onChange={e => setFormData({ ...formData, equipment_id: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    >
                      <option value="">None</option>
                      {filteredEquipment.length > 0
                        ? filteredEquipment.map(eq => (
                            <option key={eq.id} value={eq.id}>
                              {eq.name} ({eq.equipment_type})
                            </option>
                          ))
                        : equipment.map(eq => (
                            <option key={eq.id} value={eq.id}>
                              {eq.name} ({eq.equipment_type})
                            </option>
                          ))}
                    </select>
                    {formData.area_id && filteredEquipment.length < equipment.length && (
                      <p className="mt-1 text-xs text-gray-500">
                        Showing equipment relevant to selected area
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">
                      Section
                      {filteredSections.length < sections.length && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({filteredSections.length} of {sections.length} shown)
                        </span>
                      )}
                    </label>
                    <select
                      value={formData.section_id}
                      onChange={e => setFormData({ ...formData, section_id: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    >
                      <option value="">None</option>
                      {filteredSections.length > 0
                        ? filteredSections.map(section => (
                            <option key={section.id} value={section.id}>
                              {section.name}
                            </option>
                          ))
                        : sections.map(section => (
                            <option key={section.id} value={section.id}>
                              {section.name}
                            </option>
                          ))}
                    </select>
                    {formData.area_id && filteredSections.length < sections.length && (
                      <p className="mt-1 text-xs text-gray-500">
                        Showing sections relevant to selected area
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder="Additional details about this task"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
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

          {/* Keyboard shortcut hint */}
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
