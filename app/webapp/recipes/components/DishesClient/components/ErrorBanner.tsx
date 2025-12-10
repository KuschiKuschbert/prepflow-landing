interface ErrorBannerProps {
  error: string | null;
}

/**
 * Component for displaying error banner
 */
export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
      {error}
    </div>
  );
}



