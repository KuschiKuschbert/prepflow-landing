/**
 * Recipe Card Notes Section Component
 */
'use client';

interface RecipeCardNotesProps {
  notes: string[];
}

export function RecipeCardNotes({ notes }: RecipeCardNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
      <h4 className="mb-1.5 text-xs font-semibold text-[var(--foreground)]">Notes:</h4>
      <ul className="space-y-0.5">
        {notes.map((note, index) => (
          <li key={index} className="text-xs text-[var(--foreground-muted)]">
            • {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
