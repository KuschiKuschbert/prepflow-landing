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
    <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3">
      <h4 className="mb-1.5 text-xs font-semibold text-white">Notes:</h4>
      <ul className="space-y-0.5">
        {notes.map((note, index) => (
          <li key={index} className="text-xs text-gray-400">
            • {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
