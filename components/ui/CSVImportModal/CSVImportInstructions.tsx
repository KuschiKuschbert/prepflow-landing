/**
 * CSV Import Instructions Component
 */
'use client';

interface CSVImportInstructionsProps {
  instructions: string[];
}

export function CSVImportInstructions({ instructions }: CSVImportInstructionsProps) {
  return (
    <div className="rounded-lg border border-[var(--border)]/50 bg-[var(--muted)]/30 p-4">
      <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
        CSV Format Instructions
      </h4>
      <div className="space-y-1 text-xs text-[var(--foreground-muted)]">
        {instructions.map((instruction, index) => (
          <p key={index}>• {instruction}</p>
        ))}
      </div>
    </div>
  );
}
