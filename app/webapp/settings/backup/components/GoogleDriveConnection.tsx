'use client';

interface GoogleDriveConnectionProps {
  onConnectionChange: () => Promise<void>;
}

/**
 * Google Drive Connection Component
 * Placeholder component for Google Drive backup integration.
 */
export function GoogleDriveConnection({ onConnectionChange }: GoogleDriveConnectionProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-6">
      <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
        Google Drive Connection
      </h3>
      <p className="text-sm text-[var(--foreground)]/60">
        Google Drive integration coming soon.
      </p>
    </div>
  );
}
