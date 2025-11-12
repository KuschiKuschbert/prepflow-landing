'use client';

interface COGSErrorDisplayProps {
  error?: string | null;
  saveError?: string | null;
  ingredientsAutosaveError?: string | null;
}

export function COGSErrorDisplay({
  error,
  saveError,
  ingredientsAutosaveError,
}: COGSErrorDisplayProps) {
  if (!error && !saveError && !ingredientsAutosaveError) {
    return null;
  }

  return (
    <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      {error || saveError || ingredientsAutosaveError}
    </div>
  );
}
