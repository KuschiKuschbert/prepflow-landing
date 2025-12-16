interface ErrorBannerProps {
  error: string | null;
}

/**
 * Component for displaying error banner
 */
export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="mb-4 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
      {error}
    </div>
  );
}




