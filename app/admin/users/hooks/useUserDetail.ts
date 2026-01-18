import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface UserData {
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

export function useUserDetail(userId: string) {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
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

  return {
    user,
    loading,
    saving,
    formData,
    setFormData,
    handleSave,
    handleDelete,
  };
}
