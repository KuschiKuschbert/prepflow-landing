'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'areas' | 'tasks'>('areas');
  const [showAddArea, setShowAddArea] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', description: '', frequency_days: 7 });
  const [newTask, setNewTask] = useState({ area_id: '', assigned_date: '', notes: '' });

  useEffect(() => {
    fetchAreas();
    fetchTasks();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/cleaning-areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/cleaning-tasks');
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cleaning-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArea)
      });
      const data = await response.json();
      if (data.success) {
        setAreas([...areas, data.data]);
        setNewArea({ name: '', description: '', frequency_days: 7 });
        setShowAddArea(false);
      }
    } catch (error) {
      console.error('Error adding area:', error);
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
          area_id: parseInt(newTask.area_id)
        })
      });
      const data = await response.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setNewTask({ area_id: '', assigned_date: '', notes: '' });
        setShowAddTask(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/cleaning-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          status: 'completed'
        })
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: 'completed', completed_date: data.data.completed_date } : task
        ));
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'overdue': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'overdue': return '⚠️';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-20 bg-[#2a2a2a] rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧹 {t('cleaning.title', 'Cleaning Roster')}
          </h1>
          <p className="text-gray-400">{t('cleaning.subtitle', 'Manage cleaning areas and track completion with photo verification')}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-[#1f1f1f] p-1 rounded-2xl border border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab('areas')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'areas'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📍 {t('cleaning.areas', 'Cleaning Areas')}
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'tasks'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 {t('cleaning.tasks', 'Cleaning Tasks')}
            </button>
          </div>
        </div>

        {/* Areas Tab */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            {/* Add Area Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">{t('cleaning.manageAreas', 'Manage Cleaning Areas')}</h2>
              <button
                onClick={() => setShowAddArea(true)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('cleaning.addArea', 'Add Area')}
              </button>
            </div>

            {/* Add Area Form */}
            {showAddArea && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-4">{t('cleaning.addNewArea', 'Add New Cleaning Area')}</h3>
                <form onSubmit={handleAddArea} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.areaName', 'Area Name')}</label>
                    <input
                      type="text"
                      value={newArea.name}
                      onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="e.g., Kitchen Floors, Prep Tables"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.description', 'Description')}</label>
                    <textarea
                      value={newArea.description}
                      onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="Describe what needs to be cleaned"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.frequency', 'Cleaning Frequency (days)')}</label>
                    <input
                      type="number"
                      value={newArea.frequency_days}
                      onChange={(e) => setNewArea({ ...newArea, frequency_days: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                    >
                      {t('cleaning.save', 'Save Area')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddArea(false)}
                      className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                    >
                      {t('cleaning.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area) => (
                <div key={area.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                      <span className="text-2xl">🧹</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      area.is_active ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                    }`}>
                      {area.is_active ? t('cleaning.active', 'Active') : t('cleaning.inactive', 'Inactive')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{area.name}</h3>
                  <p className="text-gray-400 mb-4">{area.description || t('cleaning.noDescription', 'No description provided')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('cleaning.everyDays', 'Every')} {area.frequency_days} {t('cleaning.days', 'days')}
                    </span>
                    <button className="text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors">
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">{t('cleaning.manageTasks', 'Manage Cleaning Tasks')}</h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('cleaning.addTask', 'Add Task')}
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-4">{t('cleaning.addNewTask', 'Add New Cleaning Task')}</h3>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.selectArea', 'Select Area')}</label>
                    <select
                      value={newTask.area_id}
                      onChange={(e) => setNewTask({ ...newTask, area_id: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('cleaning.selectAreaPlaceholder', 'Choose a cleaning area')}</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.assignedDate', 'Assigned Date')}</label>
                    <input
                      type="date"
                      value={newTask.assigned_date}
                      onChange={(e) => setNewTask({ ...newTask, assigned_date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('cleaning.notes', 'Notes')}</label>
                    <textarea
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="Additional notes or instructions"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                    >
                      {t('cleaning.save', 'Save Task')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                    >
                      {t('cleaning.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                        <span className="text-2xl">{getStatusIcon(task.status)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{task.cleaning_areas.name}</h3>
                        <p className="text-gray-400">{new Date(task.assigned_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  
                  {task.notes && (
                    <p className="text-gray-300 mb-4">{task.notes}</p>
                  )}
                  
                  {task.completed_date && (
                    <p className="text-sm text-green-400 mb-4">
                      ✅ {t('cleaning.completedOn', 'Completed on')} {new Date(task.completed_date).toLocaleString()}
                    </p>
                  )}
                  
                  {task.photo_url && (
                    <div className="mb-4">
                      <img 
                        src={task.photo_url} 
                        alt="Cleaning verification" 
                        className="w-32 h-32 object-cover rounded-2xl border border-[#2a2a2a]"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                      >
                        ✅ {t('cleaning.markComplete', 'Mark Complete')}
                      </button>
                    )}
                    <button className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200">
                      📷 {t('cleaning.addPhoto', 'Add Photo')}
                    </button>
                    <button className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200">
                      ✏️ {t('cleaning.edit', 'Edit')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
