'use client';

import { TablePagination } from '@/components/ui/TablePagination';
import { UserSearch } from './components/UserSearch';
import { UsersTable } from './components/UsersTable';
import { useUsers } from './hooks/useUsers';

/**
 * Users page component for admin dashboard.
 * Manages user accounts with search, pagination, and user detail access.
 *
 * @component
 * @returns {JSX.Element} Users admin page
 */
export default function UsersPage() {
  const { users, loading, searchQuery, setSearchQuery, page, setPage, totalPages, total } =
    useUsers();

  return (
    <div className="space-y-6">
      <UsersPageHeader />

      {/* Search */}
      <UserSearch value={searchQuery} onChange={setSearchQuery} />

      <PaginationControl
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        className="mb-4"
      />

      <UsersTable users={users} loading={loading} />

      <PaginationControl
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  );
}

function UsersPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="mt-2 text-gray-400">Manage user accounts and subscriptions</p>
      </div>
    </div>
  );
}

interface PaginationControlProps {
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function PaginationControl({
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  className,
}: PaginationControlProps) {
  if (loading) return null;
  return (
    <TablePagination
      page={page}
      totalPages={totalPages}
      total={total}
      onPageChange={onPageChange}
      className={className}
    />
  );
}
