'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CreditCard,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  subscription_status: string;
  subscription_expires: string | null;
  created_at: string;
  last_login: string | null;
  email_verified: boolean;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    subscription_status: 'trial',
  });

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            first_name: data.user.first_name || '',
            last_name: data.user.last_name || '',
            business_name: data.user.business_name || '',
            subscription_status: data.user.subscription_status || 'trial',
          });
        } else {
          showError('Failed to load user');
          router.push('/admin/users');
        }
      } catch (error) {
        logger.error('Failed to fetch user:', error);
        showError('Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId, router, showError]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        showSuccess('User updated successfully');
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to update user');
      }
    } catch (error) {
      logger.error('Failed to update user:', error);
      showError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user?.email}? This action cannot be undone and will delete all associated data.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('User deleted successfully');
        router.push('/admin/users');
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to delete user');
      }
    } catch (error) {
      logger.error('Failed to delete user:', error);
      showError('Failed to delete user');
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/users" className="text-gray-400 transition-colors hover:text-white">
              <Icon icon={ArrowLeft} size="md" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">User Details</h1>
              <p className="mt-2 text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:opacity-50"
            >
              <Icon icon={Save} size="sm" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Icon icon={Trash2} size="sm" />
              Delete User
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Email</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
                  <Icon icon={Mail} size="sm" />
                  <span>{user.email}</span>
                  {user.email_verified && (
                    <span className="ml-auto text-xs text-green-400">Verified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Subscription</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Status</label>
                <select
                  value={formData.subscription_status}
                  onChange={e => setFormData({ ...formData, subscription_status: e.target.value })}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Created</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
                  <Icon icon={Calendar} size="sm" />
                  <span>{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>
              {user.subscription_expires && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">Expires</label>
                  <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
                    <Icon icon={Calendar} size="sm" />
                    <span>{new Date(user.subscription_expires).toLocaleString()}</span>
                  </div>
                </div>
              )}
              {user.last_login && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">Last Login</label>
                  <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
                    <Icon icon={User} size="sm" />
                    <span>{new Date(user.last_login).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
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
