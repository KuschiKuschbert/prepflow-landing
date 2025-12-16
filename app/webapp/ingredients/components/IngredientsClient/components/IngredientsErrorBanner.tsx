interface IngredientsErrorBannerProps {
  error: string | null;
}

/**
 * Component for displaying error banner
 */
export function IngredientsErrorBanner({ error }: IngredientsErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="mb-6 rounded-lg border border-[var(--color-error)] bg-red-900/20 px-4 py-3 text-[var(--color-error)]">
      {error}
    </div>
  );
}



