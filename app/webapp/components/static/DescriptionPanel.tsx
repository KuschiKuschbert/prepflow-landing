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
      className={`mb-6 rounded-xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-4 tablet:p-6 ${className}`}
    >
      <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
      <div className="grid gap-4 text-sm text-gray-300 desktop:grid-cols-2">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className={`mb-2 font-medium ${section.color || 'text-[#3B82F6]'}`}>
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
