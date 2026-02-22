'use client';

import type { AppFunction } from '@/app/api/functions/helpers/schemas';
import { Button } from '@/components/ui/Button';
import { logger } from '@/lib/logger';
import { useConfirm } from '@/hooks/useConfirm';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { Icon } from '@/components/ui/Icon';
import { ArrowLeft, Calendar, Edit2, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/static/PageHeader';
import { FunctionEditForm } from './components/FunctionEditForm';
import { FunctionStatsRow } from './components/FunctionStatsRow';
import { RunsheetPanel, type RunsheetItemWithRelations } from './components/RunsheetPanel';

type ExtendedFunction = AppFunction & {
  customers?: {
    first_name: string;
    last_name: string;
    company: string | null;
    phone: string | null;
    email: string | null;
  } | null;
};

export default function FunctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const functionId = params.id as string;
  const { showConfirm, ConfirmDialog } = useConfirm();

  const [func, setFunc] = useState<ExtendedFunction | null>(null);
  const [runsheetItems, setRunsheetItems] = useState<RunsheetItemWithRelations[]>([]);
  const [conflictingCount, setConflictingCount] = useState<number>(0);
  const [customerOptions, setCustomerOptions] = useState<
    Array<{ id: string; first_name: string; last_name: string; company: string | null }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<AppFunction>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunction();
    fetchCustomers();
  }, [functionId]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomerOptions(Array.isArray(data) ? data : []);
      }
    } catch {
      // Non-critical
    }
  };

  const fetchFunction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/functions/${functionId}`);
      if (!res.ok) {
        setError(res.status === 404 ? 'Function not found' : 'Failed to load function');
        return;
      }
      const data = await res.json();
      setFunc(data.function || data);
      setRunsheetItems(data.runsheetItems || []);
      setConflictingCount(typeof data.conflictingCount === 'number' ? data.conflictingCount : 0);
    } catch {
      setError('Failed to load function');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = () => {
    if (!func) return;
    setEditData({
      name: func.name,
      type: func.type,
      start_date: func.start_date,
      start_time: func.start_time,
      end_date: func.end_date,
      end_time: func.end_time,
      same_day: func.same_day,
      attendees: func.attendees,
      customer_id: func.customer_id ?? null,
      location: func.location,
      notes: func.notes,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saveData = { ...editData };
      if (saveData.same_day && saveData.start_date) {
        saveData.end_date = saveData.start_date;
      }
      if (saveData.location !== undefined) {
        saveData.location =
          (typeof saveData.location === 'string' ? saveData.location.trim() : null) || null;
      }
      // Normalize customer_id: empty string fails UUID validation, use null instead
      if (saveData.customer_id === '' || saveData.customer_id === undefined) {
        saveData.customer_id = null;
      }
      // Ensure attendees is a number (schema expects number, not string)
      if (saveData.attendees !== undefined) {
        saveData.attendees = Number(saveData.attendees) || 0;
      }

      const res = await fetch(`/api/functions/${functionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });
      if (res.ok) {
        setIsEditing(false);
        await fetchFunction();
      } else {
        const err = await res.json().catch(() => ({}));
        logger.dev('Function PATCH failed', {
          status: res.status,
          error: err.error,
          hint: err.hint,
          details: err.details,
          sentPayload: saveData,
        });
        const msg =
          err.hint ||
          (err.details?.[0]
            ? `${err.details[0].path?.join('.')}: ${err.details[0].message}`
            : null) ||
          err.error ||
          'Failed to save changes';
        setError(msg);
      }
    } catch {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete this function?',
      message:
        "This will permanently remove the event and its entire runsheet. Can't undo this one, chef.",
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep it',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/functions/${functionId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/webapp/functions');
      } else {
        setError('Failed to delete function');
      }
    } catch {
      setError('Failed to delete function');
    }
  };

  if (isLoading) {
    return (
      <ResponsivePageContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      </ResponsivePageContainer>
    );
  }

  if (error || !func) {
    return (
      <ResponsivePageContainer>
        <div className="flex h-64 flex-col items-center justify-center space-y-4">
          <p className="text-[var(--foreground-muted)]">{error || 'Function not found'}</p>
          <Link href="/webapp/functions">
            <Button variant="outline" size="sm">
              <Icon icon={ArrowLeft} size="sm" className="mr-2" /> Back to Functions
            </Button>
          </Link>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <ConfirmDialog />
      <div className="space-y-6">
        <PageHeader
          title={func.name}
          icon={Calendar}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/webapp/functions">
                <Button variant="outline" size="sm">
                  <Icon icon={ArrowLeft} size="sm" className="mr-2" /> Back
                </Button>
              </Link>
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleStartEdit}>
                    <Icon icon={Edit2} size="sm" className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="text-[var(--color-error)] hover:text-[var(--color-error)]"
                  >
                    <Icon icon={Trash2} size="sm" className="mr-2" /> Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving}>
                    <Icon icon={Save} size="sm" className="mr-2" /> Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <Icon icon={X} size="sm" className="mr-2" /> Cancel
                  </Button>
                </>
              )}
            </div>
          }
        />

        {error && (
          <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4 text-sm text-[var(--color-error)]">
            {error}
            <button className="ml-2 underline" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <FunctionStatsRow
          func={func}
          onAssignClient={
            customerOptions.length > 0 && !func.customer_id ? handleStartEdit : undefined
          }
          conflictingCount={conflictingCount}
        />

        {isEditing && (
          <FunctionEditForm
            editData={editData}
            onEditChange={setEditData}
            customerOptions={customerOptions}
          />
        )}

        <RunsheetPanel func={func} initialItems={runsheetItems} functionId={functionId} />
      </div>
    </ResponsivePageContainer>
  );
}
