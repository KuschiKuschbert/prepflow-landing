/**
 * Employee Onboarding Page
 * Multi-step onboarding wizard for new employees.
 *
 * @module webapp/staff/[id]/onboarding/page
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OnboardingWizard } from '../../components/OnboardingWizard';
import { PageHeader } from '@/app/webapp/components/static/PageHeader';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { UserPlus } from 'lucide-react';
import { logger } from '@/lib/logger';
import type { Employee } from '@/app/webapp/roster/types';

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/staff/employees/${employeeId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to load employee');
        }

        setEmployee(data.employee);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee');
        logger.error('Failed to load employee', err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const handleComplete = () => {
    router.push(`/webapp/staff/${employeeId}`);
  };

  const handleCancel = () => {
    router.push('/webapp/staff');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Employee Onboarding" icon={UserPlus} />
        <PageSkeleton />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <PageHeader title="Employee Onboarding" icon={UserPlus} />
        <div className="rounded-3xl border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-6">
          <p className="text-[var(--color-error)]">{error || 'Employee not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Onboarding: ${employee.first_name} ${employee.last_name}`}
        subtitle="Complete the onboarding process for this employee"
        icon={UserPlus}
      />
      <div className="mx-auto max-w-3xl">
        <OnboardingWizard employee={employee} onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    </div>
  );
}
