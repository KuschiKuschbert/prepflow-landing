/**
 * Text-only guide step. Displays description in a styled card.
 * Screenshot format kept for later use.
 */

interface TextGuideProps {
  description: string;
  className?: string;
}

export function TextGuide({ description, className = '' }: TextGuideProps) {
  return (
    <div
      className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 ${className}`}
    >
      <p className="text-fluid-base leading-relaxed text-[var(--foreground-secondary)]">
        {description}
      </p>
    </div>
  );
}
