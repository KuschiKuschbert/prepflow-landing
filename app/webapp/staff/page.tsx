/**
 * Staff Management Page
 * Main page for staff/employee management.
 *
 * @module webapp/staff/page
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/app/webapp/components/static/PageHeader';
import { LoadingSkeleton, PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import type { Employee } from '@/app/webapp/roster/types';

export default function StaffPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff/employees');
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to load employees');
        }

        setEmployees(data.employees || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees');
        logger.error('Failed to load employees', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action can't be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/staff/employees/${employeeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to delete employee');
      }

      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      showSuccess('Employee deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete employee';
      showError(errorMessage);
      logger.error('Failed to delete employee', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff Management" icon={Users} />
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff Management" icon={Users} />
        <div className="rounded-3xl border border-red-500/50 bg-red-500/10 p-6">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle="Manage your team members and their details"
        icon={Users}
        actions={
          <Button variant="primary" onClick={() => router.push('/webapp/staff/new')}>
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            Add Employee
          </Button>
        }
      />

      {/* Employees List */}
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
        {employees.map(employee => (
          <div
            key={employee.id}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p className="text-sm text-gray-400">{employee.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/webapp/staff/${employee.id}`)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                  aria-label={`Edit ${employee.first_name} ${employee.last_name}`}
                >
                  <Icon icon={Edit} size="sm" aria-hidden={true} />
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${employee.first_name} ${employee.last_name}`}
                >
                  <Icon icon={Trash2} size="sm" aria-hidden={true} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Role</span>
                <span className="text-white">{employee.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Employment Type</span>
                <span className="text-white">{employee.employment_type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Hourly Rate</span>
                <span className="text-white">${employee.hourly_rate.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/webapp/staff/${employee.id}/onboarding`)}
                className="flex-1"
              >
                Onboarding
              </Button>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-12 text-center">
          <Icon icon={Users} size="xl" className="mx-auto mb-4 text-gray-400" aria-hidden={true} />
          <h3 className="mb-2 text-lg font-semibold text-white">No employees yet</h3>
          <p className="mb-6 text-gray-400">Get started by adding your first team member</p>
          <Button variant="primary" onClick={() => router.push('/webapp/staff/new')}>
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            Add Employee
          </Button>
        </div>
      )}
    </div>
  );
}
