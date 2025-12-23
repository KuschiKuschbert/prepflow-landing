'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Link2, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';

interface Mapping {
  id: string;
  entity_type: string;
  prepflow_id: string;
  square_id: string;
  sync_direction: string;
  last_synced_at?: string;
}

export function MappingsSection() {
  const { showError } = useNotification();
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    const startTime = performance.now();
    try {
      setLoading(true);
      logger.dev('[Square Mappings] Fetching mappings...');

      const response = await fetch('/api/square/mappings');
      const data = await response.json();

      const fetchTime = performance.now() - startTime;
      logger.dev(`[Square Mappings] API call took ${fetchTime.toFixed(2)}ms`);

      if (response.ok && data.mappings) {
        setMappings(data.mappings || []);
        logger.dev(`[Square Mappings] Loaded ${data.mappings.length} mappings`);
      } else {
        throw new Error(data.error || 'Failed to fetch mappings');
      }
    } catch (error) {
      logger.error('[Square Mappings] Error fetching mappings:', {
        error: error instanceof Error ? error.message : String(error),
        duration: `${(performance.now() - startTime).toFixed(2)}ms`,
      });
      showError('Failed to load mappings');
      setMappings([]);
    } finally {
      setLoading(false);
      logger.dev(`[Square Mappings] Total time: ${(performance.now() - startTime).toFixed(2)}ms`);
    }
  };

  if (loading) {
    return <LoadingSkeleton variant="table" className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Mappings</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          View and manage ID mappings between Square POS and PrepFlow entities
        </p>
      </div>

      {mappings.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Icon icon={Link2} size="lg" className="mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-[var(--foreground-muted)]">No mappings found</p>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Mappings will be created automatically when you sync data
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--border)]/50 to-[var(--border)]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Entity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  PrepFlow ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Square ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Sync Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Last Synced
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {mappings.map(mapping => (
                <tr key={mapping.id} className="transition-colors hover:bg-[var(--border)]/20">
                  <td className="px-6 py-4 text-sm text-[var(--foreground)] capitalize">
                    {mapping.entity_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)] font-mono">
                    {mapping.prepflow_id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)] font-mono">
                    {mapping.square_id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)] capitalize">
                    {mapping.sync_direction.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">
                    {mapping.last_synced_at
                      ? new Date(mapping.last_synced_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
