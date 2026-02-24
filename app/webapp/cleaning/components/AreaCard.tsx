'use client';
import { Icon } from '@/components/ui/Icon';
import { QRCodeModal } from '@/lib/qr-codes';
import { Plus, QrCode, Sparkles, Trash2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
}

interface AreaCardProps {
  area: CleaningArea;
  onAddTask?: (areaId: string) => void;
  onViewTasks?: (areaId: string) => void;
  onDelete?: (areaId: string) => void;
}

function AreaCardComponent({ area, onAddTask, onViewTasks, onDelete }: AreaCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  // Memoize handlers to prevent recreation on every render
  const handleCardClick = useCallback(() => {
    onViewTasks?.(area.id);
  }, [onViewTasks, area.id]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(area.id);
    },
    [onDelete, area.id],
  );

  const handleAddTaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddTask?.(area.id);
    },
    [onAddTask, area.id],
  );

  const handleQRClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQRModal(true);
  }, []);

  return (
    <>
      <div
        className="group relative cursor-pointer rounded-3xl border-l-2 border-[var(--primary)]/30 bg-[var(--primary)]/2 p-6 transition-all duration-200 hover:bg-[var(--primary)]/5"
        onClick={handleCardClick}
        title="Click to view tasks for this area"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={Sparkles} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              area.is_active
                ? 'border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                : 'border border-[var(--foreground-subtle)]/20 bg-[var(--foreground-subtle)]/10 text-[var(--foreground-muted)]'
            }`}
          >
            {area.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">{area.area_name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-[var(--foreground-muted)]">
          {area.description || 'No description provided'}
        </p>
        <div className="flex items-center justify-between">
          {area.cleaning_frequency && (
            <span className="text-xs text-[var(--foreground-subtle)]">
              {area.cleaning_frequency}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQRClick}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
              title="Generate QR code for this area"
            >
              <Icon icon={QrCode} size="xs" aria-hidden={true} />
              QR
            </button>
            <button
              onClick={handleAddTaskClick}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
              title="Add task to this area"
              aria-label={`Add task to ${area.area_name}`}
            >
              <Icon icon={Plus} size="xs" aria-hidden={true} />
              Add Task
            </button>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="rounded-lg p-1.5 text-[var(--foreground-subtle)] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]"
                title="Delete area"
                aria-label={`Delete ${area.area_name}`}
              >
                <Icon icon={Trash2} size="sm" aria-hidden={true} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        entity={{ id: area.id, name: area.area_name }}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        entityTypeLabel="Cleaning Area"
        urlPattern="/webapp/cleaning?area={id}"
        icon={Sparkles}
        instructions="Scan to view and complete cleaning tasks for this area"
        hint="Staff can mark tasks complete right from their phone!"
        printInstructions="Scan this QR code to view and complete cleaning tasks"
        permanentLinkNote="This QR code stays valid even if you rename the area. Mount it in the cleaning location!"
      />
    </>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if area data actually changed
export const AreaCard = memo(AreaCardComponent, (prevProps, nextProps) => {
  // Props are equal if area data is the same (callbacks are stable via useCallback)
  return (
    prevProps.area.id === nextProps.area.id &&
    prevProps.area.area_name === nextProps.area.area_name &&
    prevProps.area.description === nextProps.area.description &&
    prevProps.area.cleaning_frequency === nextProps.area.cleaning_frequency &&
    prevProps.area.is_active === nextProps.area.is_active
  );
});
