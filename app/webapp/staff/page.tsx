'use client';

import { logger } from '@/lib/logger';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { Suspense, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { EmployeeForm } from './components/EmployeeForm';
import { StaffHeader } from './components/StaffHeader';
import { StaffList } from './components/StaffList';
import { useStaff } from './hooks/useStaff';

export default function StaffPage() {
  const {
    staff,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    addStaffMember,
    deleteStaffMember,
  } = useStaff();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <ResponsivePageContainer>
      <div className="space-y-8">
        <StaffHeader
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onAddStaff={() => setIsAddModalOpen(true)}
        />

        <Suspense fallback={<PageSkeleton />}>
          <StaffList
            staff={staff}
            qualificationTypes={qualificationTypes}
            onDelete={deleteStaffMember}
            loading={loading}
          />
        </Suspense>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Staff Member"
      >
        <div className="p-1">
          <EmployeeForm
            qualificationTypes={qualificationTypes}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={async (data: any) => {
              try {
                const success = await addStaffMember(data);
                if (success) setIsAddModalOpen(false);
              } catch (err) {
                logger.error('[Staff Page] addStaffMember failed:', { error: err });
              }
            }}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </div>
      </Modal>
    </ResponsivePageContainer>
  );
}
