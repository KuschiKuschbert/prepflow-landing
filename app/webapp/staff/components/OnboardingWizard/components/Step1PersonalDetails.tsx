import type { Employee } from '@/lib/types/roster';

interface Step1PersonalDetailsProps {
  employee: Employee;
}

/**
 * Step 1: Personal Details component
 */
export function Step1PersonalDetails({ employee }: Step1PersonalDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">Step 1: Personal Details</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground-muted)]">First Name</label>
          <input
            type="text"
            value={employee.first_name}
            disabled
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground-muted)]">Last Name</label>
          <input
            type="text"
            value={employee.last_name}
            disabled
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground-muted)]">Email</label>
          <input
            type="email"
            value={employee.email}
            disabled
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-[var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
}
