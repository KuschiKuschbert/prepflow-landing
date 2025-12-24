/**
 * Recipe Card Method Section Component
 */
'use client';

interface RecipeCardMethodProps {
  methodSteps: string[];
}

export function RecipeCardMethod({ methodSteps }: RecipeCardMethodProps) {
  if (methodSteps.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-base font-semibold text-[var(--foreground)]">Method:</h4>
      <ol className="space-y-2">
        {methodSteps.map((step, index) => (
          <li key={index} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-medium text-[var(--primary)]">
              {index + 1}
            </span>
            <span className="desktop:text-sm text-xs leading-relaxed text-[var(--foreground-secondary)]">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
