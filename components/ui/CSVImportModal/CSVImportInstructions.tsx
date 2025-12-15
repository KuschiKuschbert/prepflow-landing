/**
 * CSV Import Instructions Component
 */
'use client';

interface CSVImportInstructionsProps {
  instructions: string[];
}

export function CSVImportInstructions({ instructions }: CSVImportInstructionsProps) {
  return (
    <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
      <h4 className="mb-2 text-sm font-semibold text-white">CSV Format Instructions</h4>
      <div className="space-y-1 text-xs text-gray-400">
        {instructions.map((instruction, index) => (
          <p key={index}>• {instruction}</p>
        ))}
      </div>
    </div>
  );
}
