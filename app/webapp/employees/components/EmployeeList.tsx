'use client';

import React from 'react';
import { Employee, QualificationType } from '../types';
import { EmployeeCard } from './EmployeeCard';

interface EmployeeListProps {
  employees: Employee[];
  qualificationTypes: QualificationType[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeList({
  employees,
  qualificationTypes,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
          <svg
            className="h-10 w-10 text-[#29E7CD]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden={true}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">No Employees</h3>
        <p className="text-gray-400">Start by adding your kitchen staff and food handlers</p>
      </div>
    );
  }

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-2 grid grid-cols-1 gap-4">
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          qualificationTypes={qualificationTypes}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
