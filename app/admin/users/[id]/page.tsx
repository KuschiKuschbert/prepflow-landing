'use client';

import { useConfirm } from '@/hooks/useConfirm';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserBasicInfo } from '../components/UserBasicInfo';
import { UserHeader } from '../components/UserHeader';
import { UserSubscriptionInfo } from '../components/UserSubscriptionInfo';
import { useUserDetail } from '../hooks/useUserDetail';

/**
 * User detail page component for admin dashboard.
 * Displays and allows editing of individual user account details.
 *
 * @component
 * @returns {JSX.Element} User detail admin page
 */
export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { user, loading, saving, formData, setFormData, handleSave, handleDelete } =
    useUserDetail(userId);

  const confirmDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user?.email}? This action can't be undone and will delete all associated data.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      await handleDelete();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-64 rounded bg-[#2a2a2a]"></div>
          <div className="h-96 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
          <p className="text-gray-400">User not found</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-[#29E7CD] hover:text-[#29E7CD]/80"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        <UserHeader
          email={user.email}
          saving={saving}
          onSave={handleSave}
          onDelete={confirmDelete}
        />

        {/* User Info Card */}
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-6">
          <UserBasicInfo
            formData={formData}
            setFormData={setFormData}
            email={user.email}
            emailVerified={user.email_verified}
          />

          <UserSubscriptionInfo formData={formData} setFormData={setFormData} user={user} />
        </div>

        {/* User Data Link */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">User Data</h2>
              <p className="text-gray-400">View all data associated with this user</p>
            </div>
            <Link
              href={`/admin/users/${userId}/data`}
              className="rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              View Data
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
