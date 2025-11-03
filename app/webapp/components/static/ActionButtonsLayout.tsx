interface ActionButtonsLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionButtonsLayout({ children, className = '' }: ActionButtonsLayoutProps) {
  return <div className={`mb-8 flex flex-wrap gap-3 ${className}`}>{children}</div>;
}
