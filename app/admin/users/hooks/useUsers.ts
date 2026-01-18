import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  subscription_status: string;
  created_at: string;
  last_login: string | null;
}

export function useUsers(pageSize = 20) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...(searchQuery && { search: searchQuery }),
        });
        const response = await fetch(`/api/admin/users?${params}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        }
      } catch (error) {
        logger.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page, pageSize, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  return {
    users,
    loading,
    searchQuery,
    setSearchQuery: handleSearch,
    page,
    setPage,
    totalPages,
    total,
  };
}
