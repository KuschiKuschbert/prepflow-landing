import { ReactNode } from 'react';

interface TermsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function TermsSection({ id, title, children }: TermsSectionProps) {
  return (
    <section
      id={id}
      className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
    >
      <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">{title}</h2>
      {children}
    </section>
  );
}
