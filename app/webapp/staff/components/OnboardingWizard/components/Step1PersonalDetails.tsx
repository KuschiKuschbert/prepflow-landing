import type { Employee } from '@/app/webapp/roster/types';

interface Step1PersonalDetailsProps {
  employee: Employee;
}

/**
 * Step 1: Personal Details component
 */
export function Step1PersonalDetails({ employee }: Step1PersonalDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Step 1: Personal Details</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-gray-400">First Name</label>
          <input
            type="text"
            value={employee.first_name}
            disabled
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Last Name</label>
          <input
            type="text"
            value={employee.last_name}
            disabled
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={employee.email}
            disabled
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white"
          />
        </div>
      </div>
    </div>
  );
}
