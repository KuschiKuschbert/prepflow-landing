'use client';

import type { Customer } from '@/app/api/customers/helpers/schemas';
import type { CreateCustomerData } from '@/app/webapp/customers/components/CreateCustomerForm';
import { CreateCustomerForm } from '@/app/webapp/customers/components/CreateCustomerForm';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/static/PageHeader';

/**
 * Maps API customer to form data.
 */
function toFormData(customer: Customer): CreateCustomerData {
  return {
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email ?? null,
    phone: customer.phone ?? null,
    company: customer.company ?? null,
    address: customer.address ?? null,
    notes: customer.notes ?? null,
  };
}

export default function CustomerEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const id = params?.id as string | undefined;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) {
        setError(res.status === 404 ? 'Customer not found' : 'Failed to load customer');
        return;
      }
      const data = await res.json();
      setCustomer(data);
    } catch (err) {
      logger.error('Failed to fetch customer', { id, error: err });
      setError('Failed to load customer');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleSubmit = async (data: CreateCustomerData) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update customer');
      }
      showSuccess('Customer updated');
      router.push('/webapp/customers');
    } catch (err) {
      throw err;
    }
  };

  if (isLoading) {
    return (
      <ResponsivePageContainer>
        <div className="flex h-32 items-center justify-center text-[var(--foreground-muted)]">
          Loading customer...
        </div>
      </ResponsivePageContainer>
    );
  }

  if (error || !customer) {
    return (
      <ResponsivePageContainer>
        <div className="space-y-4">
          <Link
            href="/webapp/customers"
            className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <Icon icon={ArrowLeft} size="sm" />
            Back to customers
          </Link>
          <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
            {error ?? 'Customer not found'}
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/webapp/customers"
            className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Back to customers"
          >
            <Icon icon={ArrowLeft} size="md" />
          </Link>
          <PageHeader
            title={`Edit ${customer.first_name} ${customer.last_name}`}
            subtitle="Update customer details"
          />
        </div>

        <div className="max-w-2xl">
          <CreateCustomerForm
            initialData={toFormData(customer)}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            onCancel={() => router.push('/webapp/customers')}
          />
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
