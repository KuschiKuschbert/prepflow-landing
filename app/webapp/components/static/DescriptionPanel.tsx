interface DescriptionSection {
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

interface DescriptionPanelProps {
  title: string;
  sections: DescriptionSection[];
  className?: string;
}

export function DescriptionPanel({ title, sections, className = '' }: DescriptionPanelProps) {
  return (
    <div
      className={`tablet:p-6 mb-6 rounded-xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-4 ${className}`}
    >
      <h2 className="mb-2 text-lg font-semibold text-[var(--button-active-text)]">{title}</h2>
      <div className="desktop:grid-cols-2 grid gap-4 text-sm text-[var(--foreground-secondary)]">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className={`mb-2 font-medium ${section.color || 'text-[var(--color-info)]'}`}>
              {section.icon && <span className="mr-2">{section.icon}</span>}
              {section.title}
            </h3>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
